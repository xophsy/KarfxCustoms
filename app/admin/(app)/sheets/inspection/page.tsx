import Link from "next/link";
import PrintButton from "@/components/admin/PrintButton";
import InspectionPicker from "@/components/admin/sheets/InspectionPicker";
import { VEHICLES, vehicleById } from "@/components/admin/sheets/vehicles";
import { requireUser } from "@/lib/admin/session";

export default async function InspectionSheetPage({ searchParams }: { searchParams: { type?: string } }) {
  await requireUser();
  const vehicle = vehicleById(searchParams.type) ?? VEHICLES[0];

  return (
    <>
      {/* One letter-size page with no browser margins; the sheet carries its own. */}
      <style>{`@page { size: letter; margin: 0; }`}</style>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <Link href="/admin/sheets" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
            ← All vehicles
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold">Vehicle inspection</h1>
          <p className="mt-1 text-sm text-white/55">Pick the vehicle, print, fill it in at drop-off and have the client sign.</p>
        </div>
        <PrintButton />
      </div>
      {/* key: a fresh link from the Sheets page starts the picker on that vehicle */}
      <InspectionPicker key={vehicle.id} initial={vehicle.id} />
    </>
  );
}
