import { BUSINESS_INFO } from "@/lib/business";

// Shared by the shop's emails (website quotes, AI phone alerts).

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export function emailFrame(content: string) {
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

// Label/value rows; values are escaped here, so callers pass raw text.
export function emailTable(rows: [string, string][]) {
  return `<table role="presentation" style="width:100%;border-collapse:collapse">
      ${rows.map(([label, value]) => `<tr>
        <td style="width:120px;padding:12px 12px 12px 0;border-top:1px solid #2b2b2b;color:#999;font-size:13px;vertical-align:top">${escapeHtml(label)}</td>
        <td style="padding:12px 0;border-top:1px solid #2b2b2b;color:#fff;font-size:15px;white-space:pre-wrap">${escapeHtml(value)}</td>
      </tr>`).join("")}
    </table>`;
}

// Where shop alerts go and come from. Set in Vercel, never written into the code.
export function leadEmailAddresses() {
  return {
    from: process.env.LEAD_FROM_EMAIL ?? "KAR FX Customs Website <quotes@karfxcustoms.com>",
    to: process.env.LEAD_NOTIFICATION_EMAIL ?? BUSINESS_INFO.email,
  };
}
