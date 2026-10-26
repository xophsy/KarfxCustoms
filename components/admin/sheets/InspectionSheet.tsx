import Image from "next/image";
import { BUSINESS_INFO } from "@/lib/business";
import { EndDiagram, SideDiagram, TopDiagram } from "./CarDiagrams";

const CHECKLIST = [
  "Windshield and glass",
  "Headlights and taillights",
  "Wheels and rims (curb rash)",
  "Tires",
  "Mirrors",
  "Paint and clear coat",
  "Existing PPF, wrap, tint or coating",
  "Trim, badges and emblems",
  "Interior: seats, carpet, headliner",
  "Dash warning lights on",
  "Aftermarket parts or mods",
  "Signs of previous body work",
];

const DAMAGE_KEY = [
  ["S", "Scratch"],
  ["D", "Dent"],
  ["C", "Chip"],
  ["CR", "Crack"],
  ["R", "Rust"],
  ["P", "Paint or clear coat failure"],
  ["F", "Existing film or wrap"],
];

function Line({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-end gap-1.5 ${className}`}>
      <span className="shrink-0 text-[7pt] font-semibold uppercase tracking-[0.08em] text-neutral-600">{label}</span>
      <span className="h-[14pt] flex-1 border-b border-neutral-400" />
    </div>
  );
}

function Box() {
  return <span className="inline-block h-[8pt] w-[8pt] shrink-0 border border-neutral-700" />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-[5pt] flex items-center gap-2 text-[7.5pt] font-semibold uppercase tracking-[0.18em] text-black">
      <span className="h-[7pt] w-[3pt] bg-[#D4AF37] print:bg-[#D4AF37]" style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} />
      {children}
    </h2>
  );
}

export default function InspectionSheet() {
  return (
    <article
      className="sheet mx-auto flex flex-col bg-white font-body text-[8.5pt] leading-snug text-black shadow-2xl print:shadow-none"
      style={{ width: "8.5in", minHeight: "11in", padding: "0.32in 0.42in" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-6 border-b-[1.5pt] border-[#D4AF37] pb-[8pt]">
        <Image src="/images/branding/logo-badge.png" alt="KAR FX Customs" width={86} height={87} priority className="h-[0.8in] w-auto" />
        <div className="text-center">
          <p className="text-[7pt] font-semibold uppercase tracking-[0.3em] text-neutral-500">Drop-off condition report</p>
          <h1 className="font-display text-[22pt] font-semibold leading-tight">Vehicle Inspection</h1>
          <p className="text-[7.5pt] text-neutral-600">
            {BUSINESS_INFO.brandName} · {BUSINESS_INFO.fullAddress} · {BUSINESS_INFO.phoneDisplay}
          </p>
        </div>
        <div className="flex w-[1.5in] flex-col items-center justify-center text-center">
          {/* RestorFX's official wordmark (vector, from restorfx.com); plain img keeps the SVG sharp in print */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/branding/restorfx-logo.svg" alt="RestorFX" width={140} height={13} className="h-auto w-full" />
          <p className="mt-[4pt] text-[6.5pt] uppercase tracking-[0.22em] text-neutral-500">Raleigh</p>
        </div>
      </header>

      <div className="mt-[8pt] grid grid-cols-4 gap-x-4">
        <Line label="Date" />
        <Line label="Time in" />
        <Line label="Job #" />
        <Line label="Inspected by" />
      </div>

      {/* Customer and vehicle */}
      <section className="mt-[8pt]">
        <SectionTitle>Customer and vehicle</SectionTitle>
        <div className="grid grid-cols-6 gap-x-4 gap-y-[3pt]">
          <Line label="Customer" className="col-span-4" />
          <Line label="Phone" className="col-span-2" />
          <Line label="Email" className="col-span-3" />
          <Line label="Year / make / model" className="col-span-3" />
          <Line label="Color" className="col-span-2" />
          <Line label="Plate / state" className="col-span-2" />
          <Line label="Mileage" className="col-span-2" />
          <div className="col-span-4 flex items-end gap-1.5">
            <span className="text-[7pt] font-semibold uppercase tracking-[0.08em] text-neutral-600">VIN</span>
            <span className="flex flex-1">
              {Array.from({ length: 17 }, (_, i) => (
                <span key={i} className="h-[15pt] flex-1 border border-r-0 border-neutral-400 last:border-r" />
              ))}
            </span>
          </div>
          <div className="col-span-2 flex items-end gap-2">
            <span className="text-[7pt] font-semibold uppercase tracking-[0.08em] text-neutral-600">Fuel</span>
            {["E", "¼", "½", "¾", "F"].map((mark) => (
              <span key={mark} className="flex items-center gap-[2pt] text-[7.5pt]">
                <Box /> {mark}
              </span>
            ))}
          </div>
          <Line label="Keys received" className="col-span-2" />
          <div className="col-span-4 flex items-end gap-3 text-[7.5pt]">
            <span className="text-[7pt] font-semibold uppercase tracking-[0.08em] text-neutral-600">Valuables removed by owner</span>
            <span className="flex items-center gap-1"><Box /> Yes</span>
            <span className="flex items-center gap-1"><Box /> No</span>
          </div>
        </div>
      </section>

      {/* Exterior diagrams */}
      <section className="mt-[8pt]">
        <SectionTitle>Exterior condition</SectionTitle>
        <p className="mb-[5pt] flex flex-wrap gap-x-3 gap-y-[2pt] text-[7.5pt] text-neutral-700">
          <span className="font-semibold text-black">Mark each spot with a letter:</span>
          {DAMAGE_KEY.map(([code, name]) => (
            <span key={code}>
              <b className="text-black">{code}</b> {name}
            </span>
          ))}
        </p>
        <div className="grid grid-cols-[1fr_0.55fr_0.42fr] gap-x-4 rounded-[4pt] border border-neutral-300 px-[8pt] py-[4pt]">
          <div className="mx-auto w-[2.85in]">
            <SideDiagram facing="left" />
            <p className="text-center text-[6.5pt] uppercase tracking-[0.15em] text-neutral-500">Driver side</p>
            <SideDiagram facing="right" />
            <p className="text-center text-[6.5pt] uppercase tracking-[0.15em] text-neutral-500">Passenger side</p>
          </div>
          <div className="mx-auto flex w-[1.45in] flex-col justify-around gap-[4pt]">
            <div>
              <EndDiagram end="front" />
              <p className="text-center text-[6.5pt] uppercase tracking-[0.15em] text-neutral-500">Front</p>
            </div>
            <div>
              <EndDiagram end="rear" />
              <p className="text-center text-[6.5pt] uppercase tracking-[0.15em] text-neutral-500">Rear</p>
            </div>
          </div>
          <div className="flex h-[2.2in] flex-col items-center">
            <TopDiagram />
            <p className="text-center text-[6.5pt] uppercase tracking-[0.15em] text-neutral-500">Top</p>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="mt-[8pt]">
        <SectionTitle>Condition check</SectionTitle>
        <div className="grid grid-cols-2 gap-x-6">
          {[CHECKLIST.slice(0, 6), CHECKLIST.slice(6)].map((column, c) => (
            <div key={c}>
              <div className="flex items-end gap-2 border-b border-neutral-300 pb-[2pt] text-[6.5pt] font-semibold uppercase tracking-[0.1em] text-neutral-500">
                <span className="flex-1">Item</span>
                <span className="w-[0.3in] text-center">OK</span>
                <span className="w-[0.38in] text-center">Issue</span>
                <span className="w-[1.05in]">Note</span>
              </div>
              {column.map((item) => (
                <div key={item} className="flex items-end gap-2 border-b border-neutral-200 py-[2pt]">
                  <span className="flex-1">{item}</span>
                  <span className="flex w-[0.3in] justify-center"><Box /></span>
                  <span className="flex w-[0.38in] justify-center"><Box /></span>
                  <span className="h-[10pt] w-[1.05in] border-b border-neutral-400" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Work and notes */}
      <section className="mt-[8pt] grid grid-cols-2 gap-x-6">
        <div>
          <SectionTitle>Work requested</SectionTitle>
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-[14pt] border-b border-neutral-400" />
          ))}
        </div>
        <div>
          <SectionTitle>Notes</SectionTitle>
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-[14pt] border-b border-neutral-400" />
          ))}
        </div>
      </section>

      {/* Signatures */}
      <section className="mt-auto pt-[8pt]">
        <p className="rounded-[4pt] border border-neutral-300 bg-neutral-50 px-[8pt] py-[6pt] text-[7.5pt] leading-relaxed text-neutral-800">
          I&apos;ve reviewed this sheet and agree it shows my vehicle&apos;s condition at drop-off. {BUSINESS_INFO.brandName} isn&apos;t
          responsible for damage already marked above or for items left in the vehicle.
        </p>
        <div className="mt-[6pt] grid grid-cols-[1.6fr_0.8fr_1.2fr] gap-x-4 gap-y-[6pt]">
          <Line label="Client signature (drop-off)" />
          <Line label="Date" />
          <Line label="Shop" />
          <Line label="Client signature (pick-up)" />
          <Line label="Date" />
          <div className="flex items-end gap-1.5 text-[7.5pt]">
            <Box /> <span>Picked up in good condition</span>
          </div>
        </div>
      </section>

      <footer className="mt-[6pt] flex justify-between border-t border-neutral-300 pt-[4pt] text-[6.5pt] text-neutral-500">
        <span>{BUSINESS_INFO.brandName} · karfxcustoms.com</span>
        <span>Customer copy available on request</span>
      </footer>
    </article>
  );
}
