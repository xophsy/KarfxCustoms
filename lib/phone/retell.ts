import { createHmac, timingSafeEqual } from "node:crypto";
import { BUSINESS_INFO } from "@/lib/business";
import { CALL_TYPES, type CallInput, type CallType } from "@/lib/admin/calls";
import { serviceName } from "@/lib/admin/leads";
import { formatPhone, normalizePhone } from "@/lib/admin/phone";

const FIVE_MINUTES = 5 * 60 * 1000;
const SHOP_DIGITS = normalizePhone(BUSINESS_INFO.phoneHref);

// Same check as retell-sdk's verify (tests/phone/retell.test.ts proves it against the SDK):
// header "v=<ms timestamp>,d=<hex HMAC-SHA256 of body + timestamp, keyed with the API key>".
export function verifyRetellSignature(rawBody: string, apiKey: string, header: string | null, now = Date.now()): boolean {
  const match = /^v=(\d+),d=([0-9a-f]{64})$/i.exec(header ?? "");
  if (!match) return false;
  const timestamp = Number(match[1]);
  if (!Number.isSafeInteger(timestamp) || Math.abs(now - timestamp) > FIVE_MINUTES) return false;
  const expected = createHmac("sha256", apiKey).update(rawBody + timestamp).digest();
  return timingSafeEqual(expected, Buffer.from(match[2], "hex"));
}

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// The analysis model writes words like "unknown" or "N/A" into fields the caller never filled.
const PLACEHOLDER = /^(unknown|n\/?a|none|not provided|not given|null)?$/i;
function optional(value: unknown, max: number): string | null {
  const v = text(value, max);
  return PLACEHOLDER.test(v.replace(/[.!?]+$/, "")) ? null : v;
}

// Forwarding can show the shop's own number as the caller ID: that is no caller ID at all.
function usablePhone(value: unknown): string | null {
  const digits = normalizePhone(text(value, 40));
  return digits && digits !== SHOP_DIGITS ? formatPhone(digits) : null;
}

function httpsUrl(value: unknown): string | null {
  const url = text(value, 2000);
  try {
    return new URL(url).protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

const time = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? new Date(value) : null);

// The `call` object of a call_analyzed webhook → what saveCall needs. Null when it isn't a call.
export function parseRetellCall(call: unknown): CallInput | null {
  if (!call || typeof call !== "object") return null;
  const c = call as Record<string, any>;
  const retellCallId = text(c.call_id, 100);
  if (!retellCallId) return null;

  const custom: Record<string, unknown> = c.call_analysis?.custom_analysis_data ?? {};
  const transcript = text(c.transcript, 50_000);
  const callType: CallType = CALL_TYPES.find((t) => t === custom.call_type) ?? "other";
  const serviceKeys = Array.from(
    new Set(text(custom.service_keys, 1000).split(",").map((k) => k.trim()).filter((k) => serviceName(k)))
  ).slice(0, 10);

  return {
    retellCallId,
    fromNumber: text(c.from_number, 40) || null,
    callbackPhone: usablePhone(custom.callback_number) ?? usablePhone(c.from_number),
    callerName: optional(custom.caller_name, 100),
    vehicle: optional(custom.vehicle, 120),
    serviceKeys,
    timeframe: optional(custom.timeframe, 120),
    callType,
    urgent: custom.urgent === true,
    summary: text(c.call_analysis?.call_summary, 2000),
    transcript,
    recordingUrl: httpsUrl(c.recording_url),
    startedAt: time(c.start_timestamp),
    endedAt: time(c.end_timestamp),
    callerSpoke: Array.isArray(c.transcript_object)
      ? c.transcript_object.some((t: any) => t?.role === "user" && typeof t.content === "string" && t.content.trim() !== "")
      : /^User:\s*\S/m.test(transcript),
  };
}
