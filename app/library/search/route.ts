import { NextResponse } from "next/server";
import { compactIsbn, isIsbnValue } from "../lib/catalog.entries";
import { searchOpenLibrary } from "../lib/openLibrary";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim() ?? "";
  const author = searchParams.get("author")?.trim() ?? "";
  const isbnParam = searchParams.get("isbn")?.trim() ?? "";
  const limit = Number.parseInt(searchParams.get("limit") ?? "5", 10);
  const isbn = isbnParam && isIsbnValue(isbnParam) ? compactIsbn(isbnParam).toUpperCase() : "";

  if (isbnParam && !isbn) {
    return NextResponse.json(
      { error: "Enter a valid ISBN-10 or ISBN-13 value." },
      { status: 400 },
    );
  }

  if (!title && !author && !isbn) {
    return NextResponse.json(
      { error: "Enter a title, author, or ISBN to search." },
      { status: 400 },
    );
  }

  if (title && (title.length < 2 || title.length > 120) && !isbn) {
    return NextResponse.json(
      { error: "Enter a title between 2 and 120 characters." },
      { status: 400 },
    );
  }

  if (author.length > 100) {
    return NextResponse.json(
      { error: "The author value is too long." },
      { status: 400 },
    );
  }

  try {
    const results = await searchOpenLibrary({
      title: isbn ? undefined : title,
      author: isbn ? undefined : author,
      isbn: isbn || undefined,
      limit: Number.isFinite(limit) ? limit : 5,
    });
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Open Library is unavailable.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
