import { NextResponse } from "next/server";
import { getCurrentLibraryUser } from "../../lib/auth";
import { LoanError, requestBookLoan } from "../../lib/loans";

export async function POST(request: Request) {
  const user = await getCurrentLibraryUser();
  if (!user) return NextResponse.json({ error: "Sign in before requesting a book." }, { status: 401 });
  if (user.role !== "borrower") return NextResponse.json({ error: "Owner accounts cannot request books." }, { status: 403 });

  try {
    const payload = (await request.json()) as { bookId?: unknown; requestNote?: unknown };
    const bookId = Number(payload.bookId);
    const requestNote = typeof payload.requestNote === "string" ? payload.requestNote.trim() || null : null;
    if (!Number.isInteger(bookId) || bookId < 1) {
      return NextResponse.json({ error: "Choose a valid book." }, { status: 400 });
    }
    const loan = await requestBookLoan(bookId, user.id, requestNote);
    return NextResponse.json({ loan }, { status: 201 });
  } catch (error) {
    const message = error instanceof LoanError ? error.message : "The request could not be submitted.";
    return NextResponse.json({ error: message }, { status: error instanceof LoanError ? 400 : 500 });
  }
}
