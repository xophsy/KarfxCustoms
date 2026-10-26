import { neon } from "@neondatabase/serverless";
import type { PGlite } from "@electric-sql/pglite";

export type Row = Record<string, any>;
type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Row[]>;

// The live site before a database is connected: the admin runs on sample data that isn't kept,
// and website quotes are never stored in it (see saveWebsiteLead).
export const DEMO = process.env.NODE_ENV === "production" && !process.env.DATABASE_URL;

let client: Sql | undefined;

// Connects on first query, so pages that never touch the database don't need DATABASE_URL.
export const sql: Sql = async (strings, ...values) => (client ??= connect())(strings, ...values);

function connect(): Sql {
  const url = process.env.DATABASE_URL;
  if (url) return neon(url) as unknown as Sql;
  return localSql();
}

// Next dev loads this module more than once (pages and server actions are bundled separately),
// so the local database lives on globalThis: one instance, never two opening .pglite at once.
const shared = globalThis as typeof globalThis & { __karfxLocalDb?: Promise<PGlite> };

// No DATABASE_URL: Postgres in-process (PGlite), migrated on first use.
// Tests and demo mode get a fresh in-memory database; dev keeps its data in .pglite/.
function localSql(): Sql {
  const ready = (shared.__karfxLocalDb ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const { applyMigrations } = await import("../../scripts/migrate.mjs");
    const db = new PGlite(process.env.VITEST || DEMO ? undefined : ".pglite");
    await applyMigrations(db);
    if (DEMO) {
      const { readFile } = await import("node:fs/promises");
      await db.exec(await readFile(`${process.cwd()}/db/seed-demo.sql`, "utf8"));
    }
    return db;
  })());
  return async (strings, ...values) => {
    const db = await ready;
    const text = strings.reduce((acc, part, i) => `${acc}$${i}${part}`);
    return (await db.query<Row>(text, values)).rows;
  };
}
