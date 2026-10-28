import Link from "next/link";
import { ChevronDown, Folder } from "lucide-react";
import { VEHICLE_GROUPS, VEHICLES, type Vehicle } from "@/components/admin/sheets/vehicles";
import { requireUser } from "@/lib/admin/session";

function VehicleLinks({ vehicles }: { vehicles: readonly Vehicle[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((v) => (
        <li key={v.id}>
          <Link
            href={`/admin/sheets/inspection?type=${v.id}`}
            className="block h-full border border-white/10 bg-surface-800 p-5 font-semibold text-white transition-colors hover:border-gold-500 hover:text-gold-500"
          >
            {v.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Add a sheet: build it in components/admin/sheets/, give it a page under this folder, list it here.
export default async function SheetsPage() {
  await requireUser();
  const others = VEHICLE_GROUPS.filter((g) => g.id !== "main");
  const otherCount = VEHICLES.filter((v) => v.group !== "main").length;

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Printables</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Sheets</h1>
      <p className="mt-2 text-sm text-white/55">The forms the shop prints. Open one and press Print.</p>

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Vehicle inspection</h2>
        <p className="mt-1 text-sm text-white/55">Damage drawing, quick check and client signatures for drop-off and pick-up.</p>
        <div className="mt-4">
          <VehicleLinks vehicles={VEHICLES.filter((v) => v.group === "main")} />
        </div>

        <details className="group mt-6 border border-white/10 bg-surface-800/40">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 font-semibold text-white hover:text-gold-500 [&::-webkit-details-marker]:hidden">
            <Folder size={18} className="text-gold-500" aria-hidden="true" />
            Other vehicles
            <span className="text-sm font-normal text-white/45">{otherCount} sheets</span>
            <ChevronDown size={18} className="ml-auto transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-6 border-t border-white/10 p-5">
            {others.map((g) => (
              <div key={g.id}>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">{g.label}</h3>
                <VehicleLinks vehicles={VEHICLES.filter((v) => v.group === g.id)} />
              </div>
            ))}
          </div>
        </details>
      </section>
    </div>
  );
}
