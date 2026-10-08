import assert from "node:assert/strict";
import test from "node:test";
import { prepareCatalogBookRecord } from "./catalog.model.ts";
import type { OpenLibrarySearchResult } from "./openLibrary.ts";

test("prepares a validated catalog record from an Open Library result", () => {
  const result: OpenLibrarySearchResult = {
    openLibraryWorkId: "OL123W",
    openLibraryEditionId: "OL456M",
    openLibraryAuthorIds: ["OL789A"],
    title: "  The Secret History  ",
    authors: ["Donna Tartt"],
    isbn13: "9780141185064",
    isbn10: "0141185068",
    publisher: "Knopf",
    publishDate: "1992",
    language: "eng",
    coverId: 100,
    coverUrl: "https://covers.openlibrary.org/b/id/100-M.jpg",
  };

  assert.deepEqual(prepareCatalogBookRecord(result), {
    openLibraryKey: "OL123W",
    title: "The Secret History",
    subtitle: null,
    description: null,
    coverUrl: "https://covers.openlibrary.org/b/id/100-M.jpg",
    firstPublishedYear: 1992,
    isbn10: "0141185068",
    isbn13: "9780141185064",
    pageCount: null,
    language: "eng",
    owned: true,
    readingStatus: "want-to-read",
    authors: [
      {
        openLibraryKey: "OL789A",
        name: "Donna Tartt",
      },
    ],
  });
});

test("rejects an import without a stable Open Library work identifier", () => {
  const result: OpenLibrarySearchResult = {
    title: "The Secret History",
    authors: ["Donna Tartt"],
  };

  assert.throws(
    () => prepareCatalogBookRecord(result),
    /Open Library work ID is required/,
  );
});
