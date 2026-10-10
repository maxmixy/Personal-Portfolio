export interface OpenLibrarySearchInput {
  title?: string;
  author?: string;
  isbn?: string;
  limit?: number;
  offset?: number;
}

export interface OpenLibrarySearchResult {
  provider?: "openlibrary" | "googlebooks";
  providerId?: string;
  providerRecords?: ProviderRecord[];
  openLibraryWorkId?: string;
  openLibraryEditionId?: string;
  openLibraryAuthorIds?: string[];
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  isbn13?: string;
  isbn10?: string;
  publisher?: string;
  publishDate?: string;
  pageCount?: number;
  language?: string;
  coverId?: number;
  coverUrl?: string;
}

export interface ProviderRecord {
  provider: "openlibrary" | "googlebooks";
  id: string;
}

export type CatalogSearchResult = OpenLibrarySearchResult & {
  provider: "openlibrary" | "googlebooks";
  providerId: string;
  providerRecords: ProviderRecord[];
};

interface OpenLibraryRawResult {
  key?: string;
  title?: string;
  author_key?: string[];
  author_name?: string[];
  isbn?: string[];
  isbn_13?: string[];
  isbn_10?: string[];
  publisher?: string[];
  first_publish_year?: number;
  language?: string[];
  cover_i?: number;
  edition_id?: number | string;
  edition_key?: string[];
  lending_edition_s?: string;
  editions?: { docs?: OpenLibraryRawEdition[] };
}

interface OpenLibraryRawEdition {
  key?: string;
  title?: string;
  isbn?: string[];
  isbn_13?: string[];
  isbn_10?: string[];
  publisher?: string[];
  publish_date?: string[];
  language?: string[];
  cover_i?: number;
  number_of_pages?: number;
}

interface OpenLibrarySearchResponse {
  docs?: OpenLibraryRawResult[];
  numFound?: number;
}

const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "author_key",
  "first_publish_year",
  "editions",
  "editions.key",
  "editions.title",
  "editions.isbn",
  "editions.isbn_10",
  "editions.isbn_13",
  "editions.publisher",
  "editions.publish_date",
  "editions.language",
  "editions.cover_i",
  "editions.number_of_pages",
].join(",");

export function buildOpenLibrarySearchUrl({
  title,
  author,
  isbn,
  limit = 5,
  offset = 0,
}: OpenLibrarySearchInput): string {
  const params = new URLSearchParams();
  const normalizedIsbn = isbn?.trim();
  const normalizedTitle = title?.trim();
  const normalizedAuthor = author?.trim();

  if (normalizedIsbn) {
    params.set("isbn", normalizedIsbn);
  } else {
    if (normalizedTitle) params.set("title", normalizedTitle);
    if (normalizedAuthor) params.set("author", normalizedAuthor);
  }

  params.set("limit", String(Math.min(Math.max(limit, 1), 10)));
  params.set("offset", String(Math.max(0, Math.min(offset, 1000))));
  params.set("fields", SEARCH_FIELDS);
  return `https://openlibrary.org/search.json?${params.toString()}`;
}

function pickIsbn(values: string[] | undefined, length: number): string | undefined {
  return values
    ?.map((value) => value.replace(/[-\s]/g, ""))
    .find((value) => value.length === length);
}

export function normalizeOpenLibrarySearchResult(
  value: OpenLibraryRawResult,
): OpenLibrarySearchResult {
  const edition = value.editions?.docs?.[0];
  const workIdMatch = value.key?.match(/\/(?:books|works)\/(OL\d+W)/i);
  const workId = workIdMatch?.[1];
  const authorIds = (value.author_key ?? []).filter(Boolean);
  const language = edition?.language?.[0] ?? value.language?.[0];
  const isbnValues = [
    ...(edition?.isbn_13 ?? []),
    ...(edition?.isbn_10 ?? []),
    ...(edition?.isbn ?? []),
    ...(value.isbn_13 ?? []),
    ...(value.isbn_10 ?? []),
    ...(value.isbn ?? []),
  ];
  const isbn13 = pickIsbn(edition?.isbn_13, 13) ?? pickIsbn(isbnValues, 13);
  const isbn10 = pickIsbn(edition?.isbn_10, 10) ?? pickIsbn(isbnValues, 10);
  const editionId =
    edition?.key?.match(/\/books\/(OL\d+M)/i)?.[1] ??
    value.lending_edition_s ??
    value.edition_key?.[0];
  const coverId = edition?.cover_i ?? value.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : undefined;
  const publishDate = edition?.publish_date?.[0] ??
    (value.first_publish_year ? value.first_publish_year.toString() : undefined);
  const providerId = editionId ?? workId ?? value.key?.replace(/^\//, "") ?? `openlibrary-${value.title ?? "result"}`;
  const providerRecords: ProviderRecord[] = [
    ...(workId ? [{ provider: "openlibrary" as const, id: `work:${workId}` }] : []),
    ...(editionId ? [{ provider: "openlibrary" as const, id: `edition:${editionId}` }] : []),
  ];
  if (!providerRecords.length) providerRecords.push({ provider: "openlibrary", id: providerId });

  return {
    provider: "openlibrary",
    providerId,
    providerRecords,
    openLibraryWorkId: workId,
    openLibraryEditionId: editionId,
    ...(authorIds.length > 0 ? { openLibraryAuthorIds: authorIds } : {}),
    title: edition?.title?.trim() || value.title?.trim() || "Untitled",
    authors: (value.author_name ?? []).filter(Boolean),
    ...(isbn13 ? { isbn13 } : {}),
    ...(isbn10 ? { isbn10 } : {}),
    ...(edition?.publisher?.[0] ? { publisher: edition.publisher[0] } : {}),
    ...(publishDate ? { publishDate } : {}),
    ...(edition?.number_of_pages ? { pageCount: edition.number_of_pages } : {}),
    ...(language ? { language } : {}),
    ...(coverId ? { coverId } : {}),
    ...(coverUrl ? { coverUrl } : {}),
  };
}

export function getOpenLibraryResultIdentity(
  result: OpenLibrarySearchResult,
  index: number,
): string {
  if (result.provider === "googlebooks" && result.providerId) return `googlebooks:${result.providerId}`;
  return result.openLibraryEditionId ?? result.openLibraryWorkId ?? result.isbn13 ?? result.isbn10 ?? `result-${index}`;
}

export async function searchOpenLibrary(input: OpenLibrarySearchInput): Promise<{ results: CatalogSearchResult[]; hasMore: boolean }> {
  const response = await fetch(buildOpenLibrarySearchUrl(input), {
    headers: {
      Accept: "application/json",
      "User-Agent": "PersonalPortfolioLibrary/1.0 (Morrisonyuriandrei2@gmail.com)",
    },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Open Library returned ${response.status}.`);
  }

  const payload: OpenLibrarySearchResponse = await response.json();
  const results = (payload.docs ?? [])
    .filter((result) => result.title)
    .slice(0, Math.min(Math.max(input.limit ?? 5, 1), 10))
    .map((result) => normalizeOpenLibrarySearchResult(result) as CatalogSearchResult);
  const offset = Math.max(0, input.offset ?? 0);
  const hasMore = typeof payload.numFound === "number"
    ? offset + results.length < payload.numFound
    : results.length >= Math.min(Math.max(input.limit ?? 5, 1), 10);
  return { results, hasMore };
}
