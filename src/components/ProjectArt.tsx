/** Small schematic drawings for the featured project cards (no screenshots needed). */
export function ProjectArt({ id }: { id: string }) {
  switch (id) {
    case "returnguard":
      return (
        <svg viewBox="0 0 320 200" className="art" aria-hidden="true">
          <g className="art-edges">
            <path d="M70 52 L150 78 M70 148 L150 122 M150 78 L232 100 M150 122 L232 100 M70 52 L150 122 M70 148 L150 78" />
            <path d="M262 100 L296 54 M262 100 L300 100 M262 100 L296 146" />
          </g>
          {[
            { x: 46, y: 52, t: "Policy" },
            { x: 46, y: 148, t: "Reason" },
            { x: 150, y: 78, t: "Vision" },
            { x: 150, y: 122, t: "Risk" },
          ].map((n) => (
            <g key={n.t}>
              <rect x={n.x - 34} y={n.y - 15} width="68" height="30" rx="15" className="art-node" />
              <text x={n.x} y={n.y + 4} className="art-label" textAnchor="middle">
                {n.t}
              </text>
            </g>
          ))}
          <rect x="204" y="82" width="62" height="36" rx="18" className="art-node art-node-hot" />
          <text x="235" y="104" className="art-label art-label-hot" textAnchor="middle">
            Judge
          </text>
          <circle cx="300" cy="50" r="12" className="art-ok" />
          <text x="300" y="55" textAnchor="middle" className="art-mark">✓</text>
          <circle cx="304" cy="100" r="12" className="art-warn" />
          <text x="304" y="105" textAnchor="middle" className="art-mark">?</text>
          <circle cx="300" cy="150" r="12" className="art-bad" />
          <text x="300" y="155" textAnchor="middle" className="art-mark">✕</text>
        </svg>
      );
    case "memora":
      return (
        <svg viewBox="0 0 320 200" className="art" aria-hidden="true">
          <rect x="24" y="22" width="92" height="156" rx="16" className="art-phone" />
          <circle cx="70" cy="86" r="22" className="art-face" />
          <path d="M44 138 c6 -22 46 -22 52 0" className="art-face-line" />
          <path d="M50 64 h-6 v-8 M90 64 h6 v-8 M50 110 h-6 v8 M90 110 h6 v8" className="art-scan" />
          <path d="M126 100 h32" className="art-arrow" />
          <path d="M152 94 l8 6 l-8 6" className="art-arrow" />
          <text x="170" y="74" className="art-mono">[0.12, -0.48,</text>
          <text x="170" y="92" className="art-mono">  0.33, 0.07,</text>
          <text x="170" y="110" className="art-mono">  … 512 dims]</text>
          <rect x="168" y="128" width="132" height="44" rx="12" className="art-node art-node-hot" />
          <text x="182" y="147" className="art-label art-label-hot">That's Riya</text>
          <text x="182" y="163" className="art-small">your granddaughter</text>
        </svg>
      );
    case "resolv":
      return (
        <svg viewBox="0 0 320 200" className="art" aria-hidden="true">
          {[
            { w: 272, v: "9,969,589", t: "records" },
            { w: 204, v: "86.7", t: "candidates / business" },
            { w: 136, v: "5.58", t: "after re-ranker" },
            { w: 84, v: "3.38", t: "matches" },
          ].map((b, i) => (
            <g key={b.v}>
              <rect x={(320 - b.w) / 2} y={22 + i * 42} width={b.w} height="32" rx="8" className={i === 3 ? "art-node art-node-hot" : "art-node"} />
              <text x="160" y={43 + i * 42} textAnchor="middle" className={i === 3 ? "art-label art-label-hot" : "art-label"}>
                {b.v}
                <tspan className="art-small" dx="6">
                  {i < 3 ? b.t : ""}
                </tspan>
              </text>
            </g>
          ))}
        </svg>
      );
    case "stock-simulator":
      return (
        <svg viewBox="0 0 320 200" className="art" aria-hidden="true">
          <path d="M24 170 H196 M24 30 V170" className="art-axis" />
          {[
            { x: 44, o: 120, c: 100, h: 92, l: 130 },
            { x: 68, o: 100, c: 112, h: 96, l: 120 },
            { x: 92, o: 112, c: 84, h: 76, l: 118 },
            { x: 116, o: 84, c: 90, h: 72, l: 98 },
            { x: 140, o: 90, c: 62, h: 54, l: 96 },
            { x: 164, o: 62, c: 48, h: 40, l: 70 },
          ].map((k) => (
            <g key={k.x} className={k.c < k.o ? "art-up" : "art-down"}>
              <line x1={k.x} x2={k.x} y1={k.h} y2={k.l} />
              <rect x={k.x - 7} y={Math.min(k.o, k.c)} width="14" height={Math.max(4, Math.abs(k.o - k.c))} rx="2" />
            </g>
          ))}
          <rect x="204" y="30" width="112" height="140" rx="12" className="art-node" />
          <text x="216" y="54" className="art-small">LEADERBOARD</text>
          {["1 Asha  +18%", "2 Dev   +12%", "3 Kabir  +9%", "4 Mira   +4%"].map((t, i) => (
            <text key={t} x="216" y={80 + i * 22} className={i === 0 ? "art-mono art-mono-hot" : "art-mono"}>
              {t}
            </text>
          ))}
        </svg>
      );
    default:
      return null;
  }
}
