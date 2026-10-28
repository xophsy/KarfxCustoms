import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/quote/route";

// vi.mock calls are hoisted above the imports, so the route sees these fakes.
const { saveWebsiteLead, send } = vi.hoisted(() => ({ saveWebsiteLead: vi.fn(), send: vi.fn() }));
vi.mock("@/lib/admin/leads", () => ({ saveWebsiteLead }));
vi.mock("resend", () => ({ Resend: vi.fn(() => ({ emails: { send } })) }));

function quoteRequest(overrides: Record<string, unknown> = {}) {
  return new NextRequest("http://localhost:3000/api/quote", {
    method: "POST",
    headers: { origin: "http://localhost:3000", host: "localhost:3000", "content-type": "application/json" },
    body: JSON.stringify({
      services: [{ categorySlug: "protection", serviceSlug: "ppf" }],
      contact: { name: "Jordan Pierce", phone: "(919) 555-0142", email: "", message: "2025 Porsche 911" },
      source: "",
      website: "",
      submissionId: "0f8fad5b-d9cb-469f-a165-70867728950e",
      ...overrides,
    }),
  });
}

describe("POST /api/quote", () => {
  beforeEach(() => {
    saveWebsiteLead.mockReset();
    send.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.RESEND_API_KEY;
  });

  it("returns 200 when the lead is saved even without RESEND_API_KEY", async () => {
    saveWebsiteLead.mockResolvedValue({ leadId: "x", number: 201, created: true });
    const res = await POST(quoteRequest());
    expect(res.status).toBe(200);
    expect(saveWebsiteLead).toHaveBeenCalledWith(expect.objectContaining({ services: ["protection/ppf"], phone: "(919) 555-0142" }));
  });

  it("returns 200 when the database fails but the email is sent", async () => {
    saveWebsiteLead.mockRejectedValue(new Error("database down"));
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ error: null });
    expect((await POST(quoteRequest())).status).toBe(200);
  });

  it("accepts a request with no service picked, for customers who are not sure yet", async () => {
    saveWebsiteLead.mockResolvedValue({ leadId: "x", number: 202, created: true });
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ error: null });
    const res = await POST(quoteRequest({ services: [] }));
    expect(res.status).toBe(200);
    expect(saveWebsiteLead).toHaveBeenCalledWith(expect.objectContaining({ services: [] }));
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ subject: expect.stringContaining("Not sure yet") }), expect.anything());
  });

  it("still rejects a request without a usable phone number", async () => {
    const res = await POST(quoteRequest({ contact: { name: "Jordan Pierce", phone: "12", email: "" } }));
    expect(res.status).toBe(400);
    expect(saveWebsiteLead).not.toHaveBeenCalled();
  });

  it("returns 503 when both fail", async () => {
    saveWebsiteLead.mockRejectedValue(new Error("database down"));
    expect((await POST(quoteRequest())).status).toBe(503);
  });
});
