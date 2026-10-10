import { NextResponse } from "next/server";
import { compactIsbn, isIsbnValue } from "../lib/catalog.entries";
import { searchCatalog } from "../lib/catalog.search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim() ?? "";
  const author = searchParams.get("author")?.trim() ?? "";
  const isbnParam = searchParams.get("isbn")?.trim() ?? "";
  const limit = Number.parseInt(searchParams.get("limit") ?? "5", 10);
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
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

  if (!Number.isInteger(offset) || offset < 0 || offset > 1000) {
    return NextResponse.json({ error: "Search offset must be between 0 and 1000." }, { status: 400 });
  }

  try {
    const search = await searchCatalog({
      title: isbn ? undefined : title,
      author: isbn ? undefined : author,
      isbn: isbn || undefined,
      limit: Number.isFinite(limit) ? limit : 5,
      offset,
    });
    if (search.providers.length === 2) {
      return NextResponse.json({ error: "Both book metadata providers are unavailable.", results: [], providers: search.providers }, { status: 502 });
    }
    return NextResponse.json({ results: search.results, providers: search.providers, hasMore: search.hasMore });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Book search is unavailable.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
