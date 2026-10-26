import { describe, expect, it, vi } from "vitest";

describe("local database", () => {
  // Next dev bundles pages and server actions separately, so db.ts can load twice.
  it("shares one database between two copies of the module", async () => {
    const first = (await import("@/lib/admin/db")).sql;
    vi.resetModules();
    const second = (await import("@/lib/admin/db")).sql;

    await first`create table probe (v int)`;
    await first`insert into probe values (1)`;
    expect((await second`select count(*)::int as n from probe`)[0].n).toBe(1);
  });
});
