import Image from "next/image";
import { BUSINESS_INFO } from "@/lib/business";
import { vehicleById, type VehicleKind, type VehicleType } from "./vehicles";

type Field = [label: string, span: number];

const COMMON_FIELDS: Field[] = [
  ["Date", 4],
  ["Job #", 4],
  ["Inspected by", 4],
  ["Customer", 7],
  ["Phone", 5],
];

// Each kind of vehicle gets the ID fields and check items a worker can actually fill in for it.
const KINDS: Record<VehicleKind, { fields: Field[]; checks: string[] }> = {
  car: {
    fields: [["Year / make / model", 7], ["Color", 2], ["Miles", 3], ["VIN", 8], ["Plate", 4]],
    checks: ["Glass", "Lights", "Wheels and tires", "Paint and clear coat", "Film, wrap or coating", "Interior"],
  },
  motorcycle: {
    fields: [["Year / make / model", 7], ["Color", 2], ["Miles", 3], ["VIN", 8], ["Plate", 4]],
    checks: ["Paint and fairings", "Lights", "Wheels and tires", "Mirrors", "Film, wrap or decals", "Seat"],
  },
  offroad: {
    fields: [["Year / make / model", 7], ["Color", 2], ["Hours", 3], ["VIN or serial #", 8], ["Registration", 4]],
    checks: ["Body panels", "Lights", "Wheels, tires or tracks", "Windshield", "Film, wrap or decals", "Seats"],
  },
  boat: {
    fields: [["Year / make / model", 7], ["Color", 2], ["Engine hours", 3], ["Hull ID (HIN)", 8], ["Registration", 4]],
    checks: ["Hull", "Gelcoat and paint", "Windshield", "Lights", "Film, wrap or decals", "Upholstery"],
  },
  trailer: {
    fields: [["Year / make / model", 9], ["Color", 3], ["VIN", 8], ["Plate", 4]],
    checks: ["Body panels", "Lights", "Wheels and tires", "Doors and seals", "Film, wrap or decals", "Hitch and jack"],
  },
  bicycle: {
    fields: [["Make / model", 7], ["Color", 2], ["Size", 3], ["Serial #", 12]],
    checks: ["Frame and paint", "Wheels and tires", "Brakes", "Handlebars and grips", "Film, wrap or decals", "Seat"],
  },
};

const DAMAGE_KEY = [
  ["S", "Scratch"],
  ["D", "Dent"],
  ["C", "Chip"],
  ["CR", "Crack"],
  ["R", "Rust"],
  ["P", "Paint failure"],
  ["F", "Existing film or wrap"],
];

const gold = { printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } as const;

function Line({ name, span }: { name: string; span?: number }) {
  return (
    // Inline grid span: Tailwind can't see class names built at runtime like col-span-${span}.
    <div className="flex items-end gap-2" style={span ? { gridColumn: `span ${span} / span ${span}` } : undefined}>
      <span className="shrink-0 text-[7.5pt] font-semibold uppercase tracking-[0.08em] text-neutral-600">{name}</span>
      <span className="h-[19pt] flex-1 border-b border-neutral-400" />
    </div>
  );
}

function Box() {
  return <span className="inline-block h-[11pt] w-[11pt] shrink-0 border-[1.2pt] border-neutral-800" />;
}

// Numbered steps so a worker can go top to bottom without thinking about what comes next.
function Step({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <h2 className="mb-[6pt] flex items-baseline gap-2">
      <span
        className="flex h-[14pt] w-[14pt] shrink-0 items-center justify-center self-center rounded-full bg-[#D4AF37] text-[8pt] font-bold text-black"
        style={gold}
      >
        {n}
      </span>
      <span className="text-[9pt] font-semibold uppercase tracking-[0.14em] text-black">{title}</span>
      {hint && <span className="text-[8pt] text-neutral-500">{hint}</span>}
    </h2>
  );
}

