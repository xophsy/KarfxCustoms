import Link from "next/link";
import PrintButton from "@/components/admin/PrintButton";
import InspectionSheet from "@/components/admin/sheets/InspectionSheet";
import { requireUser } from "@/lib/admin/session";

export default async function InspectionSheetPage() {
  await requireUser();
  return (
    <>
      {/* One letter-size page with no browser margins; the sheet carries its own. */}
      <style>{`@page { size: letter; margin: 0; }`}</style>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <Link href="/admin/sheets" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
            ← Sheets
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold">Vehicle inspection</h1>
          <p className="mt-1 text-sm text-white/55">One letter-size page. Fill it in at drop-off and have the client sign.</p>
        </div>
        <PrintButton />
      </div>
      <div className="overflow-x-auto pb-4 print:overflow-visible print:p-0">
        <InspectionSheet />
      </div>
    </>
  );
}
