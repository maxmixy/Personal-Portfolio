import assert from "node:assert/strict";
import test from "node:test";
import { buildGoogleBooksSearchUrl, normalizeGoogleBook, searchGoogleBooks } from "./googleBooks.ts";

test("builds title, author, and ISBN Google Books queries with bounded result counts", () => {
  const titleUrl = new URL(buildGoogleBooksSearchUrl({ title: "Dune", author: "Frank Herbert", limit: 99 }, "server-key"));
  assert.equal(titleUrl.searchParams.get("q"), "intitle:Dune inauthor:Frank Herbert");
  assert.equal(titleUrl.searchParams.get("maxResults"), "10");
  assert.equal(titleUrl.searchParams.get("key"), "server-key");
  const pageUrl = new URL(buildGoogleBooksSearchUrl({ title: "Dune", limit: 5, offset: 10 }));
  assert.equal(pageUrl.searchParams.get("startIndex"), "10");

  const isbnUrl = new URL(buildGoogleBooksSearchUrl({ isbn: "9780441172719" }));
  assert.equal(isbnUrl.searchParams.get("q"), "isbn:9780441172719");
  assert.equal(isbnUrl.searchParams.has("key"), false);
});

test("normalizes Google volume metadata and upgrades trusted cover URLs to HTTPS", () => {
  const result = normalizeGoogleBook({
    id: "volume-123",
    volumeInfo: {
      title: "Dune",
      subtitle: "The Original Novel",
      authors: ["Frank Herbert", null],
      description: "A desert planet.",
      publishedDate: "1965-06",
      publisher: "Chilton Books",
      pageCount: 412,
      language: "en",
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "0441172717" },
        { type: "ISBN_13", identifier: "978-0-441-17271-9" },
      ],
      imageLinks: { thumbnail: "http://books.google.com/books?id=volume-123&img=1" },
    },
  });

  assert.equal(result?.provider, "googlebooks");
  assert.equal(result?.providerId, "volume-123");
  assert.equal(result?.isbn13, "9780441172719");
  assert.equal(result?.coverUrl, "https://books.google.com/books?id=volume-123&img=1");
  assert.equal(result?.pageCount, 412);
  assert.deepEqual(result?.authors, ["Frank Herbert"]);
});

test("ignores malformed fields and rejects unsafe cover hosts or missing IDs/titles", () => {
  const result = normalizeGoogleBook({
    id: "id-1",
    volumeInfo: {
      title: "Untitled metadata record",
      authors: "not-an-array",
      pageCount: -1,
      industryIdentifiers: [{ type: "ISBN_13", identifier: "not-an-isbn" }],
      imageLinks: { thumbnail: "https://attacker.example/cover.jpg" },
    },
  });
  assert.deepEqual(result?.authors, []);
  assert.equal(result?.pageCount, undefined);
  assert.equal(result?.isbn13, undefined);
  assert.equal(result?.coverUrl, undefined);
  assert.equal(normalizeGoogleBook({ volumeInfo: { title: "Missing ID" } }), undefined);
  assert.equal(normalizeGoogleBook({ id: "missing-title", volumeInfo: {} }), undefined);
});

test("retries an empty field-qualified search once with a broader query", async (t) => {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.GOOGLE_BOOKS_API_KEY;
  process.env.GOOGLE_BOOKS_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.GOOGLE_BOOKS_API_KEY;
    else process.env.GOOGLE_BOOKS_API_KEY = oldKey;
  });
  const queries: string[] = [];
  globalThis.fetch = (async (input) => {
    const query = new URL(String(input)).searchParams.get("q") ?? "";
    queries.push(query);
    return query.startsWith("intitle:")
      ? Response.json({ totalItems: 0, items: [] })
      : Response.json({ items: [{ id: "g1", volumeInfo: { title: "Dune", authors: ["Frank Herbert"] } }] });
  }) as typeof fetch;

  const results = await searchGoogleBooks({ title: "Dune", author: "Frank Herbert", limit: 2 });
  assert.deepEqual(queries, ['intitle:Dune inauthor:Frank Herbert', "Dune Frank Herbert"]);
  assert.equal(results.results[0]?.title, "Dune");
});

test("does not broaden an empty author-only search into a title query", async (t) => {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.GOOGLE_BOOKS_API_KEY;
  process.env.GOOGLE_BOOKS_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.GOOGLE_BOOKS_API_KEY;
    else process.env.GOOGLE_BOOKS_API_KEY = oldKey;
  });
  const queries: string[] = [];
  globalThis.fetch = (async (input) => {
    queries.push(new URL(String(input)).searchParams.get("q") ?? "");
    return Response.json({ totalItems: 0, items: [] });
  }) as typeof fetch;

  const results = await searchGoogleBooks({ author: "Frank Herbert", limit: 5 });
  assert.deepEqual(queries, ["inauthor:Frank Herbert"]);
  assert.deepEqual(results.results, []);
});