export default function InspectionSheet({ type }: { type: VehicleType }) {
  const vehicle = vehicleById(type)!;
  const { fields, checks } = KINDS[vehicle.kind];

  return (
    // justify-between spreads any spare room evenly, so every gap between sections is the same size.
    <article
      className="sheet mx-auto flex flex-col justify-between gap-[6pt] bg-white font-body text-[9pt] leading-snug text-black shadow-2xl print:shadow-none"
      style={{ width: "8.5in", minHeight: "11in", padding: "0.35in 0.45in" }}
    >
      <header className="grid grid-cols-[1.35in_1fr_2.1in] items-center gap-4 border-b-[1.5pt] border-[#D4AF37] pb-[8pt]">
        <Image src="/images/branding/logo-badge.png" alt="KAR FX Customs" width={130} height={131} priority className="h-[1.3in] w-auto" />
        <div className="text-center">
          <h1 className="font-display text-[24pt] font-semibold leading-tight">Vehicle Inspection</h1>
          <p className="mt-[2pt] text-[9pt] font-semibold uppercase tracking-[0.28em] text-neutral-500">{vehicle.label}</p>
        </div>
        <div className="flex flex-col items-center text-center">
          {/* RestorFX's official wordmark (vector, from restorfx.com); plain img keeps the SVG sharp in print */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/branding/restorfx-logo.svg" alt="RestorFX" width={140} height={13} className="h-auto w-full" />
          <p className="mt-[6pt] text-[7.5pt] uppercase tracking-[0.3em] text-neutral-500">Raleigh</p>
        </div>
      </header>

      <section>
        <Step n={1} title="Customer and vehicle" />
        <div className="grid grid-cols-12 gap-x-4 gap-y-[2pt]">
          {[...COMMON_FIELDS, ...fields].map(([name, span]) => (
            <Line key={name} name={name} span={span} />
          ))}
        </div>
      </section>

      <section>
        <Step n={2} title="Mark any damage" hint="Circle each spot and write its letter." />
        <div className="flex h-[3.3in] items-center justify-center rounded-[4pt] border border-neutral-300 p-[8pt]">
          {/* Full-resolution line art (both sides, front, rear, top, labels included); contain keeps every drawing whole */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/sheets/vehicles/${vehicle.id}.png`}
            alt={`${vehicle.label} outline: both sides, front, rear and top`}
            className="block max-h-full max-w-full object-contain"
          />
        </div>
        <p className="mt-[6pt] flex flex-wrap justify-center gap-x-[14pt] gap-y-[3pt] text-[8.5pt] text-neutral-700">
          {DAMAGE_KEY.map(([code, name]) => (
            <span key={code} className="flex items-center gap-[4pt]">
              <b className="flex h-[13pt] min-w-[13pt] items-center justify-center rounded-[2pt] border border-neutral-800 px-[2pt] text-[8pt] text-black">
                {code}
              </b>
              {name}
            </span>
          ))}
        </p>
      </section>

      <section>
        <Step n={3} title="Quick check" hint="Tick one box for each." />
        <div className="grid grid-cols-3 gap-x-6 gap-y-[7pt]">
          {checks.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[7.5pt] text-neutral-600"><Box /> OK</span>
              <span className="flex items-center gap-1 text-[7.5pt] text-neutral-600"><Box /> Issue</span>
              <span className="ml-1">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Step n={4} title="Work requested and notes" />
        {[0, 1, 2].map((i) => (
          <span key={i} className="block h-[19pt] border-b border-neutral-400" />
        ))}
      </section>

      <section>
        <Step n={5} title="Client signatures" />
        <p className="text-[8pt] leading-relaxed text-neutral-700">
          I agree this sheet shows my vehicle&apos;s condition at drop-off. {BUSINESS_INFO.brandName} isn&apos;t responsible for damage
          marked above or for items left in the vehicle.
        </p>
        <div className="mt-[4pt] grid grid-cols-[2fr_1fr] gap-x-6 gap-y-[4pt]">
          <Line name="Signature at drop-off" />
          <Line name="Date" />
          <Line name="Signature at pick-up" />
          <Line name="Date" />
        </div>
      </section>

      <footer className="flex justify-between border-t border-neutral-300 pt-[4pt] text-[7pt] text-neutral-500">
        <span>
          {BUSINESS_INFO.brandName} · {BUSINESS_INFO.fullAddress}
        </span>
        <span>{BUSINESS_INFO.phoneDisplay} · karfxcustoms.com</span>
      </footer>
    </article>
  );
}
