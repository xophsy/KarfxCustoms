import { describe, expect, it } from "vitest";
import { sign as sdkSign } from "retell-sdk";
import { formatPhone } from "@/lib/admin/phone";
import { parseRetellCall, verifyRetellSignature } from "@/lib/phone/retell";
import { retellCall, signRetell } from "./helpers";

describe("Retell webhook signature", () => {
  it("accepts a signature made by Retell's own SDK", async () => {
    const body = JSON.stringify({ event: "call_analyzed" });
    expect(verifyRetellSignature(body, "key_test", await sdkSign(body, "key_test"))).toBe(true);
  });

  it("rejects a changed body, a wrong key, a stale timestamp and a missing header", () => {
    const now = 1_800_000_000_000;
    const header = signRetell("{}", "key_test", now);
    expect(verifyRetellSignature("{ }", "key_test", header, now)).toBe(false);
    expect(verifyRetellSignature("{}", "other", header, now)).toBe(false);
    expect(verifyRetellSignature("{}", "key_test", header, now + 300_001)).toBe(false);
    expect(verifyRetellSignature("{}", "key_test", null, now)).toBe(false);
    expect(verifyRetellSignature("{}", "key_test", "v=1,d=00", now)).toBe(false);
    expect(verifyRetellSignature("{}", "key_test", header, now + 299_000)).toBe(true);
  });
});

describe("reading a Retell call", () => {
  it("reads every field Retell sends", () => {
    expect(parseRetellCall(retellCall())).toEqual({
      retellCallId: "call_a",
      fromNumber: "+19195550142",
      callbackPhone: "(919) 555-0142",
      callerName: "Jordan Pierce",
      vehicle: "2025 Porsche 911",
      serviceKeys: ["protection/ppf"],
      timeframe: "Next week",
      callType: "inquiry",
      urgent: false,
      summary: "Wants PPF.",
      transcript: "Agent: Hi\nUser: Hi",
      recordingUrl: "https://retell.example/rec.wav",
      startedAt: new Date(1_800_000_000_000),
      endedAt: new Date(1_800_000_090_000),
      callerSpoke: true,
    });
  });

  it("treats the shop's own number as no caller ID", () => {
    expect(parseRetellCall(retellCall({ from_number: "+19195260818" }))!.callbackPhone).toBeNull();
    expect(parseRetellCall(retellCall({ custom: { callback_number: "(919) 526-0818" } }))!.callbackPhone).toBe("(919) 555-0142");
  });

  it("prefers the number the caller gave", () => {
    expect(parseRetellCall(retellCall({ custom: { callback_number: "984-555-0119" } }))!.callbackPhone).toBe("(984) 555-0119");
  });

  it("turns placeholder words into missing values", () => {
    for (const word of ["unknown", "N/A", "Not provided.", "none", "  "]) {
      expect(parseRetellCall(retellCall({ custom: { caller_name: word } }))!.callerName).toBeNull();
    }
  });

  it("drops unknown service keys and unknown call types", () => {
    const parsed = parseRetellCall(retellCall({ custom: { service_keys: "protection/ppf, made/up, protection/ppf", call_type: "sales" } }))!;
    expect(parsed.serviceKeys).toEqual(["protection/ppf"]);
    expect(parsed.callType).toBe("other");
  });

  it("keeps only https recordings", () => {
    expect(parseRetellCall(retellCall({ recording_url: "javascript:alert(1)" }))!.recordingUrl).toBeNull();
    expect(parseRetellCall(retellCall({ recording_url: "http://retell.example/rec.wav" }))!.recordingUrl).toBeNull();
  });

  it("knows when the caller never spoke", () => {
    const silent = retellCall({ transcript: "Agent: Hi", transcript_object: [{ role: "agent", content: "Hi" }] });
    expect(parseRetellCall(silent)!.callerSpoke).toBe(false);
    expect(parseRetellCall(retellCall({ transcript_object: undefined }))!.callerSpoke).toBe(true);
  });

  it("cuts long text to its limit", () => {
    const parsed = parseRetellCall(retellCall({ custom: { caller_name: "x".repeat(500) } }))!;
    expect(parsed.callerName).toHaveLength(100);
  });

  it("copes with missing fields", () => {
    expect(parseRetellCall({ call_id: "c" })).toMatchObject({ callerName: null, callbackPhone: null, summary: "", startedAt: null, callerSpoke: false });
  });

  it("returns null without a call id", () => {
    expect(parseRetellCall({})).toBeNull();
    expect(parseRetellCall(null)).toBeNull();
  });
});

describe("formatPhone", () => {
  it("formats phone digits", () => {
    expect(formatPhone("19195550142")).toBe("(919) 555-0142");
  });
});
