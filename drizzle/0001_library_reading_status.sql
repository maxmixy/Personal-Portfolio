ALTER TABLE "books" ADD COLUMN "owned" boolean DEFAULT true NOT NULL;
ALTER TABLE "books" ADD COLUMN "readingStatus" text DEFAULT 'want-to-read' NOT NULL;
