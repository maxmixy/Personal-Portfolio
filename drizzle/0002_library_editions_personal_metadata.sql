ALTER TABLE "books" DROP CONSTRAINT IF EXISTS "books_openLibraryKey_unique";
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "openLibraryEditionId" text;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "books_openLibraryEditionId_unique" ON "books" ("openLibraryEditionId");
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "publisher" text;
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "publishDate" text;
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "rating" integer;
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "notes" text;
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "review" text;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "books" ADD CONSTRAINT "books_rating_range_check"
    CHECK ("rating" IS NULL OR ("rating" >= 1 AND "rating" <= 5));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
