// Creates an admin login, or resets the password when the email already exists.
// Production: node --env-file=.env.local scripts/create-user.mjs owner@example.com "Owner Name" owner
// Without DATABASE_URL it writes to the local dev database in .pglite (stop `npm run dev` first).
import { randomBytes } from "node:crypto";
import { hashPassword } from "../lib/admin/password.ts";
import { applyMigrations } from "./migrate.mjs";

const [rawEmail, name, role] = process.argv.slice(2);
if (!rawEmail?.includes("@") || !name || !["owner", "tech"].includes(role)) {
  console.error('Usage: node scripts/create-user.mjs <email> "<name>" <owner|tech>');
  process.exit(1);
}

async function open() {
  if (process.env.DATABASE_URL) {
    const { Pool, neonConfig } = await import("@neondatabase/serverless");
    neonConfig.webSocketConstructor = WebSocket;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    return { query: (text, params) => pool.query(text, params), close: () => pool.end() };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite(".pglite");
  await applyMigrations(db);
  return { query: (text, params) => db.query(text, params), close: () => db.close() };
}

const email = rawEmail.trim().toLowerCase();
const password = randomBytes(12).toString("base64url"); // 16 characters
const db = await open();
try {
  const { rows } = await db.query(
    `insert into users (email, name, role, password_hash) values ($1, $2, $3, $4)
     on conflict (email) do update set password_hash = excluded.password_hash
     returning id, (xmax = 0) as created`,
    [email, name, role, await hashPassword(password)]
  );
  await db.query("delete from sessions where user_id = $1", [rows[0].id]);
  console.log(`${rows[0].created ? "Created" : "Reset the password for"} ${email}`);
  console.log(`Password (shown once, store it somewhere safe): ${password}`);
} finally {
  await db.close();
}
