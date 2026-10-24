// ─────────────────────────────────────────────────────────────────────────────
// Portfolio photos, grouped by type of work.
// To add a photo: drop it in /public/images/gallery/all/ and add a
// [fileName, altText] line to the matching group below.
// ─────────────────────────────────────────────────────────────────────────────

export const PORTFOLIO_CATEGORIES = [
  { id: "wraps", label: "Wraps" },
  { id: "protection", label: "Protection" },
  { id: "wheels-lighting", label: "Wheels & Lighting" },
  { id: "detailing", label: "Detailing" },
  { id: "marine", label: "Boats & Bikes" },
  { id: "shop", label: "The Shop" },
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number]["id"];

export type PortfolioImage = {
  src: string;
  alt: string;
  category: PortfolioCategory;
};

const group = (
  category: PortfolioCategory,
  items: [file: string, alt: string][]
): PortfolioImage[] =>
  items.map(([file, alt]) => ({
    src: `/images/gallery/all/${file}`,
    alt,
    category,
  }));

const WRAPS = group("wraps", [
  ["2583cccd.jpg", "Toyota Supra in a red-to-black fade wrap on a downtown parking deck"],
  ["wraps.jpg", "Fade-wrapped Toyota Supra in front of a glass office tower"],
  ["3b75f561-3e0f-47c3-bb5d-9343c7fb3ec3.jpg", "Front three-quarter view of the fade-wrapped Toyota Supra"],
  ["40536b16-a5fd-493a-aa3b-dea988483661.jpg", "Side profile of the fade-wrapped Toyota Supra"],
  ["c0785691-e940-4063-a6b9-a714296ef891.jpg", "Red-to-gray fade across the Toyota Supra's rear quarter"],
  ["ca6dcbff-dda8-4446-9310-1e378323484c.jpg", "Rear wing and satin black tail of the wrapped Toyota Supra"],
  ["69fcf79e-6040-4a44-b902-c92a3e70d4cc.jpg", "Satin red front end of the wrapped Toyota Supra"],
  ["34e06cec-ec40-4d33-8e4a-35c39bcd74be.jpg", "Wrapped Toyota Supra with both doors open on the parking deck"],
  ["3a5c1f7f-aefb-4df2-b47d-d44301b61863.jpg", "Fade-wrapped Toyota Supra on a rooftop parking deck"],
  ["5e6327f4-4103-4ace-9291-9883dedf6271.jpg", "Fade-wrapped Toyota Supra with the hood and doors open"],
  ["646d2409-a678-42c3-b346-d226296f3222.jpg", "Fade-wrapped Toyota Supra under the parking deck"],
  ["6a7e9876-6044-4bfd-8697-915c9b682383.jpg", "Fade-wrapped Toyota Supra on the parking deck at midday"],
  ["cc6d65e4-cc91-4212-a4c6-8e6bd308312a.jpg", "Wrapped Toyota Supra beneath a glass office building"],
  ["hero.jpg", "Fade-wrapped Toyota Supra inside the KAR FX Customs shop"],
  ["shop-shot-1.jpg", "Satin red Toyota Supra inside the KAR FX Customs shop"],
  ["d3352a85-f1af-4747-8a80-79b664939a0e.jpg", "Roll cage and nitrous setup in the wrapped Toyota Supra"],
  ["IMG_1179.jpg", "Satin gray wrap film going onto a red Toyota Supra"],
  ["IMG_9471.jpg", "Red Pontiac Trans Am with black hood graphics"],
  ["IMG_9470.jpg", "Red Pontiac Trans Am in the shop"],
  ["IMG_9472.jpg", "Red Pontiac Trans Am beside a Mazda MX-5"],
  ["IMG_9468.jpg", "Mazda MX-5 and red Pontiac Trans Am in the shop"],
  ["IMG_5019.jpg", "Purple color-change wrap on a Toyota Camry"],
  ["IMG_0550.jpg", "Purple wrapped Toyota Camry outside the shop"],
  ["IMG_4908.jpg", "Purple wrap going onto a white Toyota Camry's hood"],
  ["IMG_4916.jpg", "Purple wrap being installed along a Toyota Camry's side"],
  ["IMG_5010.jpg", "Purple wrapped sedan inside the KAR FX Customs shop"],
  ["IMG_8427.jpg", "Purple color-change wrap on a hatchback with the doors open"],
  ["IMG_6124.jpg", "White Dodge Charger with black racing stripes"],
  ["IMG_2806.jpg", "Orange Ford Mustang with black rear stripes and louvers"],
  ["IMG_2797.jpg", "Black stripes being laid on an orange Ford Mustang"],
  ["IMG_9575.jpg", "Black Mercedes G-Wagon in the shop"],
  ["IMG_9571.jpg", "Front of a black Mercedes G-Wagon"],
  ["IMG_9513.jpg", "Wrap film being applied to a Mercedes G-Wagon door"],
  ["IMG_3163.jpg", "White Ford Super Duty with blacked-out roof and trim"],
  ["IMG_3140.jpg", "White Ford F-450 dually inside the shop"],
  ["IMG_3162.jpg", "Ford Super Duty with blacked-out accents"],
  ["IMG_3152.jpg", "KAR FX Customs decal on a truck bed rail"],
  ["IMG_3596.jpg", "Gray BMW X5 M front end"],
  ["IMG_3601.jpg", "Rear view of the gray BMW X5 M"],
  ["IMG_3598.jpg", "BMW X5 M being worked on under the shop's hex lights"],
  ["IMG_0067.jpg", "BMW kidney grille close-up"],
  ["IMG_6230.jpg", "Commercial wrap on a branded van downtown"],
  ["IMG_5866.jpg", "Satin black wrap on a vehicle door"],
  ["IMG_3932.jpg", "Close-up of satin gray wrap film"],
]);

