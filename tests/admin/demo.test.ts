import { afterEach, describe, expect, it, vi } from "vitest";

// Demo mode = the live site before a database is connected (production, no DATABASE_URL).
async function loadInDemoMode() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("DATABASE_URL", "");
  vi.resetModules();
  return {
    db: await import("@/lib/admin/db"),
    leads: await import("@/lib/admin/leads"),
    session: await import("@/lib/admin/session"),
  };
}

describe("demo mode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("never stores website quotes, so the quote form falls back to email", async () => {
    const { db, leads } = await loadInDemoMode();
    expect(db.DEMO).toBe(true);
    await expect(
      leads.saveWebsiteLead({
        name: "Jordan Pierce",
        phone: "(919) 555-0142",
        email: "",
        message: "",
        services: ["protection/ppf"],
        source: "",
        submissionId: "0f8fad5b-d9cb-469f-a165-70867728950e",
      })
    ).rejects.toThrow("Demo mode");
  });

  it("lets the demo cookie in as the owner and shows sample leads", async () => {
    const { leads, session } = await loadInDemoMode();
    expect(await session.userForToken("demo")).toMatchObject({ email: "sales@restorfxraleigh.com", role: "owner" });
    expect(await session.userForToken("not-the-demo-cookie")).toBeNull();
    expect((await leads.listLeads()).length).toBeGreaterThanOrEqual(6);
  });
});
