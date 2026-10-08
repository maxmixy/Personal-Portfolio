import type { OpenLibrarySearchResult } from "./openLibrary.ts";

export type LibraryReadingStatus =
  | "want-to-read"
  | "reading"
  | "completed"
  | "abandoned"
  | "re-reading";

export interface PreparedCatalogBook {
  openLibraryKey: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverUrl: string | null;
  firstPublishedYear: number | null;
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  language: string | null;
  owned: boolean;
  readingStatus: LibraryReadingStatus;
  authors: Array<{
    openLibraryKey: string | null;
    name: string;
  }>;
}

export function prepareCatalogBookRecord(
  result: OpenLibrarySearchResult,
): PreparedCatalogBook {
  if (!result.openLibraryWorkId) {
    throw new Error("Open Library work ID is required to persist a book.");
  }

  const year = Number.parseInt(result.publishDate ?? "", 10);
  const authorIds = result.openLibraryAuthorIds ?? [];

  return {
    openLibraryKey: result.openLibraryWorkId,
    title: result.title.trim(),
    subtitle: null,
    description: null,
    coverUrl: result.coverUrl ?? null,
    firstPublishedYear: Number.isInteger(year) ? year : null,
    isbn10: result.isbn10 ?? null,
    isbn13: result.isbn13 ?? null,
    pageCount: null,
    language: result.language ?? null,
    owned: true,
    readingStatus: "want-to-read",
    authors: result.authors
      .map((name, index) => ({
        openLibraryKey: authorIds[index] ?? null,
        name: name.trim(),
      }))
      .filter((author) => author.name.length > 0),
  };
}
