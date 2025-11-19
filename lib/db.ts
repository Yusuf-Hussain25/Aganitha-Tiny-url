import { neon, neonConfig, PostgresError } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ?? process.env.DB_URL ?? undefined;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL (or DB_URL) must be set before using database features.",
  );
}

neonConfig.poolQueryViaFetch = true;

const sql = neon(connectionString);

let initialized = false;

export async function getDb() {
  if (!initialized) {
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        code TEXT PRIMARY KEY,
        target_url TEXT NOT NULL,
        click_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_clicked_at TIMESTAMPTZ,
        deleted_at TIMESTAMPTZ
      );
    `;
    initialized = true;
  }

  return sql;
}

export type { PostgresError };

