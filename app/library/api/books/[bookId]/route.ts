import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDatabase } from "@/app/db";
import { books } from "@/app/db/schema";
import { getCurrentLibraryUser } from "../../../lib/auth";

const READING_STATUSES = new Set(["want-to-read", "reading", "completed", "abandoned", "re-reading"]);

interface RouteContext {
  params: Promise<{ bookId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentLibraryUser();
  if (!user || user.role !== "owner") {
    return NextResponse.json({ error: "Only the library owner can edit personal book data." }, { status: 403 });
  }

  try {
    const { bookId: rawBookId } = await context.params;
    const bookId = Number(rawBookId);
    const payload = (await request.json()) as {
      rating?: unknown;
      notes?: unknown;
      review?: unknown;
      readingStatus?: unknown;
    };
    if (!Number.isInteger(bookId) || bookId < 1) {
      return NextResponse.json({ error: "Choose a valid book." }, { status: 400 });
    }

    const changes: Partial<typeof books.$inferInsert> = { updatedAt: new Date() };
    if ("rating" in payload) {
      if (payload.rating !== null && (typeof payload.rating !== "number" || !Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5)) {
        return NextResponse.json({ error: "Rating must be a whole number from 1 to 5, or blank." }, { status: 400 });
      }
      changes.rating = payload.rating as number | null;
    }
    if ("notes" in payload) {
      if (typeof payload.notes !== "string" || payload.notes.length > 5000) {
        return NextResponse.json({ error: "Notes must be 5,000 characters or fewer." }, { status: 400 });
      }
      changes.notes = payload.notes.trim() || null;
    }
    if ("review" in payload) {
      if (typeof payload.review !== "string" || payload.review.length > 10000) {
        return NextResponse.json({ error: "Review must be 10,000 characters or fewer." }, { status: 400 });
      }
      changes.review = payload.review.trim() || null;
    }
    if ("readingStatus" in payload) {
      if (typeof payload.readingStatus !== "string" || !READING_STATUSES.has(payload.readingStatus)) {
        return NextResponse.json({ error: "Choose a valid reading status." }, { status: 400 });
      }
      changes.readingStatus = payload.readingStatus;
    }
    if (Object.keys(changes).length === 1) {
      return NextResponse.json({ error: "No personal metadata was provided." }, { status: 400 });
    }

    const updated = await getDatabase().update(books).set(changes).where(eq(books.id, bookId)).returning({ id: books.id });
    if (!updated.length) return NextResponse.json({ error: "Book not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Personal metadata could not be saved." }, { status: 500 });
  }
}
