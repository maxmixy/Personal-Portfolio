export interface OpenLibrarySearchInput {
  title?: string;
  author?: string;
  isbn?: string;
  limit?: number;
}

export interface OpenLibrarySearchResult {
  openLibraryWorkId?: string;
  openLibraryEditionId?: string;
  openLibraryAuthorIds?: string[];
  title: string;
  authors: string[];
  isbn13?: string;
  isbn10?: string;
  publisher?: string;
  publishDate?: string;
  language?: string;
  coverId?: number;
  coverUrl?: string;
}

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
}

interface OpenLibrarySearchResponse {
  docs?: OpenLibraryRawResult[];
}

const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "author_key",
  "isbn",
  "publisher",
  "first_publish_year",
  "language",
  "cover_i",
  "edition_key",
  "lending_edition_s",
].join(",");

export function buildOpenLibrarySearchUrl({
  title,
  author,
  isbn,
  limit = 5,
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
  const workIdMatch = value.key?.match(/\/(?:books|works)\/(OL\d+W)/i);
  const workId = workIdMatch?.[1];
  const authorIds = (value.author_key ?? []).filter(Boolean);
  const language = value.language?.[0];
  const isbnValues = [
    ...(value.isbn_13 ?? []),
    ...(value.isbn_10 ?? []),
    ...(value.isbn ?? []),
  ];
  const isbn13 = pickIsbn(value.isbn_13, 13) ?? pickIsbn(isbnValues, 13);
  const isbn10 = pickIsbn(value.isbn_10, 10) ?? pickIsbn(isbnValues, 10);
  const editionId = value.lending_edition_s ?? value.edition_key?.[0];
  const coverUrl = value.cover_i
    ? `https://covers.openlibrary.org/b/id/${value.cover_i}-M.jpg`
    : undefined;

  return {
    openLibraryWorkId: workId,
    openLibraryEditionId: editionId,
    ...(authorIds.length > 0 ? { openLibraryAuthorIds: authorIds } : {}),
    title: value.title?.trim() || "Untitled",
    authors: (value.author_name ?? []).filter(Boolean),
    ...(isbn13 ? { isbn13 } : {}),
    ...(isbn10 ? { isbn10 } : {}),
    ...(value.publisher?.[0] ? { publisher: value.publisher[0] } : {}),
    ...(value.first_publish_year
      ? { publishDate: value.first_publish_year.toString() }
      : {}),
    ...(language ? { language } : {}),
    ...(value.cover_i ? { coverId: value.cover_i } : {}),
    ...(coverUrl ? { coverUrl } : {}),
  };
}

export function getOpenLibraryResultIdentity(
  result: OpenLibrarySearchResult,
  index: number,
): string {
  return (
    result.openLibraryEditionId ??
    result.openLibraryWorkId ??
    result.isbn13 ??
    result.isbn10 ??
    `result-${index}`
  );
}

export async function searchOpenLibrary(input: OpenLibrarySearchInput) {
  const response = await fetch(buildOpenLibrarySearchUrl(input), {
    headers: {
      Accept: "application/json",
      "User-Agent": "PersonalPortfolioLibrary/1.0 (Morrisonyuriandrei2@gmail.com)",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Open Library returned ${response.status}.`);
  }

  const payload: OpenLibrarySearchResponse = await response.json();
  return (payload.docs ?? [])
    .filter((result) => result.title)
    .slice(0, Math.min(Math.max(input.limit ?? 5, 1), 10))
    .map(normalizeOpenLibrarySearchResult);
}
