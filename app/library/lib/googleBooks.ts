import type { CatalogSearchResult } from "./openLibrary";

export interface GoogleBooksSearchInput {
  title?: string;
  author?: string;
  isbn?: string;
  limit?: number;
  offset?: number;
}

interface GoogleVolume {
  id?: unknown;
  volumeInfo?: {
    title?: unknown;
    subtitle?: unknown;
    authors?: unknown;
    description?: unknown;
    publishedDate?: unknown;
    publisher?: unknown;
    pageCount?: unknown;
    language?: unknown;
    industryIdentifiers?: unknown;
    imageLinks?: { thumbnail?: unknown; smallThumbnail?: unknown };
  };
}

interface GoogleVolumesResponse {
  items?: unknown;
  totalItems?: unknown;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function safeCoverUrl(value: unknown): string | undefined {
  const raw = stringValue(value);
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    if (!new Set(["books.google.com", "books.googleusercontent.com"]).has(url.hostname)) return undefined;
    url.protocol = "https:";
    return url.toString();
  } catch {
    return undefined;
  }
}

function normalizeIsbn(value: unknown, length: 10 | 13): string | undefined {
  if (typeof value !== "string") return undefined;
  const compact = value.replace(/[\s-]/g, "").toUpperCase();
  return compact.length === length && (length === 10 ? /^\d{9}[\dX]$/.test(compact) : /^\d{13}$/.test(compact))
    ? compact
    : undefined;
}

export function normalizeGoogleBook(value: GoogleVolume): CatalogSearchResult | undefined {
  const id = stringValue(value.id);
  const info = value.volumeInfo;
  const title = stringValue(info?.title);
  if (!id || !title || !info) return undefined;

  const identifiers = Array.isArray(info.industryIdentifiers) ? info.industryIdentifiers : [];
  let isbn10: string | undefined;
  let isbn13: string | undefined;
  for (const item of identifiers) {
    if (!item || typeof item !== "object") continue;
    const identifier = item as { type?: unknown; identifier?: unknown };
    if (identifier.type === "ISBN_10") isbn10 ??= normalizeIsbn(identifier.identifier, 10);
    if (identifier.type === "ISBN_13") isbn13 ??= normalizeIsbn(identifier.identifier, 13);
  }

  const publishedDate = stringValue(info.publishedDate);
  const authors = Array.isArray(info.authors)
    ? info.authors.filter((author): author is string => typeof author === "string" && !!author.trim()).map((author) => author.trim()).slice(0, 20)
    : [];
  const pageCount = typeof info.pageCount === "number" && Number.isInteger(info.pageCount) && info.pageCount > 0 ? info.pageCount : undefined;
  const coverUrl = safeCoverUrl(info.imageLinks?.thumbnail) ?? safeCoverUrl(info.imageLinks?.smallThumbnail);
  const providerRecords = [{ provider: "googlebooks" as const, id }];

  return {
    provider: "googlebooks",
    providerId: id,
    providerRecords,
    title,
    ...(stringValue(info.subtitle) ? { subtitle: stringValue(info.subtitle) } : {}),
    authors,
    ...(stringValue(info.description) ? { description: stringValue(info.description) } : {}),
    ...(isbn10 ? { isbn10 } : {}),
    ...(isbn13 ? { isbn13 } : {}),
    ...(stringValue(info.publisher) ? { publisher: stringValue(info.publisher) } : {}),
    ...(publishedDate ? { publishDate: publishedDate } : {}),
    ...(pageCount ? { pageCount } : {}),
    ...(stringValue(info.language) ? { language: stringValue(info.language) } : {}),
    ...(coverUrl ? { coverUrl } : {}),
  };
}

export function buildGoogleBooksSearchUrl({ title, author, isbn, limit = 5, offset = 0 }: GoogleBooksSearchInput, apiKey = ""): string {
  const term = (value: string) => value.trim().replace(/["\\]/g, " ").replace(/\s+/g, " ");
  const query = isbn
    ? `isbn:${isbn}`
    : [title ? `intitle:${term(title)}` : "", author ? `inauthor:${term(author)}` : ""].filter(Boolean).join(" ");
  const params = new URLSearchParams({ q: query, maxResults: String(Math.min(Math.max(limit, 1), 10)), printType: "books" });
  params.set("startIndex", String(Math.max(0, Math.min(offset, 1000))));
  if (apiKey) params.set("key", apiKey);
  return `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;
}

export async function searchGoogleBooks(input: GoogleBooksSearchInput): Promise<{ results: CatalogSearchResult[]; hasMore: boolean }> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) throw new Error("Google Books is not configured (GOOGLE_BOOKS_API_KEY is missing).");

  async function request(url: string) {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`Google Books returned ${response.status}.`);
    const payload = await response.json() as GoogleVolumesResponse;
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const results = items
      .filter((item): item is GoogleVolume => !!item && typeof item === "object")
      .map(normalizeGoogleBook)
      .filter((item): item is CatalogSearchResult => item !== undefined)
      .slice(0, Math.min(Math.max(input.limit ?? 5, 1), 10));
    const totalItems = typeof payload.totalItems === "number" ? payload.totalItems : undefined;
    const offset = Math.max(0, input.offset ?? 0);
    return { results, hasMore: totalItems !== undefined ? offset + results.length < totalItems : results.length >= Math.min(Math.max(input.limit ?? 5, 1), 10) };
  }

  const results = await request(buildGoogleBooksSearchUrl(input, apiKey));
  if (results.results.length || input.isbn || !input.title) return results;

  // Google Books field operators can return no items for title searches. Retry
  // only when a title is present, so author-only searches never become broad
  // free-text searches that can match books about the author.
  const fallbackUrl = new URL(buildGoogleBooksSearchUrl(input, apiKey));
  fallbackUrl.searchParams.set("q", [input.title?.trim(), input.author?.trim()].filter(Boolean).join(" "));
  return request(fallbackUrl.toString());
}