const PROTECTION = group("protection", [
  ["maserati-ppf.jpg", "White Maserati MC20 with satin paint protection film"],
  ["detail-shot-1.jpg", "Front of the satin white Maserati MC20 outside the shop"],
  ["IMG_1443.jpg", "Front view of the satin white Maserati MC20"],
  ["IMG_1439.jpg", "Rear three-quarter view of the Maserati MC20 in the shop"],
  ["detail-shot-2.jpg", "Satin white Maserati MC20 parked outside KAR FX Customs"],
  ["IMG_1379.jpg", "Satin white Maserati MC20 outside the shop"],
  ["IMG_1440.jpg", "Maserati MC20 under the shop's hex lights"],
  ["IMG_1442.jpg", "Satin finish across the Maserati MC20's hood"],
  ["IMG_1444.jpg", "Side view of the Maserati MC20 in the shop"],
  ["IMG_1445.jpg", "Maserati MC20 front three-quarter in the shop"],
  ["0898a7e4-0d03-4d39-a746-8d58b7f6fa84.jpg", "McLaren Senna outside KAR FX Customs"],
  ["7d450f5e-2db3-472f-8700-85de9705e267.jpg", "McLaren Senna with the doors up"],
  ["2df841e0-8591-402f-8eb1-9c3db4ba1fe5.jpg", "Gray McLaren Senna in the shop lot"],
  ["IMG_5706.jpg", "McLaren Senna inside the shop"],
  ["IMG_5814.jpg", "Rear wing of the McLaren Senna"],
  ["IMG_5710.jpg", "McLaren Senna cockpit"],
  ["IMG_6719.jpg", "Glossy blue BMW XM front three-quarter"],
  ["IMG_6716.jpg", "Blue BMW XM under the shop's hex lights"],
  ["IMG_6726.jpg", "Hex lights reflected in the blue BMW XM's hood"],
  ["IMG_6709.jpg", "Blue BMW XM with the doors open in the shop"],
  ["IMG_6711.jpg", "Blue BMW XM side view in the shop"],
  ["IMG_6728.jpg", "Blue BMW XM outside the shop"],
  ["IMG_2252.jpg", "Yellow Porsche 718 Cayman GT4 with the shop dog"],
  ["IMG_2263.jpg", "Yellow Porsche 718 Cayman GT4 in the shop"],
  ["bmw-ceramic.jpg", "Black BMW with a fresh ceramic coating under the hex lights"],
  ["IMG_7772.jpg", "Hex lights reflected in a gray BMW X3 M hood"],
  ["IMG_7774.jpg", "Gray BMW X3 M in the shop"],
  ["IMG_8030.jpg", "White Lucid Air being prepped for film"],
  ["IMG_8032.jpg", "Front of a white Lucid Air with film edges taped"],
  ["IMG_8026.jpg", "Lucid Air trunk lid with film edges taped"],
  ["IMG_9155.jpg", "Red Corvette with the doors open during a film install"],
  ["IMG_9156.jpg", "Rear of the red Corvette with edges taped"],
  ["IMG_9161.jpg", "Red Corvette and its hood in the shop"],
  ["IMG_7103.jpg", "Red Toyota Supra in the shop"],
  ["IMG_7102.jpg", "Red Toyota Supra front end being prepped"],
  ["IMG_2634.jpg", "Glossy red mirror cap reflecting the shop lights"],
  ["IMG_9714.jpg", "Blue Ford Mustang hood being prepped"],
  ["IMG_9765.jpg", "Green Ford Ranger Raptor in the shop"],
  ["IMG_9766.jpg", "Rear of the green Ford Ranger Raptor"],
  ["IMG_9073.jpg", "Black Corvette C7 in the shop"],
  ["IMG_9072.jpg", "Black Corvette C7 outside the shop"],
  ["IMG_7665.jpg", "White Corvette convertible in the shop"],
  ["IMG_9463.jpg", "Gray Mazda MX-5 RF in the shop"],
  ["IMG_9462.jpg", "Gray Mazda MX-5 RF rear view"],
  ["tint.jpg", "White Ford Super Duty with window tint"],
  ["chrome-delete.jpg", "Subaru headlight masked off for headlight work"],
  ["IMG_7069.jpg", "Finished Subaru headlight"],
]);

