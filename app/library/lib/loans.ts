import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import { bookLoans, books, libraryUsers } from "@/app/db/schema";

export type LoanAction = "approve" | "reject" | "hand-over" | "return";

export class LoanError extends Error {}

const OPEN_BORROWER_STATUSES = ["requested", "reserved", "on-loan"] as const;

export async function requestBookLoan(bookId: number, borrowerId: number, requestNote: string | null) {
  if (requestNote && requestNote.length > 500) throw new LoanError("Request note must be 500 characters or fewer.");
  const db = getDatabase();

  return db.transaction(async (transaction) => {
    await transaction.execute(sql`SELECT id FROM books WHERE id = ${bookId} FOR UPDATE`);
    const [book] = await transaction.select().from(books).where(eq(books.id, bookId)).limit(1);
    if (!book || !book.owned) throw new LoanError("This book is not available to borrow.");
    if (book.availability !== "available") throw new LoanError("This book is not currently available.");

    const activeRequest = await transaction
      .select({ id: bookLoans.id })
      .from(bookLoans)
      .where(and(eq(bookLoans.bookId, bookId), eq(bookLoans.borrowerId, borrowerId), inArray(bookLoans.status, [...OPEN_BORROWER_STATUSES])))
      .limit(1);
    if (activeRequest.length) throw new LoanError("You already have an active request or loan for this book.");

    const [loan] = await transaction
      .insert(bookLoans)
      .values({ bookId, borrowerId, requestNote })
      .returning({ id: bookLoans.id, status: bookLoans.status });
    return loan;
  });
}

export async function updateLoanAsOwner(
  loanId: number,
  action: LoanAction,
  expectedReturnAt: Date | null,
  ownerNote: string | null,
) {
  if (ownerNote && ownerNote.length > 1000) throw new LoanError("Owner note must be 1,000 characters or fewer.");
  if (expectedReturnAt && Number.isNaN(expectedReturnAt.getTime())) throw new LoanError("Expected return date is invalid.");
  if (expectedReturnAt && expectedReturnAt <= new Date()) throw new LoanError("Expected return date must be in the future.");

  const db = getDatabase();
  return db.transaction(async (transaction) => {
    const [beforeLock] = await transaction.select({ bookId: bookLoans.bookId }).from(bookLoans).where(eq(bookLoans.id, loanId)).limit(1);
    if (!beforeLock) throw new LoanError("Loan request not found.");
    await transaction.execute(sql`SELECT id FROM books WHERE id = ${beforeLock.bookId} FOR UPDATE`);

    const [loan] = await transaction.select().from(bookLoans).where(eq(bookLoans.id, loanId)).limit(1);
    const [book] = await transaction.select().from(books).where(eq(books.id, beforeLock.bookId)).limit(1);
    if (!loan || !book) throw new LoanError("Loan request not found.");

    const now = new Date();
    if (action === "approve" || action === "reject") {
      if (loan.status !== "requested") throw new LoanError("Only pending requests can be reviewed.");
      if (action === "approve") {
        if (book.availability !== "available") throw new LoanError("This book is no longer available.");
        await transaction
          .update(bookLoans)
          .set({ status: "rejected", reviewedAt: now, ownerNote: "Another request was approved." })
          .where(and(eq(bookLoans.bookId, loan.bookId), eq(bookLoans.status, "requested"), ne(bookLoans.id, loanId)));
        await transaction.update(bookLoans).set({
          status: "reserved",
          reviewedAt: now,
          approvedAt: now,
          expectedReturnAt,
          ownerNote,
        }).where(eq(bookLoans.id, loanId));
        await transaction.update(books).set({ availability: "reserved", updatedAt: now }).where(eq(books.id, book.id));
        return "reserved";
      }

      await transaction.update(bookLoans).set({ status: "rejected", reviewedAt: now, ownerNote }).where(eq(bookLoans.id, loanId));
      return "rejected";
    }

    if (action === "hand-over") {
      if (loan.status !== "reserved" || book.availability !== "reserved") throw new LoanError("Only a reserved book can be marked as handed over.");
      await transaction.update(bookLoans).set({ status: "on-loan", borrowedAt: now, ownerNote }).where(eq(bookLoans.id, loanId));
      await transaction.update(books).set({ availability: "on-loan", updatedAt: now }).where(eq(books.id, book.id));
      return "on-loan";
    }

    if (loan.status !== "on-loan" || book.availability !== "on-loan") throw new LoanError("Only an active loan can be marked returned.");
    await transaction.update(bookLoans).set({ status: "returned", returnedAt: now, ownerNote }).where(eq(bookLoans.id, loanId));
    await transaction.update(books).set({ availability: "available", updatedAt: now }).where(eq(books.id, book.id));
    return "returned";
  });
}

export async function listOwnerLoans() {
  return getDatabase()
    .select({
      id: bookLoans.id,
      status: bookLoans.status,
      requestNote: bookLoans.requestNote,
      ownerNote: bookLoans.ownerNote,
      requestedAt: bookLoans.requestedAt,
      expectedReturnAt: bookLoans.expectedReturnAt,
      borrowedAt: bookLoans.borrowedAt,
      bookId: books.id,
      title: books.title,
      borrowerName: libraryUsers.displayName,
      borrowerEmail: libraryUsers.email,
    })
    .from(bookLoans)
    .innerJoin(books, eq(books.id, bookLoans.bookId))
    .innerJoin(libraryUsers, eq(libraryUsers.id, bookLoans.borrowerId))
    .where(inArray(bookLoans.status, ["requested", "reserved", "on-loan"]))
    .orderBy(desc(bookLoans.requestedAt));
}

export async function getLatestUserLoanForBook(bookId: number, userId: number) {
  const [loan] = await getDatabase()
    .select({ id: bookLoans.id, status: bookLoans.status, requestNote: bookLoans.requestNote, ownerNote: bookLoans.ownerNote, expectedReturnAt: bookLoans.expectedReturnAt })
    .from(bookLoans)
    .where(and(eq(bookLoans.bookId, bookId), eq(bookLoans.borrowerId, userId)))
    .orderBy(desc(bookLoans.requestedAt))
    .limit(1);
  return loan;
}

export async function getOwnerLoanForBook(bookId: number) {
  const [loan] = await getDatabase()
    .select({ id: bookLoans.id, status: bookLoans.status, borrowerName: libraryUsers.displayName, expectedReturnAt: bookLoans.expectedReturnAt })
    .from(bookLoans)
    .innerJoin(libraryUsers, eq(libraryUsers.id, bookLoans.borrowerId))
    .where(and(eq(bookLoans.bookId, bookId), inArray(bookLoans.status, ["reserved", "on-loan"])))
    .orderBy(desc(bookLoans.requestedAt))
    .limit(1);
  return loan;
}
