import type { OpenLibrarySearchResult, ProviderRecord } from "./openLibrary.ts";

export type LibraryReadingStatus =
  | "want-to-read"
  | "reading"
  | "completed"
  | "abandoned"
  | "re-reading";

export interface PreparedCatalogBook {
  openLibraryKey: string | null;
  openLibraryEditionId: string | null;
  providerRecords: ProviderRecord[];
  title: string;
  subtitle: string | null;
  description: string | null;
  coverUrl: string | null;
  firstPublishedYear: number | null;
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  language: string | null;
  publisher: string | null;
  publishDate: string | null;
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
  const provider = result.provider ?? "openlibrary";
  const providerId = result.providerId ?? result.openLibraryEditionId ?? result.openLibraryWorkId;
  if (!providerId || !result.title?.trim()) throw new Error("A provider ID and title are required to persist a book.");

  const year = Number.parseInt(result.publishDate ?? "", 10);
  const authorIds = result.openLibraryAuthorIds ?? [];

  return {
    openLibraryKey: result.openLibraryWorkId ?? null,
    openLibraryEditionId: result.openLibraryEditionId ?? null,
    providerRecords: result.providerRecords?.length ? result.providerRecords : [{ provider, id: provider === "openlibrary" ? `${result.openLibraryEditionId ? "edition" : "work"}:${providerId}` : providerId }],
    title: result.title.trim(),
    subtitle: result.subtitle ?? null,
    description: result.description ?? null,
    coverUrl: result.coverUrl ?? null,
    firstPublishedYear: Number.isInteger(year) ? year : null,
    isbn10: result.isbn10 ?? null,
    isbn13: result.isbn13 ?? null,
    pageCount: result.pageCount ?? null,
    language: result.language ?? null,
    publisher: result.publisher ?? null,
    publishDate: result.publishDate ?? null,
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

export function fillMissingCatalogMetadata(
  existing: {
    subtitle: string | null; description: string | null; coverUrl: string | null;
    firstPublishedYear: number | null; isbn10: string | null; isbn13: string | null;
    pageCount: number | null; language: string | null; publisher: string | null;
    publishDate: string | null; openLibraryKey: string | null; openLibraryEditionId: string | null;
  },
  incoming: PreparedCatalogBook,
) {
  return {
    subtitle: existing.subtitle ?? incoming.subtitle,
    description: existing.description ?? incoming.description,
    coverUrl: existing.coverUrl ?? incoming.coverUrl,
    firstPublishedYear: existing.firstPublishedYear ?? incoming.firstPublishedYear,
    isbn10: existing.isbn10 ?? incoming.isbn10,
    isbn13: existing.isbn13 ?? incoming.isbn13,
    pageCount: existing.pageCount ?? incoming.pageCount,
    language: existing.language ?? incoming.language,
    publisher: existing.publisher ?? incoming.publisher,
    publishDate: existing.publishDate ?? incoming.publishDate,
    openLibraryKey: existing.openLibraryKey ?? incoming.openLibraryKey,
    openLibraryEditionId: existing.openLibraryEditionId ?? incoming.openLibraryEditionId,
  };
}
