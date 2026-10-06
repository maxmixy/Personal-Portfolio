import assert from "node:assert/strict";
import test from "node:test";
import { getCatalogCardDisplay } from "./catalog.display.ts";

test("maps persisted catalog records into display values", () => {
  const display = getCatalogCardDisplay({
    title: "The Secret History",
    authors: ["Donna Tartt"],
    description: "A mystery novel.",
    firstPublishedYear: 1992,
    language: "eng",
  });

  assert.deepEqual(display, {
    author: "Donna Tartt",
    genre: "English",
    readingStatus: "Catalog record",
    description: "A mystery novel.",
    publicationYear: "1992",
  });
});

test("uses safe fallbacks for incomplete persisted records", () => {
  const display = getCatalogCardDisplay({
    title: "Untitled",
    authors: [],
    description: null,
    firstPublishedYear: null,
    language: null,
  });

  assert.deepEqual(display, {
    author: "Author unavailable",
    genre: "Metadata unavailable",
    readingStatus: "Catalog record",
    description: "No description is available for this record yet.",
    publicationYear: "Year unavailable",
  });
});
