"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseLibraryEntries, type LibraryEntry } from "../lib/catalog.entries";
import BookCover from "./BookCover";
import { getOpenLibraryResultIdentity, type CatalogSearchResult } from "../lib/openLibrary";
import { mergeCatalogSearchResults } from "../lib/catalog.merge";

interface SearchResponse {
  results?: CatalogSearchResult[];
  providers?: Array<{ provider: "openlibrary" | "googlebooks"; error?: string }>;
  error?: string;
  hasMore?: boolean;
}

interface QueryMatch {
  query: LibraryEntry;
  results: CatalogSearchResult[];
  providerErrors: string[];
  selectedIds: string[];
  offset: number;
  hasMore: boolean;
}

const SEARCH_DELAY_MS = 1100;

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function BulkBookImport() {
  const router = useRouter();
  const [list, setList] = useState("");
  const [authorList, setAuthorList] = useState("");
  const [matches, setMatches] = useState<QueryMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importedTitles, setImportedTitles] = useState<string[]>([]);
  const [importFailures, setImportFailures] = useState<Array<{ title: string; error: string }>>([]);
  const [importing, setImporting] = useState(false);
  const [loadingMoreIndex, setLoadingMoreIndex] = useState<number | null>(null);

  const selectedResults = matches.flatMap((match) => {
    return match.results.filter((result, index) => match.selectedIds.includes(getOpenLibraryResultIdentity(result, index)));
  });
  const needsReview = matches.filter((match) => match.selectedIds.length === 0);

  async function searchBooks(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entries = parseLibraryEntries(list, authorList);

    if (entries.length === 0) {
      setError("Enter at least one title, title — author pair, or ISBN.");
      return;
    }

    setLoading(true);
    setError("");
    setMatches([]);
    setImportedTitles([]);
    setImportFailures([]);

    try {
      const nextMatches: QueryMatch[] = [];

      for (const [index, entry] of entries.entries()) {
        if (index > 0) {
          await sleep(SEARCH_DELAY_MS);
        }

        const params = new URLSearchParams({ limit: "5" });
        if (entry.isbn) {
          params.set("isbn", entry.isbn);
        } else if (entry.authorOnly && entry.author) {
          params.set("author", entry.author);
        } else {
          params.set("title", entry.title);
          if (entry.author) {
            params.set("author", entry.author);
          }
        }

        try {
          const response = await fetch(`/library/search?${params.toString()}`);
          const payload: SearchResponse = await response.json();
          if (!response.ok || !payload.results) throw new Error(payload.error ?? "The search could not be completed.");
          nextMatches.push({
            query: entry,
            results: payload.results,
            providerErrors: (payload.providers ?? []).filter((provider) => provider.error).map((provider) => `${provider.provider === "openlibrary" ? "Open Library" : "Google Books"}: ${provider.error}`),
            selectedIds: [],
            offset: 0,
            hasMore: payload.hasMore ?? false,
          });
        } catch (entryError) {
          nextMatches.push({
            query: entry,
            results: [],
            providerErrors: [entryError instanceof Error ? entryError.message : "The search could not be completed."],
            selectedIds: [],
            offset: 0,
            hasMore: false,
          });
        }
      }

      setMatches(nextMatches);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "The search failed.");
    } finally {
      setLoading(false);
    }
  }

  function toggleMatch(queryIndex: number, resultId: string) {
    setMatches((current) =>
      current.map((match, index) =>
        index === queryIndex
          ? { ...match, selectedIds: match.selectedIds.includes(resultId) ? match.selectedIds.filter((id) => id !== resultId) : [...match.selectedIds, resultId] }
          : match,
      ),
    );
  }

  async function loadMore(queryIndex: number) {
    const match = matches[queryIndex];
    if (!match || !match.hasMore || loadingMoreIndex !== null) return;
    setLoadingMoreIndex(queryIndex);
    try {
      const params = new URLSearchParams({ limit: "5", offset: String(match.offset + 5) });
      if (match.query.isbn) params.set("isbn", match.query.isbn);
      else if (match.query.authorOnly && match.query.author) params.set("author", match.query.author);
      else {
        params.set("title", match.query.title);
        if (match.query.author) params.set("author", match.query.author);
      }
      const response = await fetch(`/library/search?${params.toString()}`);
      const payload: SearchResponse = await response.json();
      if (!response.ok || !payload.results) throw new Error(payload.error ?? "More candidates could not be loaded.");
      setMatches((current) => current.map((item, index) => index === queryIndex ? {
        ...item,
        results: mergeCatalogSearchResults([...item.results, ...payload.results!]),
        providerErrors: (payload.providers ?? []).filter((provider) => provider.error).map((provider) => `${provider.provider === "openlibrary" ? "Open Library" : "Google Books"}: ${provider.error}`),
        offset: Math.min(item.offset + 5, 1000),
        hasMore: item.offset + 5 < 1000 && (payload.hasMore ?? false),
      } : item));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "More candidates could not be loaded.");
    } finally {
      setLoadingMoreIndex(null);
    }
  }

  async function importSelected() {
    if (selectedResults.length === 0) {
      setError("Select at least one reviewed edition before importing.");
      return;
    }

    setImporting(true);
    setError("");

    try {
      const response = await fetch("/library/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: selectedResults }),
      });
      const payload = (await response.json()) as {
        imported?: Array<{ id: number; title: string }>;
        failures?: Array<{ title: string; error: string }>;
        error?: string;
      };

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "The selected records could not be imported.");
      }

      setImportedTitles((payload.imported ?? []).map((book) => book.title));
      setImportFailures(payload.failures ?? []);
      if (!payload.failures?.length) setMatches([]);
      router.refresh();

      if (payload.failures?.length) {
        setError(
          `${payload.imported?.length ?? 0} of ${selectedResults.length} selected edition${selectedResults.length === 1 ? "" : "s"} persisted; ${payload.failures.length} failed. Review the errors below.`,
        );
      }
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "The import failed.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <section className="section-band py-14 md:py-20" aria-labelledby="bulk-import-title">
      <div className="page-width">
        <div className="max-w-2xl">
          <p className="eyebrow">03 / Bulk add</p>
          <h2 id="bulk-import-title" className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
            Find and review editions before importing.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            Search by book title or ISBN, or enter authors separately to find books written by them. Author-only
            searches use provider author fields, so the author name is not treated as a book title.
          </p>
        </div>

        <form onSubmit={searchBooks} className="mt-10 grid gap-4">
          <label className="grid gap-2 text-xs font-medium">
            Book titles or ISBNs
            <textarea
              value={list}
              onChange={(event) => setList(event.target.value)}
              rows={6}
              maxLength={2000}
              className="border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--coral)]"
              placeholder={"The Secret History — Donna Tartt\nNorwegian Wood — Haruki Murakami\n9780141185064"}
            />
          </label>
          <label className="grid gap-2 text-xs font-medium">
            Search by author
            <textarea
              value={authorList}
              onChange={(event) => setAuthorList(event.target.value)}
              rows={3}
              maxLength={1000}
              className="border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--coral)]"
              placeholder={"Donna Tartt\nHaruki Murakami"}
            />
            <span className="font-normal text-[var(--muted)]">One author per line. Results are searched as authored by that person.</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-fit border border-[var(--ink)] bg-[var(--ink)] px-6 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--coral)] disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Searching providers…" : "Search both providers"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-5 border border-[var(--coral)] bg-[var(--paper-deep)] p-4 text-sm">
            {error}
          </p>
        )}

        {importFailures.length > 0 && (
          <div className="mt-4 border border-[var(--coral)] bg-[var(--paper)] p-4" role="alert" aria-label="Import failures">
            <h3 className="text-sm font-semibold">Import errors</h3>
            <ul className="mt-3 grid gap-3 text-sm">
              {importFailures.map((failure, index) => (
                <li key={`${failure.title}-${index}`}>
                  <strong>{failure.title}</strong>
                  <span className="mt-1 block break-words text-[var(--ink-soft)]">{failure.error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-10 border-t border-[var(--line)] pt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold">Candidate editions</h3>
              <p className="text-xs text-[var(--ink-soft)]">
                Select every edition you own for each query. Lines with no selections stay in review.
              </p>
            </div>

            <div className="grid gap-8">
              {matches.map((match, queryIndex) => (
                <fieldset key={`${match.query.raw}-${queryIndex}`} className="border border-[var(--line)] bg-[var(--paper)] p-5">
                  <legend className="px-2 text-sm font-medium">
                    {match.query.raw}
                  </legend>
                  {match.results.length === 0 ? (
                    <p className="text-sm text-[var(--ink-soft)]">No candidates found. This line needs review.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {match.results.map((result, index) => {
                        const id = getOpenLibraryResultIdentity(result, index);
                        return (
                          <label
                            key={id}
                            className="grid grid-cols-[auto_72px_1fr] items-start gap-3 border border-[var(--line)] p-4 transition-colors hover:border-[var(--ink)]"
                          >
                            <input
                              type="checkbox"
                              checked={match.selectedIds.includes(id)}
                              onChange={() => toggleMatch(queryIndex, id)}
                              className="mt-1 accent-[var(--coral)]"
                            />
                            <BookCover src={result.coverUrl ?? null} title={result.title} size="S" />
                            <span>
                              <span className="font-semibold">{result.title}</span>
                              {result.subtitle && <span className="mt-1 block text-xs text-[var(--ink-soft)]">{result.subtitle}</span>}
                              <span className="mt-1 block text-sm text-[var(--ink-soft)]">
                                {result.authors.join(", ") || "Author not listed"}
                              </span>
                              <span className="mt-2 inline-flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-wide text-[var(--coral)]">
                                {[...new Set(result.providerRecords.map((source) => source.provider))].map((source) => <span key={source}>{source === "openlibrary" ? "Open Library" : "Google Books"}</span>)}
                              </span>
                              <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.04em] text-[var(--muted)]">
                                {[
                                  result.publishDate,
                                  result.publisher,
                                  result.pageCount ? `${result.pageCount} pages` : undefined,
                                  result.language,
                                  result.openLibraryEditionId ? `OL edition ${result.openLibraryEditionId}` : result.provider === "googlebooks" ? `Google volume ${result.providerId}` : "Edition ID unavailable",
                                  result.isbn13 ? `ISBN-13 ${result.isbn13}` : result.isbn10 ? `ISBN-10 ${result.isbn10}` : "ISBN unavailable",
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {match.hasMore && (
                    <button type="button" onClick={() => void loadMore(queryIndex)} disabled={loadingMoreIndex !== null} className="mt-4 h-10 border border-[var(--line)] px-4 text-sm font-medium hover:border-[var(--ink)] disabled:opacity-50">
                      {loadingMoreIndex === queryIndex ? "Loading more…" : "Load more candidates"}
                    </button>
                  )}
                  {match.providerErrors.length > 0 && <p role="status" className="mt-4 text-xs leading-5 text-[var(--muted)]">Partial provider result: {match.providerErrors.join(" ")}</p>}
                </fieldset>
              ))}
            </div>

            <div className="mt-8 border border-[var(--line)] bg-[var(--paper-deep)] p-5">
              <h3 className="font-semibold">Import preview</h3>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {matches.length} search quer{matches.length === 1 ? "y" : "ies"} · {selectedResults.length} edition{selectedResults.length === 1 ? "" : "s"} selected · {needsReview.length} quer{needsReview.length === 1 ? "y needs" : "ies need"} review
              </p>
              <ul className="mt-4 grid gap-2 text-sm">
                {selectedResults.map((result, index) => (
                  <li key={getOpenLibraryResultIdentity(result, index)}>✓ {result.title}</li>
                ))}
                {needsReview.map((match) => (
                  <li key={match.query.raw}>⚠ {match.query.raw}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setMatches([]);
                    setImportedTitles([]);
                    setImportFailures([]);
                  }}
                  className="h-11 border border-[var(--line)] px-5 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={importSelected}
                  disabled={selectedResults.length === 0 || importing}
                  className="h-11 border border-[var(--ink)] bg-[var(--ink)] px-5 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--coral)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {importing ? "Importing…" : `Import ${selectedResults.length} book${selectedResults.length === 1 ? "" : "s"}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {importedTitles.length > 0 && (
          <div className="mt-8 border border-[var(--line)] bg-[var(--paper)] p-5" role="status">
            <h3 className="font-semibold">Import complete</h3>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {importFailures.length > 0
                ? `${importedTitles.length} of ${importedTitles.length + importFailures.length} selected editions were persisted locally.`
                : `${importedTitles.length} selected candidate${importedTitles.length === 1 ? " was" : "s were"} persisted locally.`}
            </p>
            <ul className="mt-3 grid gap-1 text-sm">
              {importedTitles.map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
