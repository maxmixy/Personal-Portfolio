import { desc, eq, like } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import { authors, bookAuthors, books } from "@/app/db/schema";
import { prepareCatalogBookRecord } from "./catalog.model";
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

export async function listCatalogBooks(limit = 20): Promise<CatalogBook[]> {
  const db = getDatabase();
  const rows = await db
    .select({
      book: books,
      author: authors,
    })
    .from(books)
    .leftJoin(bookAuthors, eq(bookAuthors.bookId, books.id))
    .leftJoin(authors, eq(authors.id, bookAuthors.authorId))
    .orderBy(desc(books.updatedAt))
    .limit(limit);

  return groupCatalogRows(rows);
}

export async function getCatalogBookByOpenLibraryKey(
  openLibraryKey: string,
): Promise<CatalogBook | undefined> {
  const db = getDatabase();
  const rows = await db
    .select({
      book: books,
      author: authors,
    })
    .from(books)
    .leftJoin(bookAuthors, eq(bookAuthors.bookId, books.id))
    .leftJoin(authors, eq(authors.id, bookAuthors.authorId))
    .where(eq(books.openLibraryKey, openLibraryKey));

  return rows.length > 0 ? groupCatalogRows(rows)[0] : undefined;
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
        })
        .returning({ id: books.id })
    )[0].id;

    for (const authorRecord of record.authors) {
      const existingAuthor = await transaction
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.openLibraryKey, authorRecord.openLibraryKey))
        .limit(1);

      const authorId = existingAuthor[0]?.id ?? (
        await transaction
          .insert(authors)
          .values({
            name: authorRecord.name,
            openLibraryKey: authorRecord.openLibraryKey,
          })
          .returning({ id: authors.id })
      )[0].id;

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

function groupCatalogRows(
  rows: Array<{
    book: typeof books.$inferSelect;
    author: typeof authors.$inferSelect | null;
  }>,
): CatalogBook[] {
  const grouped = new Map<number, CatalogBook>();

  for (const row of rows) {
    const current = grouped.get(row.book.id);
    const authorsForBook = current?.authors ?? [];

    if (row.author?.name && !authorsForBook.includes(row.author.name)) {
      authorsForBook.push(row.author.name);
    }

    grouped.set(row.book.id, {
      id: row.book.id,
      title: row.book.title,
      subtitle: row.book.subtitle,
      description: row.book.description,
      coverUrl: row.book.coverUrl,
      firstPublishedYear: row.book.firstPublishedYear,
      openLibraryKey: row.book.openLibraryKey,
      isbn10: row.book.isbn10,
      isbn13: row.book.isbn13,
      pageCount: row.book.pageCount,
      language: row.book.language,
      authors: authorsForBook,
      createdAt: row.book.createdAt,
      updatedAt: row.book.updatedAt,
    });
  }

  return Array.from(grouped.values());
}
