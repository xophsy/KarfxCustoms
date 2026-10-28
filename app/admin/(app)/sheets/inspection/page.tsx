import Link from "next/link";
import PrintButton from "@/components/admin/PrintButton";
import InspectionSheet from "@/components/admin/sheets/InspectionSheet";
import { VEHICLE_GROUPS, VEHICLES, vehicleById } from "@/components/admin/sheets/vehicles";
import { requireUser } from "@/lib/admin/session";
import { cn } from "@/lib/utils";

export default async function InspectionSheetPage({ searchParams }: { searchParams: { type?: string } }) {
  await requireUser();
  const vehicle = vehicleById(searchParams.type) ?? VEHICLES[0];
  const group = VEHICLE_GROUPS.find((g) => g.id === vehicle.group)!;

  return (
    <>
      {/* One letter-size page with no browser margins; the sheet carries its own. */}
      <style>{`@page { size: letter; margin: 0; }`}</style>
      <div className="mb-6 space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin/sheets" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
              ← All vehicles
            </Link>
            <h1 className="mt-2 font-display text-3xl font-semibold">Vehicle inspection</h1>
            <p className="mt-1 text-sm text-white/55">Pick the vehicle, print, fill it in at drop-off and have the client sign.</p>
          </div>
          <PrintButton />
        </div>
        <nav aria-label={group.label} className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{group.label}</p>
          <div className="flex flex-wrap gap-2">
            {VEHICLES.filter((v) => v.group === vehicle.group).map((v) => (
              <Link
                key={v.id}
                href={`/admin/sheets/inspection?type=${v.id}`}
                aria-current={v.id === vehicle.id ? "page" : undefined}
                className={cn(
                  "border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                  v.id === vehicle.id ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                )}
              >
                {v.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="overflow-x-auto pb-4 print:overflow-visible print:p-0">
        <InspectionSheet type={vehicle.id} />
      </div>
    </>
  );
}
