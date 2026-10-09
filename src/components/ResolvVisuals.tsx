import type { CSSProperties } from "react";
import { resolvAblation, resolvFunnel, resolvLeaderboard } from "../data/content";

interface DotRow {
  label: string;
  value: number;
  note?: string;
  approx?: boolean;
}

/** Dot plot on a zoomed axis (position, not length, carries the value). */
function DotPlot({ rows, min, max, ticks, caption }: { rows: DotRow[]; min: number; max: number; ticks: number[]; caption: string }) {
  const pos = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <figure className="dotplot">
      <figcaption className="viz-caption">{caption}</figcaption>
      <ul className="dot-rows">
        {rows.map((r, i) => (
          <li key={r.label} className={`dot-row${i === rows.length - 1 ? " is-final" : ""}`}>
            <span className="dot-label">{r.label}</span>
            <span className="dot-track">
              <span
                className="dot"
                style={{ left: pos(r.value) } as CSSProperties}
                tabIndex={0}
                aria-label={`${r.label}: ${r.approx ? "about " : ""}${r.value}`}
              >
                <span className="dot-tip" role="tooltip">
                  {r.approx ? "≈ " : ""}
                  {r.value}
                  {r.note ? <small>{r.note}</small> : null}
                </span>
              </span>
            </span>
            <span className="dot-value">
              {r.approx ? "≈ " : ""}
              {r.value}
            </span>
          </li>
        ))}
      </ul>
      <div className="dot-axis" aria-hidden="true">
        <span className="dot-label" />
        <span className="dot-track">
          {ticks.map((t) => (
            <span key={t} className="dot-tick" style={{ left: pos(t) }}>
              {t}
            </span>
          ))}
        </span>
        <span className="dot-value" />
      </div>
    </figure>
  );
}

export function ResolvVisuals() {
  return (
    <div className="resolv-viz">
      <figure className="funnel">
        <figcaption className="viz-caption">How the search space shrinks</figcaption>
        <ol className="funnel-steps">
          {resolvFunnel.map((s, i) => (
            <li key={s.label} className="funnel-step" style={{ "--w": `${100 - i * 15}%` } as CSSProperties}>
              <span className="funnel-bar">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </span>
              <span className="funnel-split">{s.split}</span>
            </li>
          ))}
        </ol>
        <p className="viz-note">
          Retrieval keeps 99.86% of true pairs; the re-ranker cut keeps 99.43%. A perfect matcher on our final candidates
          would score 0.99846, the ceiling we left for the matching models.
        </p>
      </figure>

      <DotPlot
        caption="What each model adds (validation macro F0.5)"
        rows={resolvAblation}
        min={0.984}
        max={0.992}
        ticks={[0.984, 0.986, 0.988, 0.99, 0.992]}
      />

      <DotPlot
        caption="Public leaderboard F0.5, by version"
        rows={resolvLeaderboard.map((r) => ({ label: r.version, value: r.value, note: r.note, approx: r.approx }))}
        min={0.93}
        max={0.99}
        ticks={[0.93, 0.95, 0.97, 0.99]}
      />

      <p className="viz-note">
        Validation numbers are on 100,000 held-out training businesses; the leaderboard is the public test score. The
        gap is expected: France (about 15% of test) has no training labels at all.
      </p>
    </div>
  );
}
