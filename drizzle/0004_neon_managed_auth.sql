ALTER TABLE "library_users" ADD COLUMN IF NOT EXISTS "authUserId" text;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "library_users_authUserId_unique" ON "library_users" ("authUserId");
--> statement-breakpoint
ALTER TABLE "library_users" DROP COLUMN IF EXISTS "passwordHash";
--> statement-breakpoint
DROP TABLE IF EXISTS "library_sessions";
