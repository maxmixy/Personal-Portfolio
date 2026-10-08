"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseLibraryEntries, type LibraryEntry } from "../lib/catalog.entries";
import {
  getOpenLibraryResultIdentity,
  type OpenLibrarySearchResult,
} from "../lib/openLibrary";

interface SearchResponse {
  results?: OpenLibrarySearchResult[];
  error?: string;
}

interface QueryMatch {
  query: LibraryEntry;
  results: OpenLibrarySearchResult[];
  selectedId: string | null;
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
  const [matches, setMatches] = useState<QueryMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importedTitles, setImportedTitles] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  const selectedResults = matches.flatMap((match) => {
    if (!match.selectedId) {
      return [];
    }

    const selected = match.results.find(
      (result, index) => getOpenLibraryResultIdentity(result, index) === match.selectedId,
    );
    return selected ? [selected] : [];
  });
  const needsReview = matches.filter((match) => !match.selectedId);

  async function searchBooks(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entries = parseLibraryEntries(list);

    if (entries.length === 0) {
      setError("Enter at least one title, title — author pair, or ISBN.");
      return;
    }

    setLoading(true);
    setError("");
    setMatches([]);
    setImportedTitles([]);

    try {
      const nextMatches: QueryMatch[] = [];

      for (const [index, entry] of entries.entries()) {
        if (index > 0) {
          await sleep(SEARCH_DELAY_MS);
        }

        const params = new URLSearchParams({ limit: "5" });
        if (entry.isbn) {
          params.set("isbn", entry.isbn);
        } else {
          params.set("title", entry.title);
          if (entry.author) {
            params.set("author", entry.author);
          }
        }

        const response = await fetch(`/library/search?${params.toString()}`);
        const payload: SearchResponse = await response.json();
        if (!response.ok || !payload.results) {
          throw new Error(payload.error ?? "The search could not be completed.");
        }

        nextMatches.push({
          query: entry,
          results: payload.results,
          selectedId: null,
        });
      }

      setMatches(nextMatches);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "The search failed.");
    } finally {
      setLoading(false);
    }
  }

  function selectMatch(queryIndex: number, resultId: string) {
    setMatches((current) =>
      current.map((match, index) =>
        index === queryIndex ? { ...match, selectedId: resultId } : match,
      ),
    );
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
      setMatches([]);
      router.refresh();

      if (payload.failures?.length) {
        setError(
          `${payload.failures.length} selected record${payload.failures.length === 1 ? "" : "s"} could not be persisted.`,
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
            Enter a bounded list of titles, title — author pairs, or ISBNs. Open Library
            returns candidates; nothing is stored until an edition is selected.
          </p>
        </div>

        <form onSubmit={searchBooks} className="mt-10 grid gap-4">
          <label className="grid gap-2 text-xs font-medium">
            Book list
            <textarea
              value={list}
              onChange={(event) => setList(event.target.value)}
              rows={6}
              maxLength={2000}
              className="border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--coral)]"
              placeholder={"The Secret History — Donna Tartt\nNorwegian Wood — Haruki Murakami\n9780141185064"}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-fit border border-[var(--ink)] bg-[var(--ink)] px-6 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--coral)] disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Searching…" : "Search Open Library"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-5 border border-[var(--coral)] bg-[var(--paper-deep)] p-4 text-sm">
            {error}
          </p>
        )}

        {matches.length > 0 && (
          <div className="mt-10 border-t border-[var(--line)] pt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold">Candidate editions</h3>
              <p className="text-xs text-[var(--ink-soft)]">
                Choose one edition per query. Ambiguous lines stay in review.
              </p>
            </div>

            <div className="grid gap-8">
              {matches.map((match, queryIndex) => (
                <fieldset key={`${match.query.raw}-${queryIndex}`} className="border border-[var(--line)] bg-[var(--paper)] p-5">
                  <legend className="px-2 text-sm font-medium">
                    {match.query.raw}
                  </legend>
                  {match.results.length === 0 ? (
                    <p className="text-sm text-[var(--ink-soft)]">No Open Library match. This line needs review.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {match.results.map((result, index) => {
                        const id = getOpenLibraryResultIdentity(result, index);
                        return (
                          <label
                            key={id}
                            className="grid grid-cols-[auto_1fr] items-start gap-3 border border-[var(--line)] p-4 transition-colors hover:border-[var(--ink)]"
                          >
                            <input
                              type="radio"
                              name={`match-${queryIndex}`}
                              checked={match.selectedId === id}
                              onChange={() => selectMatch(queryIndex, id)}
                              className="mt-1 accent-[var(--coral)]"
                            />
                            <span>
                              <span className="font-semibold">{result.title}</span>
                              <span className="mt-1 block text-sm text-[var(--ink-soft)]">
                                {result.authors.join(", ") || "Author not listed"}
                              </span>
                              <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.04em] text-[var(--muted)]">
                                {[
                                  result.publishDate,
                                  result.publisher,
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
                </fieldset>
              ))}
            </div>

            <div className="mt-8 border border-[var(--line)] bg-[var(--paper-deep)] p-5">
              <h3 className="font-semibold">Import preview</h3>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {matches.length} book{matches.length === 1 ? "" : "s"} searched · {selectedResults.length} ready to import · {needsReview.length} need{needsReview.length === 1 ? "s" : ""} review
              </p>
              <ul className="mt-4 grid gap-2 text-sm">
                {selectedResults.map((result) => (
                  <li key={result.openLibraryWorkId ?? result.title}>✓ {result.title}</li>
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
              {importedTitles.length} selected candidate{importedTitles.length === 1 ? "" : "s"} were persisted locally.
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
