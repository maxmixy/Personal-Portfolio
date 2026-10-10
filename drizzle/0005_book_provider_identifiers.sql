CREATE TABLE IF NOT EXISTS "book_provider_identifiers" (
	"id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	"bookId" integer NOT NULL REFERENCES "books"("id") ON DELETE CASCADE,
	"provider" text NOT NULL,
	"externalId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_provider_identifiers_provider_check" CHECK ("provider" IN ('openlibrary', 'googlebooks'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "book_provider_identifiers_provider_external_unique"
	ON "book_provider_identifiers" ("provider", "externalId");
CREATE UNIQUE INDEX IF NOT EXISTS "book_provider_identifiers_book_provider_external_unique"
	ON "book_provider_identifiers" ("bookId", "provider", "externalId");

-- Work keys are intentionally not backfilled: multiple owned editions can share one work.
INSERT INTO "book_provider_identifiers" ("bookId", "provider", "externalId")
SELECT "id", 'openlibrary', 'edition:' || "openLibraryEditionId"
FROM "books"
WHERE "openLibraryEditionId" IS NOT NULL
ON CONFLICT DO NOTHING;
