export interface CatalogCardDisplayInput {
  title: string;
  authors: string[];
  description: string | null;
  firstPublishedYear: number | null;
  language: string | null;
}

export interface CatalogCardDisplay {
  author: string;
  genre: string;
  readingStatus: string;
  description: string;
  publicationYear: string;
}

export function getCatalogCardDisplay(
  book: CatalogCardDisplayInput,
): CatalogCardDisplay {
  const languageLabel = book.language
    ? book.language.toUpperCase()
    : "Metadata unavailable";

  return {
    author: book.authors[0] ?? "Author unavailable",
    genre: languageLabel,
    readingStatus: "Catalog record",
    description:
      book.description?.trim() || "No description is available for this record yet.",
    publicationYear:
      book.firstPublishedYear?.toString() ?? "Year unavailable",
  };
}
