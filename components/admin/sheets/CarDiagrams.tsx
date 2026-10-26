// Line drawings of a sedan for marking damage on printed sheets. Plain strokes, no fills,
// so they print crisp in black and white.

const body = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const detail = { ...body, strokeWidth: 1 };

// Side profile, front of the car on the right.
function SideView() {
  return (
    <>
      <path
        {...body}
        d="M 18 90 L 14 72 Q 14 60 26 58 L 80 54 L 112 27 Q 116 24 122 24 L 186 24 Q 192 24 196 28 L 230 52 L 288 58 Q 302 60 304 70 L 305 84 Q 305 90 299 90 L 268 90 A 27 27 0 0 0 214 90 L 103 90 A 27 27 0 0 0 49 90 Z"
      />
      <path {...detail} d="M 96 52 L 117 31 L 152 31 L 152 52 Z" />
      <path {...detail} d="M 158 31 L 188 31 L 219 52 L 158 52 Z" />
      <path {...detail} d="M 155 31 L 155 88 M 100 54 L 100 88 M 214 54 L 214 66" />
      <path {...detail} d="M 222 50 L 232 44 L 236 50 Z" />
      <path {...detail} d="M 286 62 L 300 65 L 300 71 L 288 70 Z" />
      <path {...detail} d="M 16 63 L 26 61 L 26 69 L 16 70 Z" />
      <circle {...body} cx="241" cy="90" r="21" />
      <circle {...detail} cx="241" cy="90" r="9" />
      <circle {...body} cx="76" cy="90" r="21" />
      <circle {...detail} cx="76" cy="90" r="9" />
    </>
  );
}

export function SideDiagram({ facing }: { facing: "left" | "right" }) {
  return (
    <svg viewBox="0 0 320 116" className="h-auto w-full" role="img" aria-label={`Side of a car, front facing ${facing}`}>
      <g transform={facing === "left" ? "translate(320 0) scale(-1 1)" : undefined}>
        <SideView />
      </g>
    </svg>
  );
}

export function TopDiagram() {
  return (
    <svg viewBox="0 0 120 280" className="h-full w-auto" role="img" aria-label="Top of a car, front at the top">
      <rect {...body} x="20" y="10" width="80" height="260" rx="28" />
      <path {...detail} d="M 44 24 L 44 86 M 76 24 L 76 86" />
      <path {...detail} d="M 27 94 L 93 94 L 87 122 L 33 122 Z" />
      <rect {...detail} x="33" y="122" width="54" height="68" rx="4" />
      <path {...detail} d="M 33 190 L 87 190 L 91 216 L 29 216 Z" />
      <path {...detail} d="M 40 224 L 80 224 M 44 258 L 76 258" />
      <rect {...body} x="9" y="100" width="12" height="9" rx="3" />
      <rect {...body} x="99" y="100" width="12" height="9" rx="3" />
      <rect {...body} x="13" y="44" width="8" height="34" rx="3" />
      <rect {...body} x="99" y="44" width="8" height="34" rx="3" />
      <rect {...body} x="13" y="200" width="8" height="34" rx="3" />
      <rect {...body} x="99" y="200" width="8" height="34" rx="3" />
    </svg>
  );
}

export function EndDiagram({ end }: { end: "front" | "rear" }) {
  return (
    <svg viewBox="0 0 160 116" className="h-auto w-full" role="img" aria-label={`${end === "front" ? "Front" : "Rear"} of a car`}>
      <path {...body} d="M 40 50 L 54 20 Q 56 16 61 16 L 99 16 Q 104 16 106 20 L 120 50" />
      <path {...detail} d="M 46 46 L 58 22 L 102 22 L 114 46 Z" />
      <path {...body} d="M 20 50 L 140 50 Q 150 52 150 62 L 150 92 L 10 92 L 10 62 Q 10 52 20 50 Z" />
      <rect {...body} x="0" y="44" width="12" height="9" rx="3" />
      <rect {...body} x="148" y="44" width="12" height="9" rx="3" />
      <path {...detail} d="M 14 82 L 146 82" />
      {end === "front" ? (
        <>
          <rect {...detail} x="18" y="58" width="30" height="10" rx="4" />
          <rect {...detail} x="112" y="58" width="30" height="10" rx="4" />
          <rect {...detail} x="58" y="58" width="44" height="16" rx="4" />
        </>
      ) : (
        <>
          <path {...detail} d="M 16 58 L 46 58 L 46 70 L 16 66 Z" />
          <path {...detail} d="M 144 58 L 114 58 L 114 70 L 144 66 Z" />
          <rect {...detail} x="62" y="66" width="36" height="12" rx="2" />
        </>
      )}
      <rect {...body} x="18" y="92" width="20" height="16" rx="3" />
      <rect {...body} x="122" y="92" width="20" height="16" rx="3" />
    </svg>
  );
}
