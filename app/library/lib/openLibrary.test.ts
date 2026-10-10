import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOpenLibrarySearchUrl,
  getOpenLibraryResultIdentity,
  normalizeOpenLibrarySearchResult,
} from "./openLibrary.ts";

test("builds a bounded Open Library search request", () => {
  const url = new URL(buildOpenLibrarySearchUrl({
    title: "The Secret History",
    author: "Donna Tartt",
    limit: 5,
    offset: 10,
  }));

  assert.equal(url.origin, "https://openlibrary.org");
  assert.equal(url.pathname, "/search.json");
  assert.equal(url.searchParams.get("title"), "The Secret History");
  assert.equal(url.searchParams.get("author"), "Donna Tartt");
  assert.equal(url.searchParams.get("limit"), "5");
  assert.equal(url.searchParams.get("offset"), "10");
});

test("builds an author-only request without an empty title parameter", () => {
  const url = new URL(buildOpenLibrarySearchUrl({
    title: undefined,
    author: "Suzanne Collins",
    limit: 5,
  }));

  assert.equal(url.searchParams.has("title"), false);
  assert.equal(url.searchParams.get("author"), "Suzanne Collins");
  assert.equal(url.searchParams.get("limit"), "5");
  assert.equal(url.searchParams.has("fields"), true);
});

test("builds an ISBN search without title or author parameters", () => {
  const url = new URL(buildOpenLibrarySearchUrl({
    isbn: "9780141185064",
    title: "The Secret History",
    author: "Donna Tartt",
  }));

  assert.equal(url.searchParams.get("isbn"), "9780141185064");
  assert.equal(url.searchParams.has("title"), false);
  assert.equal(url.searchParams.has("author"), false);
});

test("normalizes the real Open Library search response into a catalog model", () => {
  const result = normalizeOpenLibrarySearchResult({
    key: "/works/OL123W",
    title: "The Secret History",
    author_key: ["OL456A"],
    author_name: ["Donna Tartt"],
    first_publish_year: 1992,
    isbn_13: ["9780141185064"],
    isbn_10: ["0141185068"],
    language: ["eng"],
    cover_i: 100,
    lending_edition_s: "OL789M",
  });

  assert.deepEqual(result, {
    provider: "openlibrary",
    providerId: "OL789M",
    providerRecords: [{ provider: "openlibrary", id: "work:OL123W" }, { provider: "openlibrary", id: "edition:OL789M" }],
    openLibraryWorkId: "OL123W",
    openLibraryEditionId: "OL789M",
    openLibraryAuthorIds: ["OL456A"],
    title: "The Secret History",
    authors: ["Donna Tartt"],
    isbn13: "9780141185064",
    isbn10: "0141185068",
    publishDate: "1992",
    language: "eng",
    coverId: 100,
    coverUrl: "https://covers.openlibrary.org/b/id/100-M.jpg",
  });
});

test("creates unique identities for duplicate titles without provider IDs", () => {
  const first = normalizeOpenLibrarySearchResult({
    key: undefined,
    title: "The Hunger Games",
    author_name: ["Suzanne Collins"],
  });
  const second = normalizeOpenLibrarySearchResult({
    key: undefined,
    title: "The Hunger Games",
    author_name: ["Suzanne Collins"],
  });

  assert.notEqual(
    getOpenLibraryResultIdentity(first, 0),
    getOpenLibraryResultIdentity(second, 1),
  );
});
