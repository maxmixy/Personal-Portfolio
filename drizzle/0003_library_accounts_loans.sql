ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "availability" text DEFAULT 'available' NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "books" ADD CONSTRAINT "books_availability_check"
    CHECK ("availability" IN ('available', 'reserved', 'on-loan', 'lost'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "library_users" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" text NOT NULL,
  "displayName" text NOT NULL,
  "passwordHash" text NOT NULL,
  "role" text DEFAULT 'borrower' NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "library_users_email_unique" ON "library_users" ("email");
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "library_users" ADD CONSTRAINT "library_users_role_check"
    CHECK ("role" IN ('borrower', 'owner'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "library_sessions" (
  "tokenHash" text PRIMARY KEY,
  "userId" integer NOT NULL REFERENCES "library_users"("id") ON DELETE CASCADE,
  "expiresAt" timestamp with time zone NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_loans" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "bookId" integer NOT NULL REFERENCES "books"("id") ON DELETE CASCADE,
  "borrowerId" integer NOT NULL REFERENCES "library_users"("id") ON DELETE RESTRICT,
  "status" text DEFAULT 'requested' NOT NULL,
  "requestNote" text,
  "ownerNote" text,
  "requestedAt" timestamp with time zone DEFAULT now() NOT NULL,
  "reviewedAt" timestamp with time zone,
  "approvedAt" timestamp with time zone,
  "borrowedAt" timestamp with time zone,
  "expectedReturnAt" timestamp with time zone,
  "returnedAt" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "book_loans" ADD CONSTRAINT "book_loans_status_check"
    CHECK ("status" IN ('requested', 'reserved', 'on-loan', 'rejected', 'returned'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "book_loans_one_open_loan_per_book"
  ON "book_loans" ("bookId") WHERE "status" IN ('reserved', 'on-loan');
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "book_loans_borrower_status_idx" ON "book_loans" ("borrowerId", "status");
