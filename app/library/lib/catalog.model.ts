import type { OpenLibrarySearchResult } from "./openLibrary.ts";

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
  authors: Array<{
    openLibraryKey: string;
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
    authors: result.authors.map((name, index) => ({
      openLibraryKey: authorIds[index] ?? `author-${index + 1}`,
      name: name.trim(),
    })),
  };
}
