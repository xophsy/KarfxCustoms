// Line drawings for marking damage on printed inspection sheets, one set per vehicle type.
// Plain strokes, no fills, so they print crisp in black and white.

export type VehicleType = "sedan" | "coupe" | "suv" | "truck" | "van";

export const VEHICLE_TYPES: { id: VehicleType; label: string }[] = [
  { id: "sedan", label: "Sedan" },
  { id: "coupe", label: "Coupe / sports car" },
  { id: "suv", label: "SUV / crossover" },
  { id: "truck", label: "Pickup truck" },
  { id: "van", label: "Van" },
];

const body = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const detail = { ...body, strokeWidth: 1 };
const fine = { ...body, strokeWidth: 0.7 };
const n = (v: number) => Math.round(v * 10) / 10;

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const rim = r * 0.62;
  const hub = r * 0.17;
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const a = ((i * 72 - 90) * Math.PI) / 180;
    return `M ${n(cx + Math.cos(a) * hub)} ${n(cy + Math.sin(a) * hub)} L ${n(cx + Math.cos(a) * rim)} ${n(cy + Math.sin(a) * rim)}`;
  }).join(" ");
  return (
    <g>
      <circle {...body} cx={cx} cy={cy} r={r} />
      <circle {...detail} cx={cx} cy={cy} r={rim} />
      <circle {...detail} cx={cx} cy={cy} r={hub} />
      <path {...fine} d={spokes} />
    </g>
  );
}

type Side = {
  outline: string;
  glass: string[];
  lines: string[]; // seams, character lines, lights, mirror
  handles: [number, number][];
  extras?: string[]; // thin details: fuel door, rails, vents
  wheels: [number, number, number][];
};

