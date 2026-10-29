import { describe, expect, it } from "vitest";
import { BUSINESS_INFO } from "@/lib/business";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import { ANALYSIS_FIELDS, buildAgentPrompt } from "@/lib/phone/agent";
import { parseRetellCall } from "@/lib/phone/retell";

describe("the AI's instructions", () => {
  it("tells callers it is a virtual assistant and the call is recorded", () => {
    const p = buildAgentPrompt().toLowerCase();
    expect(p).toContain("virtual assistant");
    expect(p).toContain("recorded");
  });

  it("knows every service and the address", () => {
    const p = buildAgentPrompt();
    for (const c of SERVICE_CATEGORIES) for (const s of c.services) expect(p).toContain(s.name);
    expect(p).toContain(BUSINESS_INFO.fullAddress);
    expect(p).toContain("RestorFX Raleigh");
  });

  it("carries the never-quote-a-price rule and no prices", () => {
    expect(buildAgentPrompt()).toMatch(/never (give|quote) a price/i);
    expect(buildAgentPrompt()).not.toMatch(/\$\d/);
  });

  it("gives no phone number but the shop's", () => {
    const numbers = buildAgentPrompt().match(/\(?\d{3}\)?[ .-]?\d{3}-\d{4}/g) ?? [];
    expect(numbers.every((n) => n.replace(/\D/g, "") === "9195260818")).toBe(true);
  });
});

describe("post-call fields", () => {
  it("asks Retell for exactly the fields the webhook reads", () => {
    expect(ANALYSIS_FIELDS.map((f) => f.name)).toEqual(["caller_name", "callback_number", "vehicle", "service_keys", "timeframe", "call_type", "urgent"]);
    const custom = {
      caller_name: "Ana Ruiz",
      callback_number: "984-555-0119",
      vehicle: "2022 BMW M4",
      service_keys: "protection/ppf",
      timeframe: "Friday",
      call_type: "inquiry",
      urgent: true,
    };
    expect(parseRetellCall({ call_id: "c", call_analysis: { custom_analysis_data: custom } })).toMatchObject({
      callerName: "Ana Ruiz",
      callbackPhone: "(984) 555-0119",
      vehicle: "2022 BMW M4",
      serviceKeys: ["protection/ppf"],
      timeframe: "Friday",
      callType: "inquiry",
      urgent: true,
    });
  });

  it("lists every valid service key for the AI to pick from", () => {
    const field = ANALYSIS_FIELDS.find((f) => f.name === "service_keys")!;
    for (const c of SERVICE_CATEGORIES) for (const s of c.services) expect(field.description).toContain(`${c.slug}/${s.slug}`);
  });
});
