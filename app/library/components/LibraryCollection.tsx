"use client";

import { useMemo, useState } from "react";
import type { BookshelfBook } from "../lib/catalog.display";
import Bookshelf from "./Bookshelf";

const STATUS_FILTERS = [
  "All statuses",
  "Want to read",
  "Reading",
  "Completed",
  "Abandoned",
  "Re-reading",
] as const;

const SORT_OPTIONS = [
  { value: "title", label: "Title A–Z" },
  { value: "author", label: "Author A–Z" },
  { value: "rating", label: "Highest rated" },
] as const;

export default function LibraryCollection({ books }: { books: BookshelfBook[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All statuses");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("title");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    const matches = books.filter((book) => {
      const matchesQuery =
        !normalizedQuery ||
        `${book.title} ${book.authors.join(" ")}`.toLocaleLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "All statuses" || book.readingStatus === status;
      return matchesQuery && matchesStatus;
    });

    return matches.sort((left, right) => {
      if (sort === "author") return left.authorLabel.localeCompare(right.authorLabel, undefined, { sensitivity: "base" });
      if (sort === "rating") return (right.rating ?? 0) - (left.rating ?? 0) || left.title.localeCompare(right.title, undefined, { sensitivity: "base" });
      return left.title.localeCompare(right.title, undefined, { sensitivity: "base", numeric: true });
    });
  }, [books, query, sort, status]);

  return (
    <div>
      <div className="mb-8 grid gap-4 border-b border-[var(--line)] pb-6 sm:grid-cols-[1fr_220px_220px]">
        <label className="grid gap-2 text-xs font-medium" htmlFor="library-search">
          Search titles and authors
          <input
            id="library-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try a title or author"
            className="h-11 border border-[var(--line)] bg-[var(--paper)] px-3 text-sm outline-none focus:border-[var(--coral)]"
          />
        </label>
        <label className="grid gap-2 text-xs font-medium" htmlFor="library-status">
          Reading status
          <select
            id="library-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as (typeof STATUS_FILTERS)[number])}
            className="h-11 border border-[var(--line)] bg-[var(--paper)] px-3 text-sm outline-none focus:border-[var(--coral)]"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-medium" htmlFor="library-sort">
          Sort collection
          <select
            id="library-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as (typeof SORT_OPTIONS)[number]["value"])}
            className="h-11 border border-[var(--line)] bg-[var(--paper)] px-3 text-sm outline-none focus:border-[var(--coral)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-5 text-xs text-[var(--ink-soft)]" aria-live="polite">
        Showing {filteredBooks.length} of {books.length} books
      </p>

      {filteredBooks.length > 0 ? (
        <Bookshelf books={filteredBooks} />
      ) : (
        <p className="border border-dashed border-[var(--line)] bg-[var(--paper)] p-8 text-sm text-[var(--ink-soft)]">
          No books match these filters. Try another title, author, or reading status.
        </p>
      )}
    </div>
  );
}
