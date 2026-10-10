import assert from "node:assert/strict";
import test from "node:test";
import { parseLibraryEntries } from "./catalog.entries.ts";
import { getCatalogBookSlug, parseCatalogBookIdFromSlug } from "./catalog.slug.ts";

test("parses title-author pairs, ISBNs, and ignores empty lines", () => {
  const entries = parseLibraryEntries(`
The Secret History — Donna Tartt
Norwegian Wood - Haruki Murakami
9780141185064

Dune
`);

  assert.deepEqual(entries, [
    { raw: "The Secret History — Donna Tartt", title: "The Secret History", author: "Donna Tartt" },
    { raw: "Norwegian Wood - Haruki Murakami", title: "Norwegian Wood", author: "Haruki Murakami" },
    { raw: "9780141185064", title: "9780141185064", isbn: "9780141185064" },
    { raw: "Dune", title: "Dune" },
  ]);
});

test("parses separate author-only lines as author filters instead of titles", () => {
  assert.deepEqual(parseLibraryEntries("Dune", "Frank Herbert\nUrsula K. Le Guin"), [
    { raw: "Dune", title: "Dune" },
    { raw: "Frank Herbert", title: "", author: "Frank Herbert", authorOnly: true },
    { raw: "Ursula K. Le Guin", title: "", author: "Ursula K. Le Guin", authorOnly: true },
  ]);
});

test("builds a stable trailing-id slug for catalog routes", () => {
  const slug = getCatalogBookSlug({ id: 12, title: "The Secret History" });
  assert.equal(slug, "the-secret-history-12");
  assert.equal(parseCatalogBookIdFromSlug(slug), 12);
  assert.equal(parseCatalogBookIdFromSlug("12"), 12);
});