// Side profiles in a 400 × 150 box, front of the vehicle on the right.
const SIDES: Record<VehicleType, Side> = {
  sedan: {
    outline:
      "M 22 117 L 18 98 Q 17 86 30 82 L 94 75 Q 102 74 108 70 L 140 42 Q 147 35 158 34 L 236 34 Q 247 35 255 42 L 292 70 L 358 77 Q 378 80 382 92 L 384 108 Q 384 117 375 117 L 336 117 A 31 31 0 0 0 274 117 L 126 117 A 31 31 0 0 0 64 117 L 30 117 Z",
    glass: [
      "M 114 70 L 144 43 Q 150 39 158 39 L 194 39 L 194 70 Z",
      "M 200 39 L 235 39 Q 244 40 250 46 L 281 70 L 200 70 Z",
    ],
    lines: [
      "M 118 72 Q 122 82 125 92",
      "M 197 70 L 197 114",
      "M 283 72 Q 280 82 277 90",
      "M 280 66 L 293 59 Q 298 58 298 63 L 296 70 Z",
      "M 360 80 L 378 85 L 381 93 L 366 92 Z",
      "M 19 88 L 34 85 L 34 94 L 20 96 Z",
    ],
    handles: [[150, 80], [230, 80]],
    extras: ["M 26 88 Q 200 84 376 95", "M 127 109 L 273 109", "M 360 105 Q 372 106 384 104", "M 20 104 Q 30 105 42 105"],
    wheels: [[95, 120, 26], [305, 120, 26]],
  },
  coupe: {
    outline:
      "M 20 117 L 16 99 Q 16 88 28 85 L 72 80 L 76 75 L 84 78 Q 118 72 148 46 Q 158 37 172 36 L 220 36 Q 233 37 242 45 L 276 72 L 350 80 Q 375 84 381 96 L 384 108 Q 384 117 375 117 L 332 117 A 32 32 0 0 0 268 117 L 132 117 A 32 32 0 0 0 68 117 L 28 117 Z",
    glass: ["M 150 72 L 158 50 Q 164 42 174 42 L 220 42 Q 230 43 238 50 L 266 72 Z"],
    lines: [
      "M 176 72 L 176 113",
      "M 268 74 Q 265 84 262 92",
      "M 264 68 L 276 62 Q 281 61 281 66 L 279 72 Z",
      "M 354 82 L 377 89 L 380 97 L 362 95 Z",
      "M 17 92 L 32 89 L 32 96 L 18 99 Z",
      "M 140 92 L 162 89 L 162 99 L 143 101 Z",
    ],
    handles: [[192, 82]],
    extras: ["M 24 91 Q 200 88 378 99", "M 132 110 L 268 110", "M 340 116 L 384 113", "M 72 80 L 84 78"],
    wheels: [[100, 120, 27], [300, 120, 27]],
  },
  suv: {
    outline:
      "M 18 114 L 14 96 L 15 54 Q 17 34 34 32 L 250 30 Q 262 30 270 38 L 304 66 L 360 72 Q 380 76 384 90 L 386 104 Q 386 114 376 114 L 344 114 A 34 34 0 0 0 276 114 L 126 114 A 34 34 0 0 0 58 114 L 26 114 Z",
    glass: [
      "M 24 63 L 26 44 Q 28 39 36 39 L 90 39 L 90 63 Z",
      "M 98 39 L 176 39 L 176 63 L 98 63 Z",
      "M 184 39 L 252 38 Q 260 38 266 44 L 292 63 L 184 63 Z",
    ],
    lines: [
      "M 96 63 L 97 81",
      "M 180 63 L 180 110",
      "M 296 66 Q 292 80 288 90",
      "M 292 60 L 305 53 Q 310 52 310 57 L 308 64 Z",
      "M 362 75 L 380 81 L 383 88 L 368 88 Z",
      "M 15 50 L 26 50 L 26 74 L 15 74 Z",
    ],
    handles: [[126, 74], [214, 74]],
    extras: ["M 54 30 L 56 25 L 244 23 L 246 29", "M 18 84 Q 200 81 382 92", "M 126 104 L 276 104", "M 15 100 L 40 101"],
    wheels: [[92, 116, 29], [310, 116, 29]],
  },
  truck: {
    outline:
      "M 16 112 L 12 94 L 13 60 Q 14 56 18 56 L 168 56 L 170 33 Q 172 26 180 26 L 258 25 Q 269 25 277 33 L 304 58 L 366 62 Q 384 64 388 76 L 390 102 Q 390 112 380 112 L 357 112 A 35 35 0 0 0 287 112 L 133 112 A 35 35 0 0 0 63 112 L 22 112 Z",
    glass: [
      "M 178 33 L 232 33 L 232 57 L 176 57 Z",
      "M 240 33 L 258 32 Q 267 32 273 38 L 295 57 L 240 57 Z",
    ],
    lines: [
      "M 166 56 L 166 108",
      "M 172 57 L 172 108",
      "M 236 57 L 236 108",
      "M 298 60 Q 294 82 290 98",
      "M 294 52 L 308 45 Q 313 44 313 49 L 311 58 Z",
      "M 368 66 L 386 70 L 388 80 L 372 79 Z",
      "M 13 62 L 22 62 L 22 82 L 13 82 Z",
    ],
    handles: [[196, 68], [256, 68]],
    extras: ["M 14 64 L 164 64", "M 18 60 L 18 108", "M 14 80 Q 200 78 388 82", "M 174 108 L 287 108", "M 140 68 L 150 68 L 150 76 L 140 76 Z"],
    wheels: [[98, 116, 30], [322, 116, 30]],
  },
  van: {
    outline:
      "M 18 116 L 14 98 L 14 30 Q 14 16 28 16 L 284 16 Q 297 16 304 26 L 334 64 L 368 70 Q 384 74 386 88 L 388 106 Q 388 116 378 116 L 350 116 A 32 32 0 0 0 286 116 L 122 116 A 32 32 0 0 0 58 116 L 26 116 Z",
    glass: [
      "M 26 26 L 148 26 L 148 54 L 24 54 Z",
      "M 162 26 L 250 26 L 250 54 L 162 54 Z",
      "M 266 26 L 290 26 Q 298 26 303 32 L 326 60 L 266 60 Z",
    ],
    lines: [
      "M 156 22 L 156 112",
      "M 258 22 L 258 112",
      "M 332 64 Q 329 76 326 86",
      "M 324 56 L 338 49 Q 343 48 343 53 L 341 62 Z",
      "M 370 74 L 384 78 L 386 86 L 374 86 Z",
      "M 15 36 L 24 36 L 24 80 L 15 80 Z",
    ],
    handles: [[240, 72], [276, 72]],
    extras: ["M 30 64 L 156 64", "M 16 86 Q 200 89 384 92", "M 122 108 L 286 108"],
    wheels: [[90, 120, 27], [318, 120, 27]],
  },
};

