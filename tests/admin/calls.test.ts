import { beforeEach, describe, expect, it } from "vitest";
import { sql } from "@/lib/admin/db";
import { listCalls, saveCall, type CallInput } from "@/lib/admin/calls";
import { getLead, setLeadStage } from "@/lib/admin/leads";
import { createTestUser, resetDb } from "./helpers";

function call(overrides: Partial<CallInput> = {}): CallInput {
  return {
    retellCallId: "call_a",
    fromNumber: null,
    callbackPhone: "(919) 555-0142",
    callerName: "Jordan Pierce",
    vehicle: "2025 Porsche 911 · white",
    serviceKeys: ["protection/ppf"],
    timeframe: "Next week",
    callType: "inquiry",
    urgent: false,
    summary: "Wants PPF on a new 911.",
    transcript: "",
    recordingUrl: null,
    startedAt: null,
    endedAt: null,
    callerSpoke: true,
    ...overrides,
  };
}

const count = async (table: "calls" | "customers" | "leads") =>
  (await sql([`select count(*)::int as n from ${table}`] as unknown as TemplateStringsArray))[0].n;

describe("AI-answered calls", () => {
  beforeEach(resetDb);

  it("turns a new inquiry into a phone lead with its vehicle", async () => {
    const saved = await saveCall(call());
    expect(saved).toMatchObject({ outcome: "new-lead", duplicate: false });
    const lead = await getLead(saved.leadId!);
    expect(lead).toMatchObject({
      source: "phone",
      stage: "new",
      services: ["protection/ppf"],
      message: "Wants PPF on a new 911.\nWhen: Next week",
      customer: { name: "Jordan Pierce" },
    });
    expect((await sql`select label from vehicles`)[0].label).toBe("2025 Porsche 911 · white");
  });

  it("adds a second call from the same number to the open lead", async () => {
    const first = await saveCall(call());
    const second = await saveCall(call({ retellCallId: "call_b" }));
    expect(second).toMatchObject({ outcome: "added-to-lead", leadId: first.leadId });
    expect(await count("leads")).toBe(1);
  });

  it("starts a new lead when the old one is won", async () => {
    const uid = await createTestUser("owner@example.com", "a-strong-password", "owner");
    const first = await saveCall(call());
    for (const stage of ["contacted", "quoted", "won"] as const) await setLeadStage(first.leadId!, stage, uid);
    const second = await saveCall(call({ retellCallId: "call_b" }));
    expect(second.outcome).toBe("new-lead");
    expect(second.leadId).not.toBe(first.leadId);
  });

  it("never creates a lead for an existing customer with no open lead", async () => {
    const saved = await saveCall(call({ callType: "existing_customer" }));
    expect(saved).toMatchObject({ outcome: "no-lead", leadId: null });
    expect(await count("customers")).toBe(1);
    expect(await count("leads")).toBe(0);
  });

  it("keeps spam and silent calls off the board", async () => {
    expect((await saveCall(call({ callType: "spam" }))).outcome).toBe("no-lead");
    expect((await saveCall(call({ retellCallId: "call_b", callerSpoke: false }))).outcome).toBe("no-lead");
    expect(await count("customers")).toBe(0);
    expect(await count("calls")).toBe(2);
  });

  it("saves a call with no usable number without a customer", async () => {
    const saved = await saveCall(call({ callbackPhone: null }));
    expect(saved.outcome).toBe("no-lead");
    expect((await sql`select caller_name, customer_id from calls`)[0]).toEqual({ caller_name: "Jordan Pierce", customer_id: null });
  });

  it("stores one call per Retell id", async () => {
    const a = await saveCall(call());
    const b = await saveCall(call());
    expect(b).toEqual({ ...a, duplicate: true });
    expect(await count("calls")).toBe(1);
    expect(await count("leads")).toBe(1);
  });

  it("fills in an unknown caller's name on a later call", async () => {
    await saveCall(call({ callerName: null }));
    await saveCall(call({ retellCallId: "call_b" }));
    expect((await sql`select name from customers`)[0].name).toBe("Jordan Pierce");
  });

  it("lists calls newest first with their lead number", async () => {
    await saveCall(call({ startedAt: new Date("2026-10-28T14:00:00Z") }));
    await saveCall(call({ retellCallId: "call_b", startedAt: new Date("2026-10-28T14:01:00Z") }));
    const calls = await listCalls();
    expect(calls.map((c) => c.at.toISOString())).toEqual(["2026-10-28T14:01:00.000Z", "2026-10-28T14:00:00.000Z"]);
    expect(calls[0]).toMatchObject({ leadNumber: 201, callerName: "Jordan Pierce", callType: "inquiry" });
  });
});
