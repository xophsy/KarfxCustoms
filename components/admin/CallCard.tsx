import Link from "next/link";
import type { CallRow, CallType } from "@/lib/admin/calls";
import { formatAge } from "@/lib/admin/format";

const TYPE_LABELS: Record<CallType, string> = {
  inquiry: "Inquiry",
  existing_customer: "Existing customer",
  vendor: "Vendor",
  spam: "Spam",
  other: "Other",
};

// One AI-answered call. In the Calls list it names the caller and links the lead;
// on a lead's own page (showLead off) the page header already shows who it is.
export default function CallCard({ call, showLead = false }: { call: CallRow; showLead?: boolean }) {
  const when = call.at.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });

  return (
    <article className="space-y-3 border border-white/10 bg-surface-800 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {showLead ? (
          <p className="font-semibold text-white">{call.callerName ?? "Unknown caller"}</p>
        ) : (
          <p className="text-sm font-semibold text-white">Phone call</p>
        )}
        <p className="text-xs text-white/45">
          {when} · {formatAge(call.at)}
        </p>
      </div>

      <p className="flex flex-wrap items-center gap-2 text-sm">
        {showLead &&
          (call.callbackPhone ? (
            <a href={`tel:${call.callbackPhone.replace(/\D/g, "")}`} className="tabular-nums text-white hover:text-gold-500">
              {call.callbackPhone}
            </a>
          ) : (
            <span className="text-white/40">No number</span>
          ))}
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70">{TYPE_LABELS[call.callType]}</span>
        {call.urgent && (
          <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-red-300">
            Urgent
          </span>
        )}
        {showLead && call.leadId && (
          <Link href={`/admin/leads/${call.leadId}`} className="ml-auto font-mono text-xs text-white/55 hover:text-gold-500">
            L-{call.leadNumber} →
          </Link>
        )}
      </p>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">{call.summary || "No summary."}</p>

      {call.recordingUrl ? (
        <audio controls preload="none" src={call.recordingUrl} className="w-full" />
      ) : (
        <p className="text-xs text-white/40">No recording</p>
      )}

      {call.transcript && (
        <details className="text-sm">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-white/45 hover:text-gold-500">
            Transcript
          </summary>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-white/70">{call.transcript}</p>
        </details>
      )}
    </article>
  );
}