export function SideDiagram({ type, facing }: { type: VehicleType; facing: "left" | "right" }) {
  const side = SIDES[type];
  return (
    <svg viewBox="0 0 400 150" className="h-auto w-full" role="img" aria-label={`Side of the vehicle, front facing ${facing}`}>
      <g transform={facing === "left" ? "translate(400 0) scale(-1 1)" : undefined}>
        <path {...body} d={side.outline} />
        {side.glass.map((d) => <path key={d} {...detail} d={d} />)}
        {side.lines.map((d) => <path key={d} {...detail} d={d} />)}
        {(side.extras ?? []).map((d) => <path key={d} {...fine} d={d} />)}
        {side.handles.map(([x, y]) => <rect key={x} {...detail} x={x} y={y} width="16" height="4" rx="2" />)}
        {side.wheels.map(([cx, cy, r]) => <Wheel key={cx} cx={cx} cy={cy} r={r} />)}
      </g>
    </svg>
  );
}

// Front and rear: proportions per type, drawn in a 200 × 140 box.
const ENDS: Record<VehicleType, { W: number; G: number; R: number; top: number; belt: number; bottom: number }> = {
  sedan: { W: 78, G: 62, R: 42, top: 22, belt: 62, bottom: 108 },
  coupe: { W: 82, G: 60, R: 38, top: 34, belt: 66, bottom: 106 },
  suv: { W: 82, G: 66, R: 52, top: 12, belt: 58, bottom: 112 },
  truck: { W: 86, G: 68, R: 56, top: 10, belt: 56, bottom: 112 },
  van: { W: 84, G: 72, R: 66, top: 4, belt: 56, bottom: 114 },
};

