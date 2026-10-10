import { searchGoogleBooks } from "./googleBooks.ts";
import { searchOpenLibrary, type CatalogSearchResult, type OpenLibrarySearchInput } from "./openLibrary.ts";
export { mergeCatalogSearchResults } from "./catalog.merge.ts";
import { mergeCatalogSearchResults } from "./catalog.merge.ts";

export interface ProviderSearchOutcome {
  provider: "openlibrary" | "googlebooks";
  error?: string;
}

export async function searchCatalog(input: OpenLibrarySearchInput): Promise<{ results: CatalogSearchResult[]; providers: ProviderSearchOutcome[]; hasMore: boolean }> {
  const [openLibrary, googleBooks] = await Promise.allSettled([
    searchOpenLibrary(input),
    searchGoogleBooks(input),
  ]);
  const results: CatalogSearchResult[] = [];
  const providers: ProviderSearchOutcome[] = [];
  if (openLibrary.status === "fulfilled") results.push(...openLibrary.value.results);
  else providers.push({ provider: "openlibrary", error: "Open Library could not be reached." });
  if (googleBooks.status === "fulfilled") results.push(...googleBooks.value.results);
  else providers.push({ provider: "googlebooks", error: googleBooks.reason instanceof Error ? googleBooks.reason.message : "Google Books could not be reached." });
  const offset = input.offset ?? 0;
  return { results: mergeCatalogSearchResults(results), providers, hasMore: offset < 1000 && ((openLibrary.status === "fulfilled" && openLibrary.value.hasMore) || (googleBooks.status === "fulfilled" && googleBooks.value.hasMore)) };
}
