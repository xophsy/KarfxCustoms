import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/quote/route";

// vi.mock calls are hoisted above the imports, so the route sees these fakes.
const { saveWebsiteLead, send } = vi.hoisted(() => ({ saveWebsiteLead: vi.fn(), send: vi.fn() }));
vi.mock("@/lib/admin/leads", () => ({ saveWebsiteLead }));
vi.mock("resend", () => ({ Resend: vi.fn(() => ({ emails: { send } })) }));

function quoteRequest() {
  return new NextRequest("http://localhost:3000/api/quote", {
    method: "POST",
    headers: { origin: "http://localhost:3000", host: "localhost:3000", "content-type": "application/json" },
    body: JSON.stringify({
      services: [{ categorySlug: "protection", serviceSlug: "ppf" }],
      contact: { name: "Jordan Pierce", phone: "(919) 555-0142", email: "", message: "2025 Porsche 911" },
      source: "",
      website: "",
      submissionId: "0f8fad5b-d9cb-469f-a165-70867728950e",
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

  it("returns 503 when both fail", async () => {
    saveWebsiteLead.mockRejectedValue(new Error("database down"));
    expect((await POST(quoteRequest())).status).toBe(503);
  });
});
