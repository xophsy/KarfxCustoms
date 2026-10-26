import Link from "next/link";
import { VEHICLE_TYPES } from "@/components/admin/sheets/CarDiagrams";
import { requireUser } from "@/lib/admin/session";

// Add a sheet: build it in components/admin/sheets/, give it a page under this folder, list it here.
export default async function SheetsPage() {
  await requireUser();
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Printables</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Sheets</h1>
      <p className="mt-2 text-sm text-white/55">The forms the shop prints. Open one and press Print.</p>

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Vehicle inspection</h2>
        <p className="mt-1 text-sm text-white/55">Damage diagram, quick check and client signatures for drop-off and pick-up.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VEHICLE_TYPES.map((t) => (
            <li key={t.id}>
              <Link
                href={`/admin/sheets/inspection?type=${t.id}`}
                className="block h-full border border-white/10 bg-surface-800 p-5 font-semibold text-white transition-colors hover:border-gold-500 hover:text-gold-500"
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
