import { neon } from "@neondatabase/serverless";
import type { PGlite } from "@electric-sql/pglite";

export type Row = Record<string, any>;
type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Row[]>;

let client: Sql | undefined;

// Connects on first query, so pages that never touch the database don't need DATABASE_URL.
export const sql: Sql = async (strings, ...values) => (client ??= connect())(strings, ...values);

function connect(): Sql {
  const url = process.env.DATABASE_URL;
  if (url) return neon(url) as unknown as Sql;
  if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is not set");
  return localSql();
}

// Next dev loads this module more than once (pages and server actions are bundled separately),
// so the local database lives on globalThis: one instance, never two opening .pglite at once.
const shared = globalThis as typeof globalThis & { __karfxLocalDb?: Promise<PGlite> };

// Dev and tests without DATABASE_URL: Postgres in-process (PGlite), migrated on first use.
// Tests get a fresh in-memory database per worker; dev keeps its data in .pglite/.
function localSql(): Sql {
  const ready = (shared.__karfxLocalDb ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const { applyMigrations } = await import("../../scripts/migrate.mjs");
    const db = new PGlite(process.env.VITEST ? undefined : ".pglite");
    await applyMigrations(db);
    return db;
  })());
  return async (strings, ...values) => {
    const db = await ready;
    const text = strings.reduce((acc, part, i) => `${acc}$${i}${part}`);
    return (await db.query<Row>(text, values)).rows;
  };
}
