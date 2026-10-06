import { NextResponse } from "next/server";
import {
  persistCatalogBook,
  type CatalogBookImportResult,
} from "../lib/catalog";
import type { OpenLibrarySearchResult } from "../lib/openLibrary";

interface ImportRequest {
  results?: OpenLibrarySearchResult[];
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ImportRequest;
    const results = payload.results ?? [];

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Select at least one catalog candidate before importing." },
        { status: 400 },
      );
    }

    if (results.length > 10) {
      return NextResponse.json(
        { error: "Import no more than 10 records at a time." },
        { status: 400 },
      );
    }

    const imported: CatalogBookImportResult[] = [];
    const failures: Array<{ title: string; error: string }> = [];

    for (const result of results) {
      try {
        const persisted = await persistCatalogBook(result);
        imported.push(persisted);
      } catch (error) {
        failures.push({
          title: result.title,
          error: error instanceof Error ? error.message : "The record could not be imported.",
        });
      }
    }

    return NextResponse.json({ imported, failures });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The import could not be completed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
