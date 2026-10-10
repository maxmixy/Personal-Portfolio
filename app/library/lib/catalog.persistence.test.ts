import assert from "node:assert/strict";
import test from "node:test";
import { fillMissingCatalogMetadata, prepareCatalogBookRecord } from "./catalog.model.ts";
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
    openLibraryEditionId: "OL456M",
    providerRecords: [{ provider: "openlibrary", id: "edition:OL456M" }],
    title: "The Secret History",
    subtitle: null,
    description: null,
    coverUrl: "https://covers.openlibrary.org/b/id/100-M.jpg",
    firstPublishedYear: 1992,
    isbn10: "0141185068",
    isbn13: "9780141185064",
    pageCount: null,
    language: "eng",
    publisher: "Knopf",
    publishDate: "1992",
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

test("rejects an import without a stable provider identifier", () => {
  const result: OpenLibrarySearchResult = {
    title: "The Secret History",
    authors: ["Donna Tartt"],
  };

  assert.throws(
    () => prepareCatalogBookRecord(result),
    /provider ID and title are required/,
  );
});

test("prepares a Google Books-only record without writing its volume ID as an Open Library key", () => {
  const record = prepareCatalogBookRecord({
    provider: "googlebooks",
    providerId: "volume-123",
    providerRecords: [{ provider: "googlebooks", id: "volume-123" }],
    title: "A Google-only book",
    authors: ["A. Writer"],
    description: "Description",
    coverUrl: "https://books.google.com/books?id=volume-123&printsec=frontcover",
  });

  assert.equal(record.openLibraryKey, null);
  assert.equal(record.openLibraryEditionId, null);
  assert.deepEqual(record.providerRecords, [{ provider: "googlebooks", id: "volume-123" }]);
  assert.equal(record.description, "Description");
});

test("fills absent metadata without replacing existing catalog values", () => {
  const incoming = prepareCatalogBookRecord({
    provider: "googlebooks", providerId: "volume-123", title: "Different provider title", authors: ["A. Writer"],
    description: "New description", coverUrl: "https://books.google.com/cover.jpg", publisher: "New publisher", publishDate: "2001", pageCount: 200,
  });
  const merged = fillMissingCatalogMetadata({
    subtitle: null, description: "Existing description", coverUrl: null, firstPublishedYear: null,
    isbn10: null, isbn13: null, pageCount: 100, language: "en", publisher: "Existing publisher",
    publishDate: null, openLibraryKey: "OL1W", openLibraryEditionId: null,
  }, incoming);

  assert.equal(merged.description, "Existing description");
  assert.equal(merged.pageCount, 100);
  assert.equal(merged.publisher, "Existing publisher");
  assert.equal(merged.language, "en");
  assert.equal(merged.coverUrl, "https://books.google.com/cover.jpg");
  assert.equal(merged.openLibraryKey, "OL1W");
  assert.equal(merged.publishDate, "2001");
});
