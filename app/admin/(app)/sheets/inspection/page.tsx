import Link from "next/link";
import PrintButton from "@/components/admin/PrintButton";
import { VEHICLE_TYPES, type VehicleType } from "@/components/admin/sheets/CarDiagrams";
import InspectionSheet from "@/components/admin/sheets/InspectionSheet";
import { requireUser } from "@/lib/admin/session";
import { cn } from "@/lib/utils";

export default async function InspectionSheetPage({ searchParams }: { searchParams: { type?: string } }) {
  await requireUser();
  const type: VehicleType = VEHICLE_TYPES.some((t) => t.id === searchParams.type) ? (searchParams.type as VehicleType) : "sedan";

  return (
    <>
      {/* One letter-size page with no browser margins; the sheet carries its own. */}
      <style>{`@page { size: letter; margin: 0; }`}</style>
      <div className="mb-6 space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin/sheets" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
              ← Sheets
            </Link>
            <h1 className="mt-2 font-display text-3xl font-semibold">Vehicle inspection</h1>
            <p className="mt-1 text-sm text-white/55">Pick the vehicle type, print, fill it in at drop-off and have the client sign.</p>
          </div>
          <PrintButton />
        </div>
        <nav aria-label="Vehicle type" className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((t) => (
            <Link
              key={t.id}
              href={`/admin/sheets/inspection?type=${t.id}`}
              aria-current={t.id === type ? "page" : undefined}
              className={cn(
                "border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                t.id === type ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="overflow-x-auto pb-4 print:overflow-visible print:p-0">
        <InspectionSheet type={type} />
      </div>
    </>
  );
}
