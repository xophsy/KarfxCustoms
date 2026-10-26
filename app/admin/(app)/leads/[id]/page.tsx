import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/admin/CopyButton";
import { formatAge } from "@/lib/admin/format";
import { LEAD_SOURCES, LEAD_STAGES, NEXT_STAGES, getLead, serviceName } from "@/lib/admin/leads";
import { requireUser } from "@/lib/admin/session";
import { moveLead, updateNotes } from "../actions";

const term = "text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45 pt-0.5";
const stageLabel = (id: string) => LEAD_STAGES.find((s) => s.id === id)?.label ?? id;

export default async function LeadPage({ params }: { params: { id: string } }) {
  await requireUser();
  const lead = await getLead(params.id);
  if (!lead) notFound();

  const services = lead.services.map((key) => serviceName(key) ?? key);
  const received = lead.createdAt.toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link href="/admin/leads" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
          ← Leads
        </Link>
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/50">
          <span className="font-mono">L-{lead.number}</span>
          <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-gold-500">
            {stageLabel(lead.stage)}
          </span>
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">{lead.customer.name}</h1>
        <Link href={`/admin/customers/${lead.customer.id}`} className="mt-1 inline-block text-sm text-white/50 hover:text-gold-500">
          Customer record →
        </Link>
      </div>

      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm sm:grid-cols-[120px_minmax(0,1fr)]">
        <dt className={term}>Phone</dt>
        <dd className="flex flex-wrap items-center gap-2">
          <a href={`tel:${lead.customer.phone.replace(/[^\d+]/g, "")}`} className="tabular-nums text-white hover:text-gold-500">
            {lead.customer.phone}
          </a>
          <CopyButton text={lead.customer.phone} />
        </dd>
        <dt className={term}>Email</dt>
        <dd className="break-words">
          {lead.customer.email ? (
            <a href={`mailto:${lead.customer.email}`} className="hover:text-gold-500">{lead.customer.email}</a>
          ) : (
            <span className="text-white/40">Not given</span>
          )}
        </dd>
        <dt className={term}>Wants</dt>
        <dd>{services.length ? services.join(", ") : <span className="text-white/40">Not picked yet</span>}</dd>
        <dt className={term}>Came from</dt>
        <dd>{LEAD_SOURCES[lead.source] ?? lead.source}</dd>
        <dt className={term}>Received</dt>
        <dd>
          {received} <span className="text-white/40">· {formatAge(lead.createdAt)}</span>
        </dd>
      </dl>

      {lead.message && (
        <section className="space-y-1 border border-white/10 bg-surface-800 p-4">
          <h2 className={term}>What they wrote</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">{lead.message}</p>
        </section>
      )}

      {NEXT_STAGES[lead.stage].length > 0 && (
        <section className="space-y-3">
          <h2 className={term}>Move to</h2>
          <div className="flex flex-wrap gap-2">
            {NEXT_STAGES[lead.stage].map((stage) => (
              <form key={stage} action={moveLead}>
                <input type="hidden" name="id" value={lead.id} />
                <input type="hidden" name="stage" value={stage} />
                <button type="submit" className={stage === "lost" ? "btn-ghost text-red-300" : "btn-gold"}>
                  {stageLabel(stage)}
                </button>
              </form>
            ))}
          </div>
        </section>
      )}

      <form action={updateNotes} className="space-y-3">
        <input type="hidden" name="id" value={lead.id} />
        <label htmlFor="lead-notes" className={`block ${term}`}>Shop notes</label>
        <textarea
          id="lead-notes"
          name="notes"
          rows={4}
          defaultValue={lead.notes}
          key={lead.notes}
          placeholder="Only the shop sees these."
          className="input-gold w-full resize-y border border-white/10 bg-surface-800 px-4 py-3 text-base text-white placeholder-white/25 focus:border-gold-500 focus:outline-none focus:ring-0"
        />
        <button type="submit" className="btn-ghost">Save notes</button>
      </form>
    </div>
  );
}
