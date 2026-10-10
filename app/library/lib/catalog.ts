import { and, desc, eq, inArray, like, or } from "drizzle-orm";
import { ensureLibraryBookColumns, getDatabase } from "@/app/db";
import { authors, bookAuthors, bookProviderIdentifiers, books } from "@/app/db/schema";
import { fillMissingCatalogMetadata, prepareCatalogBookRecord } from "./catalog.model";
import { parseCatalogBookIdFromSlug } from "./catalog.slug";
import type { OpenLibrarySearchResult } from "./openLibrary";

export interface CatalogBook {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverUrl: string | null;
  firstPublishedYear: number | null;
  openLibraryKey: string | null;
  openLibraryEditionId: string | null;
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  language: string | null;
  publisher: string | null;
  publishDate: string | null;
  owned: boolean;
  readingStatus: string;
  availability: string;
  rating: number | null;
  notes: string | null;
  review: string | null;
  providerRecords?: Array<{ provider: "openlibrary" | "googlebooks"; id: string }>;
  authors: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogBookImportResult {
  id: number;
  openLibraryKey: string | null;
  title: string;
  authors: string[];
}

export async function listCatalogBooks(limit = 80): Promise<CatalogBook[]> {
  await ensureLibraryBookColumns();
  const db = getDatabase();
  const bookRows = await db
    .select()
    .from(books)
    .orderBy(desc(books.updatedAt), desc(books.id))
    .limit(limit);

  return attachAuthors(bookRows);
}

export async function getCatalogBookById(
  id: number,
): Promise<CatalogBook | undefined> {
  await ensureLibraryBookColumns();
  const db = getDatabase();
  const bookRows = await db.select().from(books).where(eq(books.id, id)).limit(1);
  const [book] = await attachAuthors(bookRows);
  return book;
}

export async function getCatalogBookBySlug(
  slug: string,
): Promise<CatalogBook | undefined> {
  const id = parseCatalogBookIdFromSlug(slug);
  if (!id) {
    return undefined;
  }

  return getCatalogBookById(id);
}

export async function getCatalogBookByOpenLibraryKey(
  openLibraryKey: string,
): Promise<CatalogBook | undefined> {
  await ensureLibraryBookColumns();
  const db = getDatabase();
  const bookRows = await db
    .select()
    .from(books)
    .where(eq(books.openLibraryKey, openLibraryKey))
    .limit(1);
  const [book] = await attachAuthors(bookRows);
  return book;
}

export async function findAuthorsByName(
  name: string,
  limit = 20,
): Promise<Array<{ id: number; name: string; openLibraryKey: string | null }>> {
  const db = getDatabase();
  return db
    .select({ id: authors.id, name: authors.name, openLibraryKey: authors.openLibraryKey })
    .from(authors)
    .where(like(authors.name, `%${name}%`))
    .limit(limit);
}

export async function persistCatalogBook(
  result: OpenLibrarySearchResult,
): Promise<CatalogBookImportResult> {
  await ensureLibraryBookColumns();
  const db = getDatabase();
  const record = prepareCatalogBookRecord(result);

  return db.transaction(async (transaction) => {
    let existingBook: Array<{ id: number }> = [];
    for (const providerRecord of record.providerRecords) {
      if (providerRecord.provider === "openlibrary" && providerRecord.id.startsWith("work:")) continue;
      existingBook = await transaction
        .select({ id: bookProviderIdentifiers.bookId })
        .from(bookProviderIdentifiers)
        .where(and(eq(bookProviderIdentifiers.provider, providerRecord.provider), eq(bookProviderIdentifiers.externalId, providerRecord.id)))
        .limit(1);
      if (existingBook.length) break;
    }
    if (record.openLibraryEditionId) {
      existingBook = existingBook.length ? existingBook : await transaction
        .select({ id: books.id })
        .from(books)
        .where(eq(books.openLibraryEditionId, record.openLibraryEditionId))
        .limit(1);
    }
    if (!existingBook.length && (record.isbn13 || record.isbn10)) {
      const isbnConditions = [
        ...(record.isbn13 ? [eq(books.isbn13, record.isbn13)] : []),
        ...(record.isbn10 ? [eq(books.isbn10, record.isbn10)] : []),
      ];
      const isbnCandidates = await transaction.select().from(books).where(or(...isbnConditions)).limit(10);
      existingBook = isbnCandidates.filter((candidate) => {
        if (record.isbn13 && candidate.isbn13 && record.isbn13 !== candidate.isbn13) return false;
        if (record.isbn10 && candidate.isbn10 && record.isbn10 !== candidate.isbn10) return false;
        const newYear = record.publishDate?.match(/\b\d{4}\b/)?.[0];
        const oldYear = candidate.publishDate?.match(/\b\d{4}\b/)?.[0];
        if (newYear && oldYear && newYear !== oldYear) return false;
        if (record.publisher && candidate.publisher && record.publisher.trim().toLocaleLowerCase() !== candidate.publisher.trim().toLocaleLowerCase()) return false;
        return true;
      }).slice(0, 1).map(({ id }) => ({ id }));
    }
    if (!existingBook.length && !record.openLibraryEditionId && !record.isbn13 && !record.isbn10 && record.openLibraryKey) {
      existingBook = await transaction
        .select({ id: books.id })
        .from(books)
        .where(eq(books.openLibraryKey, record.openLibraryKey))
        .limit(1);
    }

    const insertedBook = existingBook.length ? undefined : await transaction
        .insert(books)
        .values({
          openLibraryKey: record.openLibraryKey,
          openLibraryEditionId: record.openLibraryEditionId,
          title: record.title,
          subtitle: record.subtitle,
          description: record.description,
          coverUrl: record.coverUrl,
          firstPublishedYear: record.firstPublishedYear,
          isbn10: record.isbn10,
          isbn13: record.isbn13,
          pageCount: record.pageCount,
          language: record.language,
          publisher: record.publisher,
          publishDate: record.publishDate,
          owned: record.owned,
          readingStatus: record.readingStatus,
        })
        .returning({ id: books.id });
    const bookId = existingBook[0]?.id ?? insertedBook?.[0]?.id;
    if (!bookId) throw new Error("The book record could not be persisted.");

    if (existingBook.length) {
      const [existingRecord] = await transaction.select().from(books).where(eq(books.id, bookId)).limit(1);
      if (existingRecord) {
        await transaction.update(books).set(fillMissingCatalogMetadata(existingRecord, record)).where(eq(books.id, bookId));
      }
    }

    for (const providerRecord of record.providerRecords) {
      if (providerRecord.provider === "openlibrary" && providerRecord.id.startsWith("work:")) continue;
      await transaction.insert(bookProviderIdentifiers).values({
        bookId,
        provider: providerRecord.provider,
        externalId: providerRecord.id,
      }).onConflictDoNothing();
    }

    for (const authorRecord of record.authors) {
      let authorId: number | undefined;

      if (authorRecord.openLibraryKey) {
        const existingAuthor = await transaction
          .select({ id: authors.id })
          .from(authors)
          .where(eq(authors.openLibraryKey, authorRecord.openLibraryKey))
          .limit(1);
        authorId = existingAuthor[0]?.id;
      }

      if (!authorId) {
        const existingByName = await transaction
          .select({ id: authors.id })
          .from(authors)
          .where(eq(authors.name, authorRecord.name))
          .limit(1);
        authorId = existingByName[0]?.id;
      }

      if (!authorId) {
        authorId = (
          await transaction
            .insert(authors)
            .values({
              name: authorRecord.name,
              openLibraryKey: authorRecord.openLibraryKey,
            })
            .returning({ id: authors.id })
        )[0].id;
      }

      await transaction
        .insert(bookAuthors)
        .values({ bookId, authorId })
        .onConflictDoNothing();
    }

    return {
      id: bookId,
      openLibraryKey: record.openLibraryKey,
      title: record.title,
      authors: record.authors.map((author) => author.name),
    };
  });
}

async function attachAuthors(
  bookRows: Array<typeof books.$inferSelect>,
): Promise<CatalogBook[]> {
  if (bookRows.length === 0) {
    return [];
  }

  const db = getDatabase();
  const ids = bookRows.map((book) => book.id);
  const authorRows = await db
    .select({
      bookId: bookAuthors.bookId,
      name: authors.name,
    })
    .from(bookAuthors)
    .innerJoin(authors, eq(authors.id, bookAuthors.authorId))
    .where(inArray(bookAuthors.bookId, ids));
  const providerRows = await db
    .select({ bookId: bookProviderIdentifiers.bookId, provider: bookProviderIdentifiers.provider, id: bookProviderIdentifiers.externalId })
    .from(bookProviderIdentifiers)
    .where(inArray(bookProviderIdentifiers.bookId, ids));

  const authorsByBook = new Map<number, string[]>();
  for (const row of authorRows) {
    const names = authorsByBook.get(row.bookId) ?? [];
    if (!names.includes(row.name)) {
      names.push(row.name);
    }
    authorsByBook.set(row.bookId, names);
  }
  const providersByBook = new Map<number, Array<{ provider: "openlibrary" | "googlebooks"; id: string }>>();
  for (const row of providerRows) {
    if (row.provider !== "openlibrary" && row.provider !== "googlebooks") continue;
    const sources = providersByBook.get(row.bookId) ?? [];
    sources.push({ provider: row.provider, id: row.id });
    providersByBook.set(row.bookId, sources);
  }

  return bookRows.map((book) => ({
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    coverUrl: book.coverUrl,
    firstPublishedYear: book.firstPublishedYear,
    openLibraryKey: book.openLibraryKey,
    openLibraryEditionId: book.openLibraryEditionId,
    isbn10: book.isbn10,
    isbn13: book.isbn13,
    pageCount: book.pageCount,
    language: book.language,
    publisher: book.publisher,
    publishDate: book.publishDate,
    owned: book.owned,
    readingStatus: book.readingStatus,
    availability: book.availability,
    rating: book.rating,
    notes: book.notes,
    review: book.review,
    providerRecords: providersByBook.get(book.id) ?? [],
    authors: authorsByBook.get(book.id) ?? [],
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  }));
}
