import { randomBytes } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { sql } from "@/lib/admin/db";
import { attemptLogin, userForToken } from "@/lib/admin/session";
import { createTestUser, resetDb } from "./helpers";

describe("logins", () => {
  beforeEach(async () => {
    await resetDb();
    await createTestUser("owner@example.com", "a-strong-password", "owner");
  });

  it("logs in with the right password and resolves the session", async () => {
    const r = await attemptLogin("Owner@Example.com", "a-strong-password");
    expect(r.ok).toBe(true);
    expect((await userForToken(r.ok ? r.token : ""))?.role).toBe("owner");
  });

  it("gives the same error for unknown email and wrong password", async () => {
    expect(await attemptLogin("nobody@example.com", "x")).toEqual({ ok: false, error: "Email or password is wrong." });
    expect(await attemptLogin("owner@example.com", "x")).toEqual({ ok: false, error: "Email or password is wrong." });
  });

  it("locks out after 10 failures even with the right password", async () => {
    for (let i = 0; i < 10; i++) await attemptLogin("owner@example.com", "wrong");
    expect(await attemptLogin("owner@example.com", "a-strong-password")).toEqual({
      ok: false,
      error: "Too many attempts. Try again in 15 minutes.",
    });
  });

  it("rejects expired sessions, forged tokens and deactivated users", async () => {
    const r = await attemptLogin("owner@example.com", "a-strong-password");
    const token = r.ok ? r.token : "";
    expect(await userForToken(randomBytes(32).toString("base64url"))).toBeNull();
    expect(await userForToken(undefined)).toBeNull();
    await sql`update sessions set expires_at = now() - interval '1 minute'`;
    expect(await userForToken(token)).toBeNull();
    await sql`update sessions set expires_at = now() + interval '1 day'`;
    expect(await userForToken(token)).not.toBeNull();
    await sql`update users set active = false`;
    expect(await userForToken(token)).toBeNull();
  });
});
