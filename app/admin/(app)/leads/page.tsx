import Link from "next/link";
import { formatAge } from "@/lib/admin/format";
import { LEAD_SOURCES, LEAD_STAGES, listLeads, serviceName, type LeadRow } from "@/lib/admin/leads";
import { requireUser } from "@/lib/admin/session";

function LeadCard({ lead, now }: { lead: LeadRow; now: Date }) {
  const services = lead.services.map((key) => serviceName(key) ?? key).join(", ");
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className="block space-y-1 border border-white/10 bg-surface-800 px-4 py-3 transition-colors hover:border-gold-500"
    >
      <span className="flex justify-between gap-2 text-xs text-white/40">
        <span className="font-mono">L-{lead.number}</span>
        <span>{formatAge(lead.createdAt, now)}</span>
      </span>
      <span className="block font-semibold text-white">{lead.customer.name}</span>
      <span className="block text-sm text-white/60">{services || "Service not picked yet"}</span>
      <span className="block text-xs text-white/40">{LEAD_SOURCES[lead.source] ?? lead.source}</span>
    </Link>
  );
}

export default async function LeadsPage() {
  await requireUser();
  const leads = await listLeads();
  const now = new Date();

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Pipeline</p>
          <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Leads</h1>
        </div>
        <Link href="/admin/leads/new" className="btn-gold">
          Add lead
        </Link>
      </header>

      <div className="grid gap-8 md:grid-flow-col md:auto-cols-[minmax(180px,1fr)] md:gap-3 md:overflow-x-auto md:pb-2">
        {LEAD_STAGES.map((stage) => {
          const items = leads.filter((lead) => lead.stage === stage.id);
          return (
            <section key={stage.id} aria-labelledby={`stage-${stage.id}`} className="min-w-0 space-y-2">
              <h2
                id={`stage-${stage.id}`}
                className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60"
              >
                {stage.label}
                <span className="tabular-nums text-white/35">{items.length}</span>
              </h2>
              {items.length ? (
                items.map((lead) => <LeadCard key={lead.id} lead={lead} now={now} />)
              ) : (
                <p className="py-2 text-sm text-white/30">None right now</p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
