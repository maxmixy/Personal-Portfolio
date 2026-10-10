import {
  boolean,
  check,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const books = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  title: text().notNull(),
  subtitle: text(),

  description: text(),

  coverUrl: text(),

  firstPublishedYear: integer(),

  // Work ID identifies the intellectual work; editions identify owned copies.
  openLibraryKey: text(),
  openLibraryEditionId: text(),

  isbn10: text(),
  isbn13: text(),

  pageCount: integer(),

  language: text(),
  publisher: text(),
  publishDate: text(),

  owned: boolean().notNull().default(true),
  readingStatus: text().notNull().default("want-to-read"),
  availability: text().notNull().default("available"),
  rating: integer(),
  notes: text(),
  review: text(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("books_openLibraryEditionId_unique").on(table.openLibraryEditionId),
  check("books_rating_range_check", sql`${table.rating} IS NULL OR (${table.rating} >= 1 AND ${table.rating} <= 5)`),
  check("books_availability_check", sql`${table.availability} IN ('available', 'reserved', 'on-loan', 'lost')`),
]);

export const bookProviderIdentifiers = pgTable("book_provider_identifiers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bookId: integer().notNull().references(() => books.id, { onDelete: "cascade" }),
  provider: text().notNull(),
  externalId: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("book_provider_identifiers_provider_external_unique").on(table.provider, table.externalId),
  uniqueIndex("book_provider_identifiers_book_provider_external_unique").on(table.bookId, table.provider, table.externalId),
  check("book_provider_identifiers_provider_check", sql`${table.provider} IN ('openlibrary', 'googlebooks')`),
]);

export const authors = pgTable("authors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  name: text().notNull(),

  openLibraryKey: text().unique(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const libraryUsers = pgTable("library_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  authUserId: text(),
  email: text().notNull(),
  displayName: text().notNull(),
  role: text().notNull().default("borrower"),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("library_users_email_unique").on(table.email),
  uniqueIndex("library_users_authUserId_unique").on(table.authUserId),
  check("library_users_role_check", sql`${table.role} IN ('borrower', 'owner')`),
]);

export const bookLoans = pgTable("book_loans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bookId: integer().notNull().references(() => books.id, { onDelete: "cascade" }),
  borrowerId: integer().notNull().references(() => libraryUsers.id, { onDelete: "restrict" }),
  status: text().notNull().default("requested"),
  requestNote: text(),
  ownerNote: text(),
  requestedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp({ withTimezone: true }),
  approvedAt: timestamp({ withTimezone: true }),
  borrowedAt: timestamp({ withTimezone: true }),
  expectedReturnAt: timestamp({ withTimezone: true }),
  returnedAt: timestamp({ withTimezone: true }),
}, (table) => [
  check("book_loans_status_check", sql`${table.status} IN ('requested', 'reserved', 'on-loan', 'rejected', 'returned')`),
  uniqueIndex("book_loans_one_open_loan_per_book")
    .on(table.bookId)
    .where(sql`${table.status} IN ('reserved', 'on-loan')`),
]);

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
