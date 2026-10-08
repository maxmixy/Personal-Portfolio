import { desc, eq, inArray, like } from "drizzle-orm";
import { ensureLibraryBookColumns, getDatabase } from "@/app/db";
import { authors, bookAuthors, books } from "@/app/db/schema";
import { prepareCatalogBookRecord } from "./catalog.model";
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
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  language: string | null;
  owned: boolean;
  readingStatus: string;
  authors: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogBookImportResult {
  id: number;
  openLibraryKey: string;
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
    const existingBook = await transaction
      .select({ id: books.id })
      .from(books)
      .where(eq(books.openLibraryKey, record.openLibraryKey))
      .limit(1);

    const bookId = existingBook[0]?.id ?? (
      await transaction
        .insert(books)
        .values({
          openLibraryKey: record.openLibraryKey,
          title: record.title,
          subtitle: record.subtitle,
          description: record.description,
          coverUrl: record.coverUrl,
          firstPublishedYear: record.firstPublishedYear,
          isbn10: record.isbn10,
          isbn13: record.isbn13,
          pageCount: record.pageCount,
          language: record.language,
          owned: record.owned,
          readingStatus: record.readingStatus,
        })
        .returning({ id: books.id })
    )[0].id;

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

  const authorsByBook = new Map<number, string[]>();
  for (const row of authorRows) {
    const names = authorsByBook.get(row.bookId) ?? [];
    if (!names.includes(row.name)) {
      names.push(row.name);
    }
    authorsByBook.set(row.bookId, names);
  }

  return bookRows.map((book) => ({
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    coverUrl: book.coverUrl,
    firstPublishedYear: book.firstPublishedYear,
    openLibraryKey: book.openLibraryKey,
    isbn10: book.isbn10,
    isbn13: book.isbn13,
    pageCount: book.pageCount,
    language: book.language,
    owned: book.owned,
    readingStatus: book.readingStatus,
    authors: authorsByBook.get(book.id) ?? [],
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  }));
}
