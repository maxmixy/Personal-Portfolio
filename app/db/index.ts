import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

let database: ReturnType<typeof drizzle> | undefined;
let pool: Pool | undefined;

export function getDatabase() {
  if (!database) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Library persistence.");
    }

    pool ??= new Pool({
      connectionString,
      max: 10,
      ssl: {
        rejectUnauthorized: true,
      },
    });
    database = drizzle(pool, { schema });
  }

  return database;
}

export async function ensureLibraryBookColumns() {
  const db = getDatabase();
  const query = await db.execute(sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'books'
  `);

  const names = new Set(
    ((query.rows ?? []) as Array<{ column_name?: string }>).map((row) => row.column_name ?? ""),
  );

  if (!names.has("owned")) {
    await db.execute(sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS owned boolean DEFAULT true NOT NULL;`);
  }

  if (!names.has("readingStatus")) {
    await db.execute(sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS "readingStatus" text DEFAULT 'want-to-read' NOT NULL;`);
  }

  const optionalColumns = [
    ["openLibraryEditionId", sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS "openLibraryEditionId" text;`],
    ["publisher", sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS publisher text;`],
    ["publishDate", sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS "publishDate" text;`],
    ["rating", sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS rating integer;`],
    ["notes", sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS notes text;`],
    ["review", sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS review text;`],
    ["availability", sql`ALTER TABLE books ADD COLUMN IF NOT EXISTS availability text DEFAULT 'available' NOT NULL;`],
  ] as const;

  for (const [name, statement] of optionalColumns) {
    if (!names.has(name)) {
      await db.execute(statement);
    }
  }

  await db.execute(sql`ALTER TABLE books DROP CONSTRAINT IF EXISTS "books_openLibraryKey_unique";`);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "books_openLibraryEditionId_unique" ON books ("openLibraryEditionId");`);
}
