import type { CatalogSearchResult, ProviderRecord } from "./openLibrary.ts";

function normalizedText(value: string | undefined) {
  return value?.normalize("NFKD").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim() ?? "";
}

function conflictingEdition(left: CatalogSearchResult, right: CatalogSearchResult) {
  if (left.isbn13 && right.isbn13 && left.isbn13 !== right.isbn13) return true;
  if (left.isbn10 && right.isbn10 && left.isbn10 !== right.isbn10) return true;
  const leftYear = left.publishDate?.match(/\b\d{4}\b/)?.[0];
  const rightYear = right.publishDate?.match(/\b\d{4}\b/)?.[0];
  if (leftYear && rightYear && leftYear !== rightYear) return true;
  if (left.publisher && right.publisher && normalizedText(left.publisher) !== normalizedText(right.publisher)) return true;
  return false;
}

function mergeExactEdition(left: CatalogSearchResult, right: CatalogSearchResult): CatalogSearchResult {
  const records = new Map<string, ProviderRecord>();
  for (const record of [...left.providerRecords, ...right.providerRecords]) records.set(`${record.provider}:${record.id}`, record);
  return {
    ...left,
    providerRecords: [...records.values()],
    subtitle: left.subtitle ?? right.subtitle,
    description: left.description ?? right.description,
    authors: left.authors.length ? left.authors : right.authors,
    coverUrl: left.coverUrl ?? right.coverUrl,
    publishDate: left.publishDate ?? right.publishDate,
    publisher: left.publisher ?? right.publisher,
    pageCount: left.pageCount ?? right.pageCount,
    language: left.language ?? right.language,
    isbn10: left.isbn10 ?? right.isbn10,
    isbn13: left.isbn13 ?? right.isbn13,
    openLibraryWorkId: left.openLibraryWorkId ?? right.openLibraryWorkId,
    openLibraryEditionId: left.openLibraryEditionId ?? right.openLibraryEditionId,
    openLibraryAuthorIds: left.openLibraryAuthorIds ?? right.openLibraryAuthorIds,
  };
}

export function mergeCatalogSearchResults(results: CatalogSearchResult[]): CatalogSearchResult[] {
  const merged: CatalogSearchResult[] = [];
  for (const result of results) {
    const sameSourceIndex = merged.findIndex((candidate) => candidate.providerRecords.some((record) =>
      result.providerRecords.some((incoming) => incoming.provider === record.provider && incoming.id === record.id)));
    if (sameSourceIndex >= 0) {
      merged[sameSourceIndex] = mergeExactEdition(merged[sameSourceIndex], result);
      continue;
    }

    const matchingIsbnIndex = merged.findIndex((candidate) => {
      const isbnMatches = !!((candidate.isbn13 && result.isbn13 && candidate.isbn13 === result.isbn13) ||
        (candidate.isbn10 && result.isbn10 && candidate.isbn10 === result.isbn10));
      return isbnMatches && !conflictingEdition(candidate, result);
    });
    if (matchingIsbnIndex >= 0) merged[matchingIsbnIndex] = mergeExactEdition(merged[matchingIsbnIndex], result);
    else merged.push(result);
  }
  return merged;
}
