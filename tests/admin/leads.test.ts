import { beforeEach, describe, expect, it } from "vitest";
import { sql } from "@/lib/admin/db";
import { createManualLead, getLead, saveWebsiteLead, setLeadStage } from "@/lib/admin/leads";
import { createTestUser, resetDb } from "./helpers";

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

  it("rejects a manual lead without a full phone number", async () => {
    const uid = await createTestUser("owner@example.com", "a-strong-password", "owner");
    await expect(createManualLead({ name: "Derek Owens", phone: "555-0142", source: "phone" }, uid)).rejects.toThrow(
      "Enter a 10-digit phone number."
    );
  });

  it("adds a manual lead with its vehicle and service", async () => {
    const uid = await createTestUser("owner@example.com", "a-strong-password", "owner");
    const id = await createManualLead(
      { name: "Derek Owens", phone: "919-555-0177", vehicle: "2019 Ford F-150", service: "wraps-styling/chrome-delete", source: "phone" },
      uid
    );
    const row = await getLead(id);
    expect(row).toMatchObject({ stage: "new", source: "phone", services: ["wraps-styling/chrome-delete"], customer: { name: "Derek Owens" } });
    expect((await sql`select label from vehicles`)[0].label).toBe("2019 Ford F-150");
  });

  it("moves a lead and records who did it", async () => {
    const uid = await createTestUser("owner@example.com", "a-strong-password", "owner");
    const { leadId } = await saveWebsiteLead(lead);
    const [before] = await sql`select updated_at from leads`;
    await setLeadStage(leadId, "contacted", uid);
    const [after] = await sql`select stage, updated_at from leads`;
    expect(after.stage).toBe("contacted");
    expect(after.updated_at.getTime()).toBeGreaterThanOrEqual(before.updated_at.getTime());
    const activity = await sql`select action, user_id from activity where entity_id = ${leadId} and action like 'stage:%'`;
    expect(activity).toEqual([{ action: "stage:contacted", user_id: uid }]);
  });

  it("refuses a move the board doesn't offer", async () => {
    const uid = await createTestUser("owner@example.com", "a-strong-password", "owner");
    const { leadId } = await saveWebsiteLead(lead);
    await expect(setLeadStage(leadId, "won", uid)).rejects.toThrow("That move isn't available for this lead.");
  });

  it("treats a malformed id as not found", async () => {
    expect(await getLead("not-a-uuid")).toBeNull();
  });

  it("files RestorFX referrals under referral and keeps the services", async () => {
    await saveWebsiteLead({ ...lead, source: "restorfx", services: ["protection/ppf", "detailing/engine-bay"] });
    const [row] = await sql`select source, services, stage from leads`;
    expect(row).toEqual({ source: "referral", services: ["protection/ppf", "detailing/engine-bay"], stage: "new" });
  });
});
