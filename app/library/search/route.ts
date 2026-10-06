import { NextResponse } from "next/server";
import { searchOpenLibrary } from "../lib/openLibrary";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim() ?? "";
  const author = searchParams.get("author")?.trim() ?? "";
  const limit = Number.parseInt(searchParams.get("limit") ?? "5", 10);

  if (title.length < 2 || title.length > 120) {
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
    const results = await searchOpenLibrary({ title, author, limit: Number.isFinite(limit) ? limit : 5 });
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Open Library is unavailable.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
