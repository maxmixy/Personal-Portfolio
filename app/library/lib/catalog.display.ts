import { getCatalogBookSlug } from "./catalog.slug.ts";

const READING_STATUS_LABELS: Record<string, string> = {
  "want-to-read": "Want to read",
  reading: "Reading",
  completed: "Completed",
  abandoned: "Abandoned",
  "re-reading": "Re-reading",
};

export interface CatalogCardDisplayInput {
  title: string;
  authors: string[];
  description: string | null;
  firstPublishedYear: number | null;
  language: string | null;
  readingStatus?: string | null;
}

export interface CatalogCardDisplay {
  author: string;
  genre: string;
  readingStatus: string;
  description: string;
  publicationYear: string;
}

export interface BookshelfBook {
  id: number;
  slug: string;
  title: string;
  authors: string[];
  authorLabel: string;
  coverUrl: string | null;
  firstPublishedYear: number | null;
  publicationYear: string;
  readingStatus: string;
  rating: number | null;
  availability: string;
  language: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  eng: "English",
  en: "English",
  spa: "Spanish",
  es: "Spanish",
  fra: "French",
  fr: "French",
  deu: "German",
  de: "German",
  jpn: "Japanese",
  ja: "Japanese",
};

export function getLanguageLabel(language: string | null): string {
  if (!language) {
    return "Metadata unavailable";
  }

  const normalized = language.trim().toLowerCase();
  return LANGUAGE_LABELS[normalized] ?? language.toUpperCase();
}

export function normalizeReadingStatus(value: string | null | undefined): string {
  if (!value) {
    return "want-to-read";
  }

  const normalized = value.trim().toLowerCase();
  return normalized in READING_STATUS_LABELS ? normalized : "want-to-read";
}

export function getReadingStatusLabel(value: string | null | undefined): string {
  return READING_STATUS_LABELS[normalizeReadingStatus(value)] ?? "Want to read";
}

export function getCatalogCardDisplay(
  book: CatalogCardDisplayInput,
): CatalogCardDisplay {
  return {
    author: book.authors[0] ?? "Author unavailable",
    genre: getLanguageLabel(book.language),
    readingStatus: getReadingStatusLabel(book.readingStatus),
    description:
      book.description?.trim() || "No description is available for this record yet.",
    publicationYear:
      book.firstPublishedYear?.toString() ?? "Year unavailable",
  };
}

export function getBookshelfBook(book: {
  id: number;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishedYear: number | null;
  language: string | null;
  readingStatus?: string | null;
  rating?: number | null;
  availability?: string | null;
}): BookshelfBook {
  const display = getCatalogCardDisplay({
    title: book.title,
    authors: book.authors,
    description: null,
    firstPublishedYear: book.firstPublishedYear,
    language: book.language,
    readingStatus: book.readingStatus,
  });

  return {
    id: book.id,
    slug: getCatalogBookSlug(book),
    title: book.title,
    authors: book.authors,
    authorLabel: display.author,
    coverUrl: book.coverUrl,
    firstPublishedYear: book.firstPublishedYear,
    publicationYear: display.publicationYear,
    readingStatus: display.readingStatus,
    rating: book.rating ?? null,
    availability: book.availability ?? "available",
    language: display.genre,
  };
}

export function getCoverUrlForSize(
  coverUrl: string | null,
  size: "S" | "M" | "L",
): string | null {
  if (!coverUrl) {
    return null;
  }

  return coverUrl.replace(/-([SML])\.jpg(?:\?.*)?$/i, `-${size}.jpg`);
}
