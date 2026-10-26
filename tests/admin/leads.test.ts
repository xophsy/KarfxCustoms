import { beforeEach, describe, expect, it } from "vitest";
import { sql } from "@/lib/admin/db";
import { saveWebsiteLead } from "@/lib/admin/leads";
import { resetDb } from "./helpers";

const uuidA = "0f8fad5b-d9cb-469f-a165-70867728950e";
const uuidB = "7c9e6679-7425-40de-944b-e07fc1f90ae7";
const lead = {
  name: "Jordan Pierce",
  phone: "(919) 555-0142",
  email: "jordan.pierce@example.com",
  message: "2025 Porsche 911 Carrera T",
  services: ["protection/ppf"],
  source: "",
  submissionId: uuidA,
};

describe("website leads", () => {
  beforeEach(resetDb);

  it("reuses one customer across phone formats", async () => {
    await saveWebsiteLead({ ...lead, phone: "(919) 555-0142", submissionId: uuidA });
    await saveWebsiteLead({ ...lead, phone: "+1 919 555 0142", submissionId: uuidB });
    expect((await sql`select count(*)::int as n from customers`)[0].n).toBe(1);
    expect((await sql`select count(*)::int as n from leads`)[0].n).toBe(2);
  });

  it("creates one lead per submissionId", async () => {
    const a = await saveWebsiteLead({ ...lead, submissionId: uuidA });
    const b = await saveWebsiteLead({ ...lead, submissionId: uuidA });
    expect(a.created).toBe(true);
    expect(b).toEqual({ ...a, created: false });
  });

  it("files RestorFX referrals under referral and keeps the services", async () => {
    await saveWebsiteLead({ ...lead, source: "restorfx", services: ["protection/ppf", "detailing/engine-bay"] });
    const [row] = await sql`select source, services, stage from leads`;
    expect(row).toEqual({ source: "referral", services: ["protection/ppf", "detailing/engine-bay"], stage: "new" });
  });
});
