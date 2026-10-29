import type { CallInput, SavedCall } from "@/lib/admin/calls";
import { serviceName } from "@/lib/admin/leads";
import { emailFrame, emailTable, escapeHtml } from "@/lib/email";

// Spam, robocalls and hang-ups where the caller never spoke are only logged, never emailed.
export const shouldAlert = (call: CallInput) => call.callType !== "spam" && call.callerSpoke;

export function callAlert(call: CallInput, saved: SavedCall | null, siteUrl: string) {
  const again = saved?.outcome === "added-to-lead";
  const services = call.serviceKeys.map(serviceName).filter((name): name is string => name !== null);
  const who = `${call.callerName ?? call.callbackPhone ?? "No caller ID"}${again ? " called again" : ""}`;
  const what =
    call.callType === "inquiry" ? services[0] ?? "Not sure yet" : call.callType === "existing_customer" ? "existing customer" : "not a lead";
  const subject = `${call.urgent ? "Urgent: " : ""}Missed call — ${who} — ${what}`;

  const leadUrl = saved?.leadId ? `${siteUrl}/admin/leads/${saved.leadId}` : null;
  const rows: [string, string][] = [
    ["Caller", call.callerName ?? "Didn't say"],
    ["Call back", call.callbackPhone ?? "No number"],
    ["Vehicle", call.vehicle ?? "Didn't say"],
    ["Wants", services.join(", ") || "Not sure yet"],
    ["When", call.timeframe ?? "Didn't say"],
    ["Urgent", call.urgent ? "Yes" : "No"],
    ["Summary", call.summary || "No summary"],
  ];

  const links = [
    call.callbackPhone &&
      `Call back <a href="tel:${call.callbackPhone.replace(/\D/g, "")}" style="color:#D4AF37">${escapeHtml(call.callbackPhone)}</a>`,
    leadUrl && `<a href="${escapeHtml(leadUrl)}" style="color:#D4AF37">Open the lead</a>`,
  ].filter(Boolean);

  const html = emailFrame(`
    <h1 style="margin:0 0 8px;font-size:28px;line-height:1.2">${again ? "They called again" : "The AI answered a missed call"}</h1>
    <p style="margin:0 0 28px;color:#aaa">${links.join(" · ") || "No number to call back."}</p>
    ${emailTable(rows)}`);
  const text = [
    "MISSED CALL, ANSWERED BY THE AI",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(leadUrl ? ["", `Lead: ${leadUrl}`] : []),
  ].join("\n");

  return { subject, html, text };
}
