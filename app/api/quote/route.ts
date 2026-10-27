import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { BUSINESS_INFO } from "@/lib/business";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import { saveWebsiteLead } from "@/lib/admin/leads";
import { normalizePhone } from "@/lib/admin/phone";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/quote
//
// Saves each quote request as a lead in the shop admin, then emails it to the
// shop (and a confirmation to the customer when they gave an email) via Resend.
// The customer sees success if either the save or the shop email worked.
//
// Vercel env vars:
//   DATABASE_URL             the shop admin database (see lib/admin/db.ts)
//   RESEND_API_KEY           needed for emails; without it leads are only saved
//   LEAD_NOTIFICATION_EMAIL  optional — defaults to BUSINESS_INFO.email
//   LEAD_FROM_EMAIL          optional — defaults to quotes@karfxcustoms.com
//                            (the domain must be verified in Resend)
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";

type Lead = {
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  services: string[];       // "Paint Protection Film (Protection)", for emails
  serviceKeys: string[];    // "protection/ppf", for the shop admin
  submissionId: string;
};

function stringField(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

// Service names come from our own data, never from the request body.
function serviceLabel(categorySlug: unknown, serviceSlug: unknown) {
  const category = SERVICE_CATEGORIES.find((c) => c.slug === categorySlug);
  const service = category?.services.find((s) => s.slug === serviceSlug);
  return category && service ? `${service.name} (${category.name})` : null;
}

function parseLead(body: Record<string, unknown>): Lead | null {
  const contact = (body.contact ?? {}) as Record<string, unknown>;
  const rawServices = Array.isArray(body.services) ? body.services.slice(0, 20) : [];
  const known = rawServices
    .map((s) => ({ label: serviceLabel(s?.categorySlug, s?.serviceSlug), key: `${s?.categorySlug}/${s?.serviceSlug}` }))
    .filter((s): s is { label: string; key: string } => s.label !== null);
  const services = known.map((s) => s.label);

  const lead: Lead = {
    name: stringField(contact.name, 100),
    phone: stringField(contact.phone, 40),
    email: stringField(contact.email, 254).toLowerCase(),
    message: stringField(contact.message, 2000),
    source: stringField(body.source, 40),
    services,
    serviceKeys: known.map((s) => s.key),
    submissionId: stringField(body.submissionId, 64),
  };

  const emailIsValid = lead.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  const phoneIsValid = normalizePhone(lead.phone) !== null;
  const idIsValid = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(lead.submissionId);

  if (lead.name.length < 2 || !phoneIsValid || !emailIsValid || !idIsValid || services.length === 0) {
    return null;
  }

  return lead;
}

function emailFrame(content: string) {
  return `<!doctype html>
  <html><body style="margin:0;background:#0a0a0a;font-family:Arial,sans-serif;color:#f5f5f5">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px">
      <div style="border:1px solid #3d3520;background:#111111;padding:32px">
        <p style="margin:0 0 20px;color:#D4AF37;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">KAR FX Customs</p>
        ${content}
      </div>
    </div>
  </body></html>`;
}

function leadRows(lead: Lead): [string, string][] {
  return [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email || "Not provided"],
    ["Services", lead.services.join("\n")],
    ["Car & notes", lead.message || "None"],
    ["Came from", lead.source || "Website"],
  ];
}

function notificationHtml(lead: Lead) {
  const phoneHref = `tel:${lead.phone.replace(/[^\d+]/g, "")}`;
  return emailFrame(`
    <h1 style="margin:0 0 8px;font-size:28px;line-height:1.2">New quote request</h1>
    <p style="margin:0 0 28px;color:#aaa">Call <a href="${escapeHtml(phoneHref)}" style="color:#D4AF37">${escapeHtml(lead.phone)}</a>${lead.email ? " or reply to this email" : ""} to reach ${escapeHtml(lead.name)}.</p>
    <table role="presentation" style="width:100%;border-collapse:collapse">
      ${leadRows(lead).map(([label, value]) => `<tr>
        <td style="width:120px;padding:12px 12px 12px 0;border-top:1px solid #2b2b2b;color:#999;font-size:13px;vertical-align:top">${escapeHtml(label)}</td>
        <td style="padding:12px 0;border-top:1px solid #2b2b2b;color:#fff;font-size:15px;white-space:pre-wrap">${escapeHtml(value)}</td>
      </tr>`).join("")}
    </table>`);
}

