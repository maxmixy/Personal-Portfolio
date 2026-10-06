import assert from "node:assert/strict";
import test from "node:test";
import { prepareCatalogBookRecord } from "./catalog.model.ts";

test("catalog transforms an Open Library result into a database-ready record", () => {
  const record = prepareCatalogBookRecord({
    openLibraryWorkId: "OL123W",
    openLibraryAuthorIds: ["OL456A"],
    title: "The Secret History",
    authors: ["Donna Tartt"],
    coverUrl: "https://covers.openlibrary.org/b/id/100-M.jpg",
    language: "eng",
  });

  assert.equal(record.openLibraryKey, "OL123W");
  assert.equal(record.title, "The Secret History");
  assert.deepEqual(record.authors, [{ openLibraryKey: "OL456A", name: "Donna Tartt" }]);
});
