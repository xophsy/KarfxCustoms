import Link from "next/link";
import { listCustomers } from "@/lib/admin/customers";
import { requireUser } from "@/lib/admin/session";

export default async function CustomersPage({ searchParams }: { searchParams: { q?: string } }) {
  await requireUser();
  const q = (searchParams.q ?? "").slice(0, 100);
  const customers = await listCustomers(q);

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Directory</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Customers</h1>

      <form role="search" className="mt-6 flex gap-2">
        <label htmlFor="customer-search" className="sr-only">Search customers</label>
        <input
          id="customer-search"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Name, phone or email"
          className="input-gold min-w-0 flex-1 border border-white/10 bg-surface-800 px-4 py-3 text-base text-white placeholder-white/25 focus:border-gold-500 focus:outline-none focus:ring-0"
        />
        <button type="submit" className="btn-ghost">Search</button>
      </form>

      <p className="mt-4 text-sm text-white/45">
        {q ? `${customers.length} matching “${q}”` : `${customers.length} customers`}
        {customers.length === 200 && " (showing the first 200)"}
      </p>

      <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
        {customers.map((c) => (
          <li key={c.id}>
            <Link href={`/admin/customers/${c.id}`} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <span className="min-w-0">
                <span className="block font-semibold text-white group-hover:text-gold-500">{c.name}</span>
                <span className="block text-sm tabular-nums text-white/55">{c.phone}{c.email ? ` · ${c.email}` : ""}</span>
              </span>
              <span className="text-xs text-white/40">
                {c.vehicleCount} {c.vehicleCount === 1 ? "vehicle" : "vehicles"} · {c.leadCount} {c.leadCount === 1 ? "lead" : "leads"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {customers.length === 0 && <p className="py-6 text-sm text-white/40">No customers match that search.</p>}
    </div>
  );
}