const WHEELS_LIGHTING = group("wheels-lighting", [
  ["photo-mar-20-2025.jpg", "Starlight headliner glowing in a vehicle cabin"],
  ["ambient-lighting.jpg", "Ambient door lighting in a Mercedes-Maybach"],
  ["IMG_20190212_155553210.jpg", "Glowing reflective Brembo brake caliper"],
  ["IMG_5960.jpg", "White Rolls-Royce Ghost with custom wheels"],
  ["IMG_5966.jpg", "Black and polished wheel on a white Rolls-Royce Ghost"],
  ["IMG_5963.jpg", "Rear three-quarter of the white Rolls-Royce Ghost"],
  ["IMG_8423.jpg", "Polished wheel on a shop stand"],
  ["IMG_3772.jpg", "Gloss black painted wheel with the tire masked"],
  ["IMG_3767.jpg", "Silver Lexus wheel on a stand"],
  ["b3de50a9-2058-4e57-b44c-b38be9a220ff.jpg", "Forged drag wheel on the wrapped Toyota Supra"],
  ["IMG_4850.jpg", "Starlight headliner fibers during install"],
]);

const DETAILING = group("detailing", [
  ["IMG_1531.jpg", "Black Chevrolet Chevelle SS front view"],
  ["IMG_1532.jpg", "Chevrolet Chevelle SS side profile"],
  ["IMG_1529.jpg", "Chevrolet Chevelle SS front end"],
  ["IMG_1530.jpg", "Chevelle SS grille and headlights"],
  ["IMG_1534.jpg", "Chevelle SS outside the shop"],
  ["IMG_1525.jpg", "Chevelle SS 396 badge and paint close-up"],
  ["IMG_2321.jpg", "Restored green Chevrolet K5 Blazer on display"],
  ["IMG_6831.jpg", "Brown leather interior of a classic Chevrolet truck"],
  ["IMG_1460.jpg", "Engine bay of a green classic Chevrolet"],
  ["IMG_0177.jpg", "Red Chevrolet C10 pickup side view"],
  ["IMG_0175.jpg", "Red classic Chevrolet C10 in the shop"],
  ["IMG_0457.jpg", "Glossy red Acura TL hood"],
  ["IMG_0461.jpg", "Red Acura TL in the shop"],
  ["IMG_5779.jpg", "Red Porsche Boxster outside the shop"],
  ["IMG_5783.jpg", "Glossy red paint on a Porsche Boxster"],
  ["IMG_6843.jpg", "Red Ford Thunderbird outside KAR FX Customs"],
  ["IMG_6839.jpg", "Red Ford Thunderbird in the shop"],
  ["IMG_7925.jpg", "Red Chevrolet SSR outside the shop"],
  ["IMG_9881.jpg", "Front of an orange Corvette C6"],
  ["IMG_9879.jpg", "Orange Corvette C6 with the hood up"],
  ["IMG_9883.jpg", "Orange Corvette C6 engine bay"],
  ["IMG_1319.jpg", "Built engine bay in a red Toyota Supra"],
  ["IMG_1320.jpg", "Detailed engine bay of a Toyota Supra"],
  ["IMG_1321.jpg", "Toyota Supra engine bay close-up"],
  ["IMG_8159.jpg", "Detailed Mercedes-AMG engine bay"],
  ["IMG_8228.jpg", "Black Ford Ranger with polished fender trim"],
  ["IMG_8229.jpg", "Black Ford Ranger side view in the shop"],
  ["IMG_8246.jpg", "Kia Niro wheel arch detail"],
  ["IMG_2162.jpg", "Black Mazda Miata convertible in the shop"],
]);

