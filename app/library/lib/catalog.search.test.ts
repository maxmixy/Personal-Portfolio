import assert from "node:assert/strict";
import test from "node:test";
import { mergeCatalogSearchResults, searchCatalog } from "./catalog.search.ts";
import type { CatalogSearchResult } from "./openLibrary.ts";

function candidate(overrides: Partial<CatalogSearchResult> & Pick<CatalogSearchResult, "provider" | "providerId" | "title" | "authors">): CatalogSearchResult {
  return {
    providerRecords: [{ provider: overrides.provider, id: overrides.providerId }],
    ...overrides,
  };
}

test("merges exact ISBN editions across providers and keeps each source ID", () => {
  const results = mergeCatalogSearchResults([
    candidate({ provider: "openlibrary", providerId: "edition:OL1M", openLibraryWorkId: "OL1W", title: "Dune", authors: ["Frank Herbert"], isbn13: "9780441172719", publisher: "Ace", publishDate: "1965", providerRecords: [{ provider: "openlibrary", id: "edition:OL1M" }, { provider: "openlibrary", id: "work:OL1W" }] }),
    candidate({ provider: "googlebooks", providerId: "g-volume", title: "Dune", authors: ["Frank Herbert"], isbn13: "9780441172719", description: "Novel", providerRecords: [{ provider: "googlebooks", id: "g-volume" }] }),
  ]);
  assert.equal(results.length, 1);
  assert.deepEqual(results[0].providerRecords.map(({ provider, id }) => `${provider}:${id}`).sort(), ["googlebooks:g-volume", "openlibrary:edition:OL1M", "openlibrary:work:OL1W"]);
  assert.equal(results[0].description, "Novel");
});

test("does not merge title-only matches or editions with conflicting details", () => {
  const titleOnly = mergeCatalogSearchResults([
    candidate({ provider: "openlibrary", providerId: "OL1W", title: "Dune", authors: ["Frank Herbert"] }),
    candidate({ provider: "googlebooks", providerId: "g1", title: "Dune", authors: ["Frank Herbert"] }),
  ]);
  assert.equal(titleOnly.length, 2);

  const conflicting = mergeCatalogSearchResults([
    candidate({ provider: "openlibrary", providerId: "OL1M", title: "Dune", authors: ["Frank Herbert"], isbn13: "9780441172719", publisher: "Ace", publishDate: "1965" }),
    candidate({ provider: "googlebooks", providerId: "g2", title: "Dune", authors: ["Frank Herbert"], isbn13: "9780441172719", publisher: "Different Press", publishDate: "2000" }),
  ]);
  assert.equal(conflicting.length, 2);
});

test("keeps Open Library results when Google Books fails", async (t) => {
  const oldFetch = globalThis.fetch;
  const previousKey = process.env.GOOGLE_BOOKS_API_KEY;
  process.env.GOOGLE_BOOKS_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = oldFetch;
    if (previousKey === undefined) delete process.env.GOOGLE_BOOKS_API_KEY;
    else process.env.GOOGLE_BOOKS_API_KEY = previousKey;
  });

  globalThis.fetch = (async (input) => {
    const url = new URL(String(input));
    if (url.hostname === "openlibrary.org") return Response.json({ docs: [{ key: "/works/OL1W", title: "Dune", author_name: ["Frank Herbert"] }] });
    return new Response("unavailable", { status: 503 });
  }) as typeof fetch;

  const search = await searchCatalog({ title: "Dune", limit: 5 });
  assert.equal(search.results.length, 1);
  assert.deepEqual(search.providers, [{ provider: "googlebooks", error: "Google Books returned 503." }]);
});

test("returns an empty result set when both providers succeed with no matches", async (t) => {
  const oldFetch = globalThis.fetch;
  const previousKey = process.env.GOOGLE_BOOKS_API_KEY;
  process.env.GOOGLE_BOOKS_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = oldFetch;
    if (previousKey === undefined) delete process.env.GOOGLE_BOOKS_API_KEY;
    else process.env.GOOGLE_BOOKS_API_KEY = previousKey;
  });
  globalThis.fetch = (async (input) => new URL(String(input)).hostname === "openlibrary.org"
    ? Response.json({ docs: [] })
    : Response.json({ totalItems: 0, items: [] })) as typeof fetch;

  const search = await searchCatalog({ title: "No matching book", limit: 5 });
  assert.deepEqual(search.results, []);
  assert.deepEqual(search.providers, []);
  assert.equal(search.hasMore, false);
});

test("reports more pages when either metadata provider has more matches", async (t) => {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.GOOGLE_BOOKS_API_KEY;
  process.env.GOOGLE_BOOKS_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.GOOGLE_BOOKS_API_KEY;
    else process.env.GOOGLE_BOOKS_API_KEY = oldKey;
  });
  globalThis.fetch = (async (input) => new URL(String(input)).hostname === "openlibrary.org"
    ? Response.json({ numFound: 9, docs: [{ key: "/works/OL1W", title: "Dune" }] })
    : Response.json({ totalItems: 1, items: [] })) as typeof fetch;
  const search = await searchCatalog({ title: "Dune", limit: 5, offset: 0 });
  assert.equal(search.hasMore, true);
});

test("reports both provider failures rather than treating them as an empty match", async (t) => {
  const oldFetch = globalThis.fetch;
  const previousKey = process.env.GOOGLE_BOOKS_API_KEY;
  process.env.GOOGLE_BOOKS_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = oldFetch;
    if (previousKey === undefined) delete process.env.GOOGLE_BOOKS_API_KEY;
    else process.env.GOOGLE_BOOKS_API_KEY = previousKey;
  });
  globalThis.fetch = (async () => new Response("unavailable", { status: 503 })) as typeof fetch;

  const search = await searchCatalog({ title: "Dune", limit: 5 });
  assert.deepEqual(search.results, []);
  assert.equal(search.providers.length, 2);
});
