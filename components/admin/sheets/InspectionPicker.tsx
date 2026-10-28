"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import InspectionSheet from "./InspectionSheet";
import { VEHICLE_GROUPS, VEHICLES, vehicleById, type VehicleType } from "./vehicles";

// Switching vehicles happens in the browser, with no trip to the server, so the sheet changes on tap.
export default function InspectionPicker({ initial }: { initial: VehicleType }) {
  const [id, setId] = useState(initial);
  const vehicle = vehicleById(id)!;
  const group = VEHICLE_GROUPS.find((g) => g.id === vehicle.group)!;

  // Load the group's drawings ahead of time so a tapped vehicle's drawing is already there.
  useEffect(() => {
    for (const v of VEHICLES) if (v.group === group.id) new window.Image().src = `/images/sheets/vehicles/${v.id}.png`;
  }, [group.id]);

  function pick(next: VehicleType) {
    setId(next);
    window.history.replaceState(null, "", `?type=${next}`);
  }

  return (
    <>
      <nav aria-label={group.label} className="mb-6 space-y-2 print:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{group.label}</p>
        <div className="flex flex-wrap gap-2">
          {VEHICLES.filter((v) => v.group === group.id).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => pick(v.id)}
              aria-pressed={v.id === id}
              className={cn(
                "border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                v.id === id ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="overflow-x-auto pb-4 print:overflow-visible print:p-0">
        <InspectionSheet type={id} />
      </div>
    </>
  );
}
