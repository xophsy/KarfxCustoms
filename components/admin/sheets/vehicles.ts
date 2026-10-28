// Every vehicle with an inspection sheet. The drawing for each lives at
// public/images/sheets/vehicles/<id>.png (cut from the KAR FX wrap-diagram sheets).
// "main" vehicles lead the Sheets page; the rest sit in its Other vehicles folder.

export const VEHICLE_GROUPS = [
  { id: "main", label: "Cars, SUVs, trucks and vans" },
  { id: "powersports", label: "Bikes and powersports" },
  { id: "marine", label: "Boats, RVs, trailers and commercial" },
] as const;

export type VehicleGroup = (typeof VEHICLE_GROUPS)[number]["id"];

// Which form fields and quick-check items the sheet shows (see InspectionSheet).
export type VehicleKind = "car" | "motorcycle" | "offroad" | "boat" | "trailer" | "bicycle";

export const VEHICLES = [
  // The first five ids match the original sheets so old links keep working.
  { id: "sedan", label: "Sedan", group: "main", kind: "car" },
  { id: "coupe", label: "Coupe", group: "main", kind: "car" },
  { id: "hatchback", label: "Hatchback", group: "main", kind: "car" },
  { id: "wagon", label: "Wagon", group: "main", kind: "car" },
  { id: "convertible", label: "Convertible", group: "main", kind: "car" },
  { id: "suv", label: "SUV / crossover", group: "main", kind: "car" },
  { id: "truck", label: "Pickup truck", group: "main", kind: "car" },
  { id: "minivan", label: "Minivan", group: "main", kind: "car" },
  { id: "van", label: "Cargo van", group: "main", kind: "car" },
  { id: "sport-motorcycle", label: "Sport motorcycle", group: "powersports", kind: "motorcycle" },
  { id: "cruiser-motorcycle", label: "Cruiser motorcycle", group: "powersports", kind: "motorcycle" },
  { id: "scooter", label: "Scooter", group: "powersports", kind: "motorcycle" },
  { id: "bicycle", label: "Bicycle", group: "powersports", kind: "bicycle" },
  { id: "atv", label: "ATV", group: "powersports", kind: "offroad" },
  { id: "utv", label: "UTV / side-by-side", group: "powersports", kind: "offroad" },
  { id: "golf-cart", label: "Golf cart", group: "powersports", kind: "offroad" },
  { id: "jet-ski", label: "Jet ski", group: "powersports", kind: "boat" },
  { id: "snowmobile", label: "Snowmobile", group: "powersports", kind: "offroad" },
  { id: "bowrider", label: "Bowrider boat", group: "marine", kind: "boat" },
  { id: "center-console", label: "Center console boat", group: "marine", kind: "boat" },
  { id: "pontoon", label: "Pontoon boat", group: "marine", kind: "boat" },
  { id: "cabin-cruiser", label: "Cabin cruiser", group: "marine", kind: "boat" },
  { id: "motorhome", label: "Motorhome / RV", group: "marine", kind: "car" },
  { id: "travel-trailer", label: "Travel trailer", group: "marine", kind: "trailer" },
  { id: "enclosed-trailer", label: "Enclosed trailer", group: "marine", kind: "trailer" },
  { id: "box-truck", label: "Box truck", group: "marine", kind: "car" },
  { id: "food-truck", label: "Food truck", group: "marine", kind: "car" },
] as const satisfies readonly { id: string; label: string; group: VehicleGroup; kind: VehicleKind }[];

export type Vehicle = (typeof VEHICLES)[number];
export type VehicleType = Vehicle["id"];

export const vehicleById = (id: string | undefined): Vehicle | undefined => VEHICLES.find((v) => v.id === id);
