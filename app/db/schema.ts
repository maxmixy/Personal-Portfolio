import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  title: text().notNull(),
  subtitle: text(),

  description: text(),

  coverUrl: text(),

  firstPublishedYear: integer(),

  openLibraryKey: text().unique(),

  isbn10: text(),
  isbn13: text(),

  pageCount: integer(),

  language: text(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const authors = pgTable("authors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  name: text().notNull(),

  openLibraryKey: text().unique(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const bookAuthors = pgTable(
  "book_authors",
  {
    bookId: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),

    authorId: integer()
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.bookId, table.authorId],
    }),
  ],
);