function confirmationHtml(lead: Lead) {
  return emailFrame(`
    <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2">Thank you very much, ${escapeHtml(lead.name)}.</h1>
    <p style="margin:0 0 18px;color:#c8c8c8;font-size:16px;line-height:1.6">We received your request about ${escapeHtml(lead.services.join(", "))}. We would like to learn a little more about your vehicle and what you are looking for, so we can coordinate a visit and evaluate the best options for you. We will reply within 24 hours on weekdays.</p>
    <p style="margin:0;color:#999;font-size:14px;line-height:1.6">If you need us sooner, please call or text <a href="${BUSINESS_INFO.phoneHref}" style="color:#D4AF37">${BUSINESS_INFO.phoneDisplay}</a>. We look forward to speaking with you.</p>`);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
  }

  if (Number(request.headers.get("content-length") ?? 0) > 32_000) {
    return NextResponse.json({ success: false, error: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: invisible to people, commonly filled in by form bots.
  if (stringField(body.website, 200)) {
    return NextResponse.json({ success: true });
  }

  const lead = parseLead(body);
  if (!lead) {
    return NextResponse.json(
      { success: false, error: "Please check your name, phone, and selected services." },
      { status: 400 }
    );
  }

  // Save first: a lead in the database survives any email problem.
  let saved = false;
  try {
    await saveWebsiteLead({ ...lead, services: lead.serviceKeys });
    saved = true;
  } catch (err) {
    console.error("[KAR FX Quote] lead not saved to the database", err, lead);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (saved) return NextResponse.json({ success: true });
    // Log the lead so it can still be recovered from the server logs.
    console.error("[KAR FX Quote] RESEND_API_KEY is not set — lead not emailed", lead);
    return NextResponse.json({ success: false, error: "Email service unavailable." }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? BUSINESS_INFO.email;
  const fromEmail = process.env.LEAD_FROM_EMAIL ?? "KAR FX Customs Website <quotes@karfxcustoms.com>";
  const safeName = lead.name.replace(/[\r\n]+/g, " ");
  const firstService = lead.services[0].replace(/ \(.*\)$/, "");

  const { error: notificationError } = await resend.emails.send(
    {
      from: fromEmail,
      to: notificationEmail,
      replyTo: lead.email || undefined,
      subject: `New quote request — ${firstService} — ${safeName}`,
      html: notificationHtml(lead),
      text: [
        "NEW KAR FX CUSTOMS QUOTE REQUEST",
        "",
        ...leadRows(lead).map(([label, value]) => `${label}: ${value}`),
      ].join("\n"),
    },
    { idempotencyKey: `quote-notification-${lead.submissionId}` }
  );

  if (notificationError) {
    console.error("[KAR FX Quote] notification failed", notificationError, lead);
    if (saved) return NextResponse.json({ success: true });
    return NextResponse.json({ success: false, error: "Email delivery failed." }, { status: 503 });
  }

  if (lead.email) {
    const { error: confirmationError } = await resend.emails.send(
      {
        from: fromEmail,
        to: lead.email,
        replyTo: notificationEmail,
        subject: "We received your KAR FX Customs request",
        html: confirmationHtml(lead),
        text: `Thank you very much, ${lead.name}.\n\nWe received your request about ${lead.services.join(", ")}. We would like to learn a little more about your vehicle and what you are looking for, so we can coordinate a visit and evaluate the best options for you. We will reply within 24 hours on weekdays.\n\nIf you need us sooner, please call or text ${BUSINESS_INFO.phoneDisplay}. We look forward to speaking with you.`,
      },
      { idempotencyKey: `quote-confirmation-${lead.submissionId}` }
    );
    // The shop already has the lead, so a courtesy-email failure should not fail the form.
    if (confirmationError) console.error("[KAR FX Quote] confirmation failed", confirmationError);
  }

  return NextResponse.json({ success: true });
}
