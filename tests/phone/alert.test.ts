import { describe, expect, it } from "vitest";
import type { CallInput } from "@/lib/admin/calls";
import { callAlert, shouldAlert } from "@/lib/phone/alert";

const site = "https://karfxcustoms.com";
const input: CallInput = {
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
  transcript: "",
  recordingUrl: null,
  startedAt: null,
  endedAt: null,
  callerSpoke: true,
};

describe("call alert email", () => {
  it("names the caller and the first service", () => {
    expect(callAlert(input, null, site).subject).toBe("Missed call — Jordan Pierce — Paint Protection Film");
    expect(callAlert({ ...input, serviceKeys: [] }, null, site).subject).toBe("Missed call — Jordan Pierce — Not sure yet");
  });

  it("escapes caller text in the email", () => {
    const { html } = callAlert({ ...input, summary: "<script>x</script>", callerName: "<b>Jo</b>" }, null, site);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>Jo</b>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("marks urgent calls and repeat callers in the subject", () => {
    expect(callAlert({ ...input, urgent: true }, { callId: "c", leadId: "l", outcome: "added-to-lead", duplicate: false }, site).subject).toBe(
      "Urgent: Missed call — Jordan Pierce called again — Paint Protection Film"
    );
  });

  it("names calls with no lead and no caller ID", () => {
    expect(callAlert({ ...input, callType: "vendor", callerName: null, callbackPhone: null }, null, site).subject).toBe(
      "Missed call — No caller ID — not a lead"
    );
    expect(callAlert({ ...input, callType: "existing_customer" }, null, site).subject).toBe("Missed call — Jordan Pierce — existing customer");
  });

  it("links to the lead in the admin and the caller's number", () => {
    const { html, text } = callAlert(input, { callId: "c", leadId: "l1", outcome: "new-lead", duplicate: false }, site);
    expect(html).toContain("https://karfxcustoms.com/admin/leads/l1");
    expect(html).toContain('href="tel:9195550142"');
    expect(text).toContain("https://karfxcustoms.com/admin/leads/l1");
    expect(text).toContain("Next week");
  });

  it("stays quiet for spam and silent calls", () => {
    expect(shouldAlert(input)).toBe(true);
    expect(shouldAlert({ ...input, callType: "vendor" })).toBe(true);
    expect(shouldAlert({ ...input, callType: "spam" })).toBe(false);
    expect(shouldAlert({ ...input, callerSpoke: false })).toBe(false);
  });
});
