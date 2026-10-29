import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveCall, type SavedCall } from "@/lib/admin/calls";
import { leadEmailAddresses } from "@/lib/email";
import { callAlert, shouldAlert } from "@/lib/phone/alert";
import { parseRetellCall, verifyRetellSignature } from "@/lib/phone/retell";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/phone/retell
//
// Retell's webhook for the AI that answers the shop's missed calls. On
// call_analyzed it saves the call (and its lead) in the shop admin, then emails
// the shop. Same fallback as /api/quote: if the database is down the email
// still goes out, and only when neither worked do we ask Retell to retry.
//
// Vercel env vars:
//   RETELL_API_KEY   signs every webhook; without it every call is refused
//   RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL, LEAD_FROM_EMAIL   as in /api/quote
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";

const accepted = () => new NextResponse(null, { status: 204 });

export async function POST(request: NextRequest) {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    console.error("[KAR FX Phone] RETELL_API_KEY is not set: calls can't be checked or saved");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  const rawBody = await request.text();
  if (!verifyRetellSignature(rawBody, apiKey, request.headers.get("x-retell-signature"))) {
    // Every real call fails this way if RETELL_API_KEY isn't the Retell key with the webhook badge.
    console.error("[KAR FX Phone] webhook signature rejected: check RETELL_API_KEY is Retell's webhook key");
    return NextResponse.json({ error: "Bad signature." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  // Only call_analyzed carries the summary and the fields the shop needs.
  if (body?.event !== "call_analyzed") return accepted();

  const call = parseRetellCall(body.call);
  if (!call) return NextResponse.json({ error: "Not a call." }, { status: 400 });

  let saved: SavedCall | null = null;
  try {
    saved = await saveCall(call);
  } catch (err) {
    console.error("[KAR FX Phone] call not saved to the database", call.retellCallId, err);
  }

  if (!shouldAlert(call)) return accepted();

  let emailed = false;
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const { from, to } = leadEmailAddresses();
    try {
      const { error } = await new Resend(resendKey).emails.send(
        { from, to, ...callAlert(call, saved, new URL(request.url).origin) },
        // Retell retries and duplicates deliveries: one email per call, ever.
        { idempotencyKey: `call-alert-${call.retellCallId}` }
      );
      if (error) console.error("[KAR FX Phone] alert email failed", call.retellCallId, error);
      else emailed = true;
    } catch (err) {
      console.error("[KAR FX Phone] alert email failed", call.retellCallId, err);
    }
  }

  if (saved || emailed) return accepted();
  // Nothing kept: Retell retries up to 3 times, and the call stays in its dashboard either way.
  console.error("[KAR FX Phone] call neither saved nor emailed", call.retellCallId);
  return NextResponse.json({ error: "Not stored." }, { status: 500 });
}
