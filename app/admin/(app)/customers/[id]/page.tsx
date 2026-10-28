import Link from "next/link";
import { notFound } from "next/navigation";
import SubmitButton from "@/components/admin/SubmitButton";
import { getCustomer } from "@/lib/admin/customers";
import { formatAge } from "@/lib/admin/format";
import { LEAD_STAGES, serviceName } from "@/lib/admin/leads";
import { requireUser } from "@/lib/admin/session";
import { addVehicleAction, archiveVehicleAction } from "../actions";
import EditCustomerForm from "./EditCustomerForm";

const heading = "text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50";

export default async function CustomerPage({ params }: { params: { id: string } }) {
  await requireUser();
  const customer = await getCustomer(params.id);
  if (!customer) notFound();

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <Link href="/admin/customers" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
          ← Customers
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{customer.name}</h1>
        <p className="mt-1 text-sm text-white/45">
          Customer since {customer.createdAt.toLocaleDateString("en-US", { timeZone: "America/New_York", month: "long", year: "numeric" })}
        </p>
      </div>

      <EditCustomerForm customer={customer} />

      <section className="space-y-3">
        <h2 className={heading}>Vehicles</h2>
        {customer.vehicles.length > 0 && (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {customer.vehicles.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-4 py-3">
                <span className="min-w-0 break-words">{v.label}</span>
                <form action={archiveVehicleAction}>
                  <input type="hidden" name="vehicleId" value={v.id} />
                  <input type="hidden" name="customerId" value={customer.id} />
                  <SubmitButton pendingLabel="Archiving…" className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40 hover:text-red-300">
                    Archive
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}
        {/* key remounts the form after each add, which clears the box */}
        <form key={customer.vehicles.length} action={addVehicleAction} className="flex gap-2">
          <input type="hidden" name="customerId" value={customer.id} />
          <label htmlFor="vehicle-label" className="sr-only">New vehicle</label>
          <input
            id="vehicle-label"
            name="label"
            required
            placeholder="2024 BMW X5 · black"
            className="input-gold min-w-0 flex-1 border border-white/10 bg-surface-800 px-4 py-3 text-base text-white placeholder-white/25 focus:border-gold-500 focus:outline-none focus:ring-0"
          />
          <SubmitButton pendingLabel="Adding…" className="btn-ghost">Add</SubmitButton>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className={heading}>Leads</h2>
        {customer.leads.length === 0 ? (
          <p className="text-sm text-white/40">No leads yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {customer.leads.map((lead) => (
              <li key={lead.id}>
                <Link href={`/admin/leads/${lead.id}`} className="group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                  <span className="min-w-0">
                    <span className="font-mono text-xs text-white/40">L-{lead.number}</span>{" "}
                    <span className="group-hover:text-gold-500">
                      {lead.services.map((key) => serviceName(key) ?? key).join(", ") || "Service not picked yet"}
                    </span>
                  </span>
                  <span className="text-xs text-white/45">
                    {LEAD_STAGES.find((s) => s.id === lead.stage)?.label} · {formatAge(lead.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
