import { NextResponse } from "next/server";
import {
  persistCatalogBook,
  type CatalogBookImportResult,
} from "../lib/catalog";
import type { CatalogSearchResult } from "../lib/openLibrary";
import { getCurrentLibraryUser } from "../lib/auth";

interface ImportRequest {
  results?: CatalogSearchResult[];
}

export async function POST(request: Request) {
  const user = await getCurrentLibraryUser();
  if (!user || user.role !== "owner") {
    return NextResponse.json({ error: "Only the library owner can import catalog records." }, { status: 403 });
  }

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

    if (results.some((result) => !result || !["openlibrary", "googlebooks"].includes(result.provider) ||
      typeof result.providerId !== "string" || result.providerId.length < 1 || result.providerId.length > 200 ||
      typeof result.title !== "string" || result.title.trim().length < 1 || result.title.length > 500 ||
      !Array.isArray(result.authors) || result.authors.some((author) => typeof author !== "string" || author.length > 200) ||
      (result.providerRecords !== undefined && (!Array.isArray(result.providerRecords) || result.providerRecords.some((source) =>
        !source || !["openlibrary", "googlebooks"].includes(source.provider) || typeof source.id !== "string" || source.id.length < 1 || source.id.length > 200))))) {
      return NextResponse.json({ error: "One or more selected candidates are malformed." }, { status: 400 });
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
