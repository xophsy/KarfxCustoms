import Link from "next/link";
import { requireUser } from "@/lib/admin/session";

// Add a sheet: build it in components/admin/sheets/, give it a page under this folder, list it here.
const SHEETS = [
  {
    href: "/admin/sheets/inspection",
    name: "Vehicle inspection",
    description: "Damage diagram, condition checklist and client signatures for drop-off and pick-up.",
  },
];

export default async function SheetsPage() {
  await requireUser();
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Printables</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Sheets</h1>
      <p className="mt-2 text-sm text-white/55">The forms the shop prints. Open one and press Print.</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {SHEETS.map((sheet) => (
          <li key={sheet.href}>
            <Link
              href={sheet.href}
              className="block h-full border border-white/10 bg-surface-800 p-5 transition-colors hover:border-gold-500"
            >
              <span className="block font-semibold text-white">{sheet.name}</span>
              <span className="mt-1 block text-sm text-white/55">{sheet.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