const MARINE = group("marine", [
  ["IMG_6065.jpg", "Yamaha 212X boat with green and white graphics"],
  ["IMG_5942.jpg", "Yamaha 212X boat inside the shop"],
  ["IMG_6070.jpg", "Green and white boat seating"],
  ["IMG_6071.jpg", "Boat interior seating detail"],
  ["IMG_6738.jpg", "Black and yellow bass boat"],
  ["IMG_6744.jpg", "Bass boat deck and graphics"],
  ["IMG_4044.jpg", "Black jet ski on a trailer in the shop"],
  ["IMG_0190.jpg", "Purple wrapped jet ski panel"],
  ["IMG_8378.jpg", "Wrapped motorcycle fairings"],
  ["IMG_8383.jpg", "Motorcycle tank during a wrap"],
  ["IMG_8388.jpg", "Motorcycle tank being wrapped"],
]);

const SHOP = group("shop", [
  ["IMG_9397.jpg", "Inside the KAR FX Customs shop in Raleigh"],
  ["IMG_9396.jpg", "Front entrance of the KAR FX Customs shop"],
  ["IMG_0929.jpg", "Corvette and Mercedes-AMG outside the shop"],
]);

export const PORTFOLIO_BY_CATEGORY: Record<PortfolioCategory, PortfolioImage[]> = {
  wraps: WRAPS,
  protection: PROTECTION,
  "wheels-lighting": WHEELS_LIGHTING,
  detailing: DETAILING,
  marine: MARINE,
  shop: SHOP,
};

// "All" deals one photo from each group in turn, so the mix shows range
// instead of 40 wraps in a row.
const groups = Object.values(PORTFOLIO_BY_CATEGORY);
export const ALL_PORTFOLIO_IMAGES: PortfolioImage[] = Array.from(
  { length: Math.max(...groups.map((g) => g.length)) },
  (_, i) => groups.map((g) => g[i]).filter(Boolean)
).flat();
