import { Pool } from "pg";
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