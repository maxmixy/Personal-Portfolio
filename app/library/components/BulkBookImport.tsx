"use client";

import { useState } from "react";
import {
  getOpenLibraryResultIdentity,
  OpenLibrarySearchResult,
} from "../lib/openLibrary";

interface SearchResponse {
  results?: OpenLibrarySearchResult[];
  error?: string;
}

interface ImportedBook extends OpenLibrarySearchResult {
  selected: boolean;
}

export default function BulkBookImport() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState<OpenLibrarySearchResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imported, setImported] = useState<ImportedBook[]>([]);

  async function searchBooks(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setImported([]);

    try {
      const response = await fetch(
        `/library/search?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=5`,
      );
      const payload: SearchResponse = await response.json();
      if (!response.ok || !payload.results) {
        throw new Error(payload.error ?? "The search could not be completed.");
      }
      setResults(payload.results);
      setSelectedIds(
        payload.results.map((result, index) =>
          getOpenLibraryResultIdentity(result, index),
        ),
      );
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "The search failed.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelection(result: OpenLibrarySearchResult, index: number) {
    const id = getOpenLibraryResultIdentity(result, index);
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function importSelected() {
    const selected = results.filter((result, index) =>
      selectedIds.includes(getOpenLibraryResultIdentity(result, index)),
    );
    setImported(selected as ImportedBook[]);
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
            Search Open Library for a bounded list of title and author pairs. The
            application never imports an ambiguous result without explicit selection.
          </p>
        </div>

        <form onSubmit={searchBooks} className="mt-10 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-2 text-xs font-medium">
            Book title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              minLength={2}
              maxLength={120}
              className="h-12 border border-[var(--line)] bg-[var(--paper)] px-4 text-sm outline-none focus:border-[var(--coral)]"
              placeholder="e.g. The Secret History"
            />
          </label>
          <label className="grid gap-2 text-xs font-medium">
            Author
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              maxLength={100}
              className="h-12 border border-[var(--line)] bg-[var(--paper)] px-4 text-sm outline-none focus:border-[var(--coral)]"
              placeholder="e.g. Donna Tartt"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-auto h-12 border border-[var(--ink)] bg-[var(--ink)] px-6 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--coral)] disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Searching…" : "Search Open Library"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-5 border border-[var(--coral)] bg-[var(--paper-deep)] p-4 text-sm">
            {error}
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-10 border-t border-[var(--line)] pt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold">Candidate editions</h3>
              <p className="text-xs text-[var(--ink-soft)]">Select the edition to retain locally.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((result, index) => {
                const id = getOpenLibraryResultIdentity(result, index);
                const selected = selectedIds.includes(id);
                return (
                  <label
                    key={id}
                    className="border border-[var(--line)] bg-[var(--paper)] p-5 transition-colors hover:border-[var(--ink)]"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSelection(result, index)}
                      className="mr-3 accent-[var(--coral)]"
                    />
                    <span className="font-semibold">{result.title}</span>
                    <span className="mt-1 block text-sm text-[var(--ink-soft)]">
                      {result.authors.join(", ") || "Author not listed"}
                    </span>
                    <span className="mt-4 block font-mono text-[10px] uppercase tracking-[0.04em] text-[var(--muted)]">
                      {result.isbn13 ? `ISBN-13 ${result.isbn13}` : "ISBN unavailable"}
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={importSelected}
                disabled={selectedIds.length === 0}
                className="h-11 border border-[var(--ink)] bg-[var(--ink)] px-5 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--coral)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Import selected<br />
              </button>
              <p className="text-xs text-[var(--ink-soft)]">
                Preview-only: this implementation does not persist external records yet.
              </p>
            </div>
          </div>
        )}

        {imported.length > 0 && (
          <div className="mt-8 border border-[var(--line)] bg-[var(--paper)] p-5" role="status">
            <h3 className="font-semibold">Import preview ready</h3>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {imported.length} selected candidate{imported.length === 1 ? "" : "s"} received.
              Local persistence and owner-managed data will be added after the catalog model is defined.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
