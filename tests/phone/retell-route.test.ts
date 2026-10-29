import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/phone/retell/route";
import { retellCall, signRetell } from "./helpers";

// vi.mock calls are hoisted above the imports, so the route sees these fakes.
const { saveCall, send } = vi.hoisted(() => ({ saveCall: vi.fn(), send: vi.fn() }));
vi.mock("@/lib/admin/calls", async (importOriginal) => ({ ...(await importOriginal<typeof import("@/lib/admin/calls")>()), saveCall }));
vi.mock("resend", () => ({ Resend: vi.fn(() => ({ emails: { send } })) }));

function retellRequest(payload: unknown, { signature }: { signature?: string } = {}) {
  const body = JSON.stringify(payload);
  return new NextRequest("https://karfxcustoms.com/api/phone/retell", {
    method: "POST",
    headers: { "content-type": "application/json", "x-retell-signature": signature ?? signRetell(body, "key_test") },
    body,
  });
}
const analyzed = (custom: Record<string, unknown> = {}) => ({ event: "call_analyzed", call: retellCall({ custom }) });
const newLead = { callId: "c1", leadId: "l1", outcome: "new-lead", duplicate: false };

describe("POST /api/phone/retell", () => {
  beforeEach(() => {
    saveCall.mockReset();
    send.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env.RETELL_API_KEY = "key_test";
    delete process.env.RESEND_API_KEY;
  });

  it("refuses an unsigned or badly signed request", async () => {
    expect((await POST(retellRequest(analyzed(), { signature: "v=1,d=00" }))).status).toBe(401);
    expect(saveCall).not.toHaveBeenCalled();
    // A wrong key in Vercel loses every call, so it must show up in the logs.
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("signature"));
  });

  it("ignores events other than call_analyzed", async () => {
    expect((await POST(retellRequest({ event: "call_started", call: retellCall() }))).status).toBe(204);
    expect(saveCall).not.toHaveBeenCalled();
  });

  it("saves an inquiry and emails it once per call", async () => {
    saveCall.mockResolvedValue(newLead);
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ error: null });
    expect((await POST(retellRequest(analyzed()))).status).toBe(204);
    expect(saveCall).toHaveBeenCalledWith(expect.objectContaining({ retellCallId: "call_a", callbackPhone: "(919) 555-0142" }));
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ subject: "Missed call — Jordan Pierce — Paint Protection Film" }),
      { idempotencyKey: "call-alert-call_a" }
    );
  });

  it("emails a retried call again under the same key", async () => {
    saveCall.mockResolvedValue({ ...newLead, duplicate: true });
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ error: null });
    expect((await POST(retellRequest(analyzed()))).status).toBe(204);
    expect(send).toHaveBeenCalledWith(expect.anything(), { idempotencyKey: "call-alert-call_a" });
  });

  it("does not email spam", async () => {
    saveCall.mockResolvedValue({ callId: "c1", leadId: null, outcome: "no-lead", duplicate: false });
    process.env.RESEND_API_KEY = "re_test";
    expect((await POST(retellRequest(analyzed({ call_type: "spam" })))).status).toBe(204);
    expect(send).not.toHaveBeenCalled();
  });

  it("emails when the database is down", async () => {
    saveCall.mockRejectedValue(new Error("database down"));
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ error: null });
    expect((await POST(retellRequest(analyzed()))).status).toBe(204);
    expect(send).toHaveBeenCalled();
  });

  it("asks Retell to retry when nothing was kept", async () => {
    saveCall.mockRejectedValue(new Error("database down"));
    expect((await POST(retellRequest(analyzed()))).status).toBe(500);
  });

  it("asks Retell to retry when the database is down and the email fails", async () => {
    saveCall.mockRejectedValue(new Error("database down"));
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ error: { message: "rate limited" } });
    expect((await POST(retellRequest(analyzed()))).status).toBe(500);
  });

  it("fails loudly without RETELL_API_KEY", async () => {
    delete process.env.RETELL_API_KEY;
    expect((await POST(retellRequest(analyzed()))).status).toBe(500);
    expect(saveCall).not.toHaveBeenCalled();
  });

  it("rejects a signed body that is not a call", async () => {
    expect((await POST(retellRequest({ event: "call_analyzed", call: {} }))).status).toBe(400);
  });
});