export function EndDiagram({ type, end }: { type: VehicleType; end: "front" | "rear" }) {
  const { W, G, R, top, belt, bottom } = ENDS[type];
  const L = 100 - W;
  const Rt = 100 + W;
  const greenhouse = `M ${100 - G} ${belt} L ${100 - R} ${top + 6} Q ${100 - R + 2} ${top} ${100 - R + 8} ${top} L ${100 + R - 8} ${top} Q ${100 + R - 2} ${top} ${100 + R} ${top + 6} L ${100 + G} ${belt}`;
  const glass = `M ${100 - G + 8} ${belt - 3} L ${100 - R + 6} ${top + 8} L ${100 + R - 6} ${top + 8} L ${100 + G - 8} ${belt - 3} Z`;
  const shell = `M ${L + 10} ${belt} L ${Rt - 10} ${belt} Q ${Rt} ${belt + 2} ${Rt} ${belt + 12} L ${Rt} ${bottom} L ${L} ${bottom} L ${L} ${belt + 12} Q ${L} ${belt + 2} ${L + 10} ${belt} Z`;
  const boxy = type === "truck" || type === "van";

  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full" role="img" aria-label={`${end === "front" ? "Front" : "Rear"} of the vehicle`}>
      <path {...body} d={greenhouse} />
      <path {...detail} d={glass} />
      <path {...body} d={shell} />
      {type === "suv" && <path {...fine} d={`M ${100 - R + 4} ${top - 4} L ${100 - R + 4} ${top} M ${100 + R - 4} ${top - 4} L ${100 + R - 4} ${top} M ${100 - R + 2} ${top - 4} L ${100 + R - 2} ${top - 4}`} />}
      <rect {...body} x={L - 12} y={belt - 6} width="12" height="9" rx="3" />
      <rect {...body} x={Rt} y={belt - 6} width="12" height="9" rx="3" />
      <path {...detail} d={`M ${L + 4} ${bottom - 14} L ${Rt - 4} ${bottom - 14}`} />
      <rect {...body} x={L + 6} y={bottom} width="24" height="18" rx="3" />
      <rect {...body} x={Rt - 30} y={bottom} width="24" height="18" rx="3" />
      {end === "front" ? (
        <>
          <rect {...detail} x={L + 8} y={belt + 9} width="34" height={boxy ? 14 : 11} rx="4" />
          <rect {...detail} x={Rt - 42} y={belt + 9} width="34" height={boxy ? 14 : 11} rx="4" />
          {type === "coupe" ? (
            <>
              <rect {...detail} x="78" y={belt + 12} width="44" height="8" rx="3" />
              <rect {...detail} x="66" y={bottom - 30} width="68" height="12" rx="4" />
            </>
          ) : (
            <rect {...detail} x={boxy ? 64 : 72} y={belt + 9} width={boxy ? 72 : 56} height={boxy ? 26 : 16} rx="3" />
          )}
          {boxy && <path {...fine} d={`M 66 ${belt + 17} L 134 ${belt + 17} M 66 ${belt + 26} L 134 ${belt + 26}`} />}
          <circle {...detail} cx={L + 20} cy={bottom - 22} r="3" />
          <circle {...detail} cx={Rt - 20} cy={bottom - 22} r="3" />
          <rect {...fine} x="86" y={bottom - 11} width="28" height="8" rx="1" />
        </>
      ) : (
        <>
          {boxy ? (
            <>
              <rect {...detail} x={L + 4} y={belt + 3} width="12" height="30" rx="2" />
              <rect {...detail} x={Rt - 16} y={belt + 3} width="12" height="30" rx="2" />
            </>
          ) : (
            <>
              <path {...detail} d={`M ${L + 6} ${belt + 9} L ${L + 42} ${belt + 9} L ${L + 42} ${belt + 21} L ${L + 6} ${belt + 17} Z`} />
              <path {...detail} d={`M ${Rt - 6} ${belt + 9} L ${Rt - 42} ${belt + 9} L ${Rt - 42} ${belt + 21} L ${Rt - 6} ${belt + 17} Z`} />
            </>
          )}
          {type === "truck" && (
            <>
              <rect {...detail} x={L + 22} y={belt + 4} width={2 * W - 44} height={bottom - belt - 20} rx="2" />
              <rect {...fine} x="92" y={belt + 8} width="16" height="5" rx="2" />
            </>
          )}
          {type === "van" && <path {...detail} d={`M 100 ${top + 10} L 100 ${bottom - 16}`} />}
          {type === "suv" && <path {...fine} d={`M ${100 - G + 6} ${belt + 2} L ${100 - G + 6} ${bottom - 16} M ${100 + G - 6} ${belt + 2} L ${100 + G - 6} ${bottom - 16}`} />}
          {(type === "sedan" || type === "coupe") && <path {...fine} d={`M ${L + 44} ${belt + 6} Q 100 ${belt + 9} ${Rt - 44} ${belt + 6}`} />}
          <rect {...fine} x="86" y={bottom - 30} width="28" height="9" rx="1" />
          {type === "coupe" ? (
            <>
              <circle {...detail} cx="62" cy={bottom - 6} r="3" />
              <circle {...detail} cx="138" cy={bottom - 6} r="3" />
            </>
          ) : (
            <circle {...detail} cx={Rt - 26} cy={bottom - 6} r="3" />
          )}
        </>
      )}
    </svg>
  );
}

