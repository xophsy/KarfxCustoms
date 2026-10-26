import Image from "next/image";
import { BUSINESS_INFO } from "@/lib/business";
import { EndDiagram, SideDiagram, TopDiagram, VEHICLE_TYPES, type VehicleType } from "./CarDiagrams";

const QUICK_CHECK = ["Glass", "Lights", "Wheels and tires", "Paint and clear coat", "Film, wrap or coating", "Interior"];

const DAMAGE_KEY = [
  ["S", "Scratch"],
  ["D", "Dent"],
  ["C", "Chip"],
  ["CR", "Crack"],
  ["R", "Rust"],
  ["P", "Paint or clear coat failure"],
  ["F", "Existing film or wrap"],
];

const label = "shrink-0 text-[7.5pt] font-semibold uppercase tracking-[0.08em] text-neutral-600";
const caption = "text-center text-[6.5pt] uppercase tracking-[0.16em] text-neutral-500";

function Line({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <span className={label}>{name}</span>
      <span className="h-[18pt] flex-1 border-b border-neutral-400" />
    </div>
  );
}

function Box() {
  return <span className="inline-block h-[9pt] w-[9pt] shrink-0 border border-neutral-700" />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-[6pt] flex items-center gap-2 text-[8pt] font-semibold uppercase tracking-[0.18em] text-black">
      <span className="h-[8pt] w-[3pt] bg-[#D4AF37]" style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} />
      {children}
    </h2>
  );
}

export default function InspectionSheet({ type }: { type: VehicleType }) {
  const typeLabel = VEHICLE_TYPES.find((t) => t.id === type)?.label ?? "";

  return (
    <article
      className="sheet mx-auto flex flex-col bg-white font-body text-[9pt] leading-snug text-black shadow-2xl print:shadow-none"
      style={{ width: "8.5in", minHeight: "11in", padding: "0.35in 0.45in" }}
    >
      {/* Header: both logos large */}
      <header className="grid grid-cols-[1.35in_1fr_2.1in] items-center gap-4 border-b-[1.5pt] border-[#D4AF37] pb-[8pt]">
        <Image src="/images/branding/logo-badge.png" alt="KAR FX Customs" width={130} height={131} priority className="h-[1.3in] w-auto" />
        <div className="text-center">
          <h1 className="font-display text-[24pt] font-semibold leading-tight">Vehicle Inspection</h1>
          <p className="mt-[2pt] text-[8pt] font-semibold uppercase tracking-[0.28em] text-neutral-500">{typeLabel}</p>
        </div>
        <div className="flex flex-col items-center text-center">
          {/* RestorFX's official wordmark (vector, from restorfx.com); plain img keeps the SVG sharp in print */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/branding/restorfx-logo.svg" alt="RestorFX" width={140} height={13} className="h-auto w-full" />
          <p className="mt-[6pt] text-[7.5pt] uppercase tracking-[0.3em] text-neutral-500">Raleigh</p>
        </div>
      </header>

      {/* Who and what */}
      <section className="mt-[8pt] grid grid-cols-12 gap-x-4 gap-y-[2pt]">
        <Line name="Date" className="col-span-4" />
        <Line name="Job #" className="col-span-4" />
        <Line name="Inspected by" className="col-span-4" />
        <Line name="Customer" className="col-span-7" />
        <Line name="Phone" className="col-span-5" />
        <Line name="Year / make / model" className="col-span-7" />
        <Line name="Color" className="col-span-2" />
        <Line name="Miles" className="col-span-3" />
        <Line name="VIN" className="col-span-8" />
        <Line name="Plate" className="col-span-4" />
      </section>

      {/* Damage diagram */}
      <section className="mt-[12pt]">
        <SectionTitle>Mark any damage</SectionTitle>
        <div className="grid grid-cols-[1fr_0.36fr_0.22fr] items-center gap-x-5 rounded-[4pt] border border-neutral-300 px-[10pt] py-[6pt]">
          <div className="space-y-[2pt]">
            <SideDiagram type={type} facing="left" />
            <p className={caption}>Driver side</p>
            <SideDiagram type={type} facing="right" />
            <p className={caption}>Passenger side</p>
          </div>
          <div className="space-y-[2pt]">
            <EndDiagram type={type} end="front" />
            <p className={caption}>Front</p>
            <EndDiagram type={type} end="rear" />
            <p className={caption}>Rear</p>
          </div>
          <div className="flex h-[3.3in] flex-col items-center">
            <TopDiagram type={type} />
            <p className={caption}>Top</p>
          </div>
        </div>
        <p className="mt-[5pt] flex flex-wrap justify-center gap-x-4 gap-y-[2pt] text-[8pt] text-neutral-700">
          {DAMAGE_KEY.map(([code, name]) => (
            <span key={code}>
              <b className="text-black">{code}</b> {name}
            </span>
          ))}
        </p>
      </section>

      {/* Quick check */}
      <section className="mt-[12pt]">
        <SectionTitle>Quick check</SectionTitle>
        <div className="grid grid-cols-3 gap-x-6 gap-y-[6pt]">
          {QUICK_CHECK.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[7.5pt] text-neutral-600"><Box /> OK</span>
              <span className="flex items-center gap-1 text-[7.5pt] text-neutral-600"><Box /> Issue</span>
              <span className="ml-1">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="mt-[12pt]">
        <SectionTitle>Work requested and notes</SectionTitle>
        {[0, 1, 2].map((i) => (
          <span key={i} className="block h-[18pt] border-b border-neutral-400" />
        ))}
      </section>

      {/* Signatures */}
      <section className="mt-auto pt-[12pt]">
        <p className="text-[8pt] leading-relaxed text-neutral-700">
          I agree this sheet shows my vehicle&apos;s condition at drop-off. {BUSINESS_INFO.brandName} isn&apos;t responsible for damage
          marked above or for items left in the vehicle.
        </p>
        <div className="mt-[8pt] grid grid-cols-[2fr_1fr] gap-x-6 gap-y-[6pt]">
          <Line name="Client signature, drop-off" />
          <Line name="Date" />
          <Line name="Client signature, pick-up" />
          <Line name="Date" />
        </div>
      </section>

      <footer className="mt-[10pt] flex justify-between border-t border-neutral-300 pt-[4pt] text-[7pt] text-neutral-500">
        <span>
          {BUSINESS_INFO.brandName} · {BUSINESS_INFO.fullAddress}
        </span>
        <span>{BUSINESS_INFO.phoneDisplay} · karfxcustoms.com</span>
      </footer>
    </article>
  );
}
