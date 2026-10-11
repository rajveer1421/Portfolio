import { useState, type CSSProperties } from "react";
import { useInView } from "../../hooks/useInView";

export interface GraphPoint {
  label: string;
  value: number;
  note?: string;
  approx?: boolean;
}

interface LineGraphProps {
  data: GraphPoint[];
  min: number;
  max: number;
  ticks: number[];
  format?: (v: number) => string;
  caption: string;
}

const W = 900;
const H = 360;
const PAD = { l: 64, r: 40, t: 46, b: 56 };

/** Monotone cubic interpolation (no overshoot between points). */
function smoothPath(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return "";
  const dx = (i: number) => pts[i + 1][0] - pts[i][0];
  const slope = (i: number) => (pts[i + 1][1] - pts[i][1]) / dx(i);
  const m: number[] = new Array(n);
  m[0] = slope(0);
  m[n - 1] = slope(n - 2);
  for (let i = 1; i < n - 1; i++) {
    const a = slope(i - 1);
    const b = slope(i);
    m[i] = a * b <= 0 ? 0 : (3 * (dx(i - 1) + dx(i))) / ((2 * dx(i) + dx(i - 1)) / a + (dx(i) + 2 * dx(i - 1)) / b);
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx(i) / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + m[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - m[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

/** A smooth animated line graph that draws itself when it scrolls into view. */
export function LineGraph({ data, min, max, ticks, format = (v) => v.toFixed(4), caption }: LineGraphProps) {
  const [ref, inView] = useInView<HTMLElement>({ once: true, threshold: 0.35 });
  const [hover, setHover] = useState<number | null>(null);
  const x = (i: number) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);
  const pts = data.map((d, i) => [x(i), y(d.value)] as [number, number]);
  const line = smoothPath(pts);
  const area = `${line} L${pts[pts.length - 1][0]},${H - PAD.b} L${pts[0][0]},${H - PAD.b} Z`;
  const shown = hover ?? data.length - 1;

  return (
    <figure ref={ref} className={`graph${inView ? " is-in" : ""}`}>
      <figcaption className="graph-caption">{caption}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg" role="img" aria-label={`${caption}: ${data.map((d) => `${d.label} ${format(d.value)}`).join(", ")}`}>
        <defs>
          <linearGradient id="graph-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9ff3b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9ff3b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="graph-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff5b1f" />
            <stop offset="100%" stopColor="#c9ff3b" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t} className="graph-tick">
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
            <text x={PAD.l - 12} y={y(t) + 4} textAnchor="end">
              {t.toFixed(2)}
            </text>
          </g>
        ))}
        <path d={area} className="graph-area" />
        <path d={line} className="graph-line" pathLength={1} />
        {hover !== null ? <line className="graph-cursor" x1={pts[hover][0]} x2={pts[hover][0]} y1={PAD.t - 10} y2={H - PAD.b} /> : null}
        {data.map((d, i) => (
          <g key={d.label} className={`graph-pt${i === shown ? " is-on" : ""}`} style={{ "--i": i } as CSSProperties}>
            <circle cx={pts[i][0]} cy={pts[i][1]} r={i === data.length - 1 ? 9 : 6} />
            <text x={pts[i][0]} y={H - PAD.b + 26} textAnchor="middle" className="graph-x">
              {d.label}
            </text>
            <text x={pts[i][0]} y={pts[i][1] - 18} textAnchor="middle" className="graph-val">
              {d.approx ? "≈" : ""}
              {format(d.value)}
            </text>
            <rect
              x={pts[i][0] - (W - PAD.l - PAD.r) / (data.length - 1) / 2}
              y={0}
              width={(W - PAD.l - PAD.r) / (data.length - 1)}
              height={H}
              fill="transparent"
              tabIndex={0}
              aria-label={`${d.label}: ${format(d.value)}${d.note ? `, ${d.note}` : ""}`}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            />
          </g>
        ))}
      </svg>
      <p className="graph-note" aria-live="polite">
        <strong>{data[shown].label}</strong> · {data[shown].approx ? "≈ " : ""}
        {format(data[shown].value)} — {data[shown].note}
      </p>
    </figure>
  );
}
