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
  }));

  assert.equal(url.origin, "https://openlibrary.org");
  assert.equal(url.pathname, "/search.json");
  assert.equal(url.searchParams.get("title"), "The Secret History");
  assert.equal(url.searchParams.get("author"), "Donna Tartt");
  assert.equal(url.searchParams.get("limit"), "5");
});

test("normalizes a search result without inventing edition metadata", () => {
  const result = normalizeOpenLibrarySearchResult({
    key: "/books/OL123W",
    title: "The Secret History",
    author_name: ["Donna Tartt"],
    first_publish_year: 1992,
    isbn_13: ["9780141185064"],
    cover_i: 100,
    edition_id: 456,
  });

  assert.deepEqual(result, {
    openLibraryWorkId: "OL123W",
    openLibraryEditionId: "OL456M",
    title: "The Secret History",
    authors: ["Donna Tartt"],
    isbn13: "9780141185064",
    publishDate: "1992",
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