// Top view, front at the top, drawn in a 160 × 360 box.
const TOPS: Record<VehicleType, { w: number; y0: number; y1: number; rx: number; hood: number; ws: number; roof: number; rear: number }> = {
  sedan: { w: 84, y0: 24, y1: 336, rx: 26, hood: 122, ws: 152, roof: 232, rear: 260 },
  coupe: { w: 88, y0: 30, y1: 326, rx: 28, hood: 138, ws: 164, roof: 214, rear: 256 },
  suv: { w: 92, y0: 20, y1: 340, rx: 20, hood: 112, ws: 138, roof: 290, rear: 306 },
  truck: { w: 96, y0: 12, y1: 348, rx: 14, hood: 100, ws: 122, roof: 188, rear: 196 },
  van: { w: 94, y0: 16, y1: 344, rx: 14, hood: 74, ws: 108, roof: 326, rear: 334 },
};

export function TopDiagram({ type }: { type: VehicleType }) {
  const { w, y0, y1, rx, hood, ws, roof, rear } = TOPS[type];
  const x0 = 80 - w / 2;
  const x1 = 80 + w / 2;
  const frontAxle = y0 + (type === "van" ? 48 : 58);
  const rearAxle = y1 - (type === "truck" ? 74 : 64);

  return (
    <svg viewBox="0 0 160 360" className="h-full w-auto" role="img" aria-label="Top of the vehicle, front at the top">
      <rect {...body} x={x0} y={y0} width={w} height={y1 - y0} rx={rx} />
      <path {...fine} d={`M ${x0 + 22} ${y0 + 16} L ${x0 + 24} ${hood - 6} M ${x1 - 22} ${y0 + 16} L ${x1 - 24} ${hood - 6}`} />
      <path {...detail} d={`M ${x0 + 6} ${hood} L ${x1 - 6} ${hood} L ${x1 - 12} ${ws} L ${x0 + 12} ${ws} Z`} />
      <rect {...detail} x={x0 + 12} y={ws} width={w - 24} height={roof - ws} rx="4" />
      {type === "suv" && <path {...fine} d={`M ${x0 + 8} ${ws + 8} L ${x0 + 8} ${roof - 8} M ${x1 - 8} ${ws + 8} L ${x1 - 8} ${roof - 8}`} />}
      {type === "van" && <path {...fine} d={[150, 190, 230, 270, 310].map((y) => `M ${x0 + 14} ${y} L ${x1 - 14} ${y}`).join(" ")} />}
      {type === "sedan" || type === "coupe" ? (
        <path {...detail} d={`M ${x0 + 12} ${roof} L ${x1 - 12} ${roof} L ${x1 - 6} ${rear} L ${x0 + 6} ${rear} Z`} />
      ) : (
        <path {...detail} d={`M ${x0 + 12} ${roof} L ${x1 - 12} ${roof} L ${x1 - 10} ${rear} L ${x0 + 10} ${rear} Z`} />
      )}
      {type === "truck" && (
        <>
          <rect {...detail} x={x0 + 8} y={rear + 8} width={w - 16} height={y1 - rear - 22} rx="2" />
          <path {...detail} d={`M ${x0 + 4} ${y1 - 10} L ${x1 - 4} ${y1 - 10}`} />
        </>
      )}
      {(type === "sedan" || type === "coupe") && <path {...fine} d={`M ${x0 + 16} ${y1 - 18} L ${x1 - 16} ${y1 - 18}`} />}
      <rect {...body} x={x0 - 11} y={hood + 4} width="12" height="9" rx="3" />
      <rect {...body} x={x1 - 1} y={hood + 4} width="12" height="9" rx="3" />
      {[frontAxle, rearAxle].map((y) => (
        <g key={y}>
          <rect {...body} x={x0 - 7} y={y - 17} width="8" height="34" rx="3" />
          <rect {...body} x={x1 - 1} y={y - 17} width="8" height="34" rx="3" />
        </g>
      ))}
    </svg>
  );
}
