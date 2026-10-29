import { describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { applyMigrations } from "../../scripts/migrate.mjs";
import { sql } from "@/lib/admin/db";

describe("database schema", () => {
  it("creates the step 1 tables on first use", async () => {
    const rows = await sql`select table_name from information_schema.tables where table_schema = 'public'`;
    expect(rows.map((r) => r.table_name)).toEqual(
      expect.arrayContaining(["users", "sessions", "login_failures", "customers", "vehicles", "leads", "activity", "calls", "schema_migrations"])
    );
  });

  it("applies each migration once", async () => {
    const db = new PGlite();
    expect(await applyMigrations(db)).toEqual(["001_shop_admin.sql", "002_calls.sql"]);
    expect(await applyMigrations(db)).toEqual([]);
  });
});
