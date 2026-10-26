// Applies db/migrations/*.sql that haven't run yet, each in its own transaction.
// CLI: DATABASE_URL=<url> npm run db:migrate
// Also imported by lib/admin/db.ts to set up the local database in dev and tests.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * @param {{ query(text: string): Promise<{ rows: any[] }>, exec(text: string): Promise<unknown> }} client
 * @returns {Promise<string[]>} names of the migrations applied by this call
 */
export async function applyMigrations(client, dir = path.join(process.cwd(), "db", "migrations")) {
  await client.exec("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())");
  const done = new Set((await client.query("select name from schema_migrations")).rows.map((r) => r.name));
  const applied = [];
  for (const name of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
    if (done.has(name)) continue;
    if (!/^[\w.-]+$/.test(name)) throw new Error(`Migration file names may only use letters, digits, dots, dashes and underscores: ${name}`);
    const body = await readFile(path.join(dir, name), "utf8");
    try {
      await client.exec(`begin;\n${body}\ninsert into schema_migrations (name) values ('${name}');\ncommit;`);
    } catch (err) {
      await client.exec("rollback").catch(() => {});
      throw err;
    }
    applied.push(name);
  }
  return applied;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Set DATABASE_URL to the database you want to migrate.");
    process.exit(1);
  }
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: url });
  const client = { query: (text) => pool.query(text), exec: (text) => pool.query(text) };
  try {
    const applied = await applyMigrations(client);
    console.log(applied.length ? applied.map((n) => `${n} applied`).join("\n") : "Nothing to apply.");
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
