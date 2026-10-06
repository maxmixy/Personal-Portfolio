export interface OpenLibrarySearchInput {
  title: string;
  author?: string;
  limit?: number;
}

export interface OpenLibrarySearchResult {
  openLibraryWorkId?: string;
  openLibraryEditionId?: string;
  title: string;
  authors: string[];
  isbn13?: string;
  isbn10?: string;
  publisher?: string;
  publishDate?: string;
  coverId?: number;
  coverUrl?: string;
}

interface OpenLibraryRawResult {
  key?: string;
  title?: string;
  author_name?: string[];
  isbn_13?: string[];
  isbn_10?: string[];
  publisher?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_id?: number | string;
}

interface OpenLibrarySearchResponse {
  docs?: OpenLibraryRawResult[];
}

export function buildOpenLibrarySearchUrl({
  title,
  author,
  limit = 5,
}: OpenLibrarySearchInput): string {
  const params = new URLSearchParams();
  params.set("title", title.trim());
  if (author?.trim()) params.set("author", author.trim());
  params.set("limit", String(Math.min(Math.max(limit, 1), 10)));
  return `https://openlibrary.org/search.json?${params.toString()}`;
}

export function normalizeOpenLibrarySearchResult(
  value: OpenLibraryRawResult,
): OpenLibrarySearchResult {
  const workIdMatch = value.key?.match(/\/books\/(OL\d+W)/i);
  const workId = workIdMatch?.[1];
  const editionId = value.edition_id;
  const editionIdValue =
    typeof editionId === "number" ? `OL${editionId}M` : undefined;
  const coverUrl = value.cover_i
    ? `https://covers.openlibrary.org/b/id/${value.cover_i}-M.jpg`
    : undefined;

  return {
    openLibraryWorkId: workId,
    openLibraryEditionId: editionIdValue,
    title: value.title?.trim() || "Untitled",
    authors: (value.author_name ?? []).filter(Boolean),
    ...(value.isbn_13?.[0] ? { isbn13: value.isbn_13[0] } : {}),
    ...(value.isbn_10?.[0] ? { isbn10: value.isbn_10[0] } : {}),
    ...(value.publisher?.[0] ? { publisher: value.publisher[0] } : {}),
    ...(value.first_publish_year
      ? { publishDate: value.first_publish_year.toString() }
      : {}),
    ...(value.cover_i ? { coverId: value.cover_i } : {}),
    ...(coverUrl ? { coverUrl } : {}),
  };
}

export function getOpenLibraryResultIdentity(
  result: OpenLibrarySearchResult,
  index: number,
): string {
  return (
    result.openLibraryWorkId ??
    result.openLibraryEditionId ??
    `result-${index}`
  );
}

export async function searchOpenLibrary(input: OpenLibrarySearchInput) {
  const response = await fetch(buildOpenLibrarySearchUrl(input), {
    headers: {
      Accept: "application/json",
      "User-Agent": "PersonalPortfolioLibrary/1.0 (maintainer@example.com)",
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
