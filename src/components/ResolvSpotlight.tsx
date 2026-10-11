import { useState, type CSSProperties } from "react";
import { projects, resolvLeaderboard } from "../data/content";
import { useInView } from "../hooks/useInView";
import { Globe, type GlobeMarker } from "./fx/Globe";
import { LineGraph } from "./fx/LineGraph";
import { SpeedNumber } from "./fx/SpeedNumber";
import { Icon } from "./Icon";
import { ProjectDialog } from "./ProjectDialog";

const MARKERS: GlobeMarker[] = [
  { lat: 48.86, lon: 2.35, label: "FRANCE" },
  { lat: 21.15, lon: 79.09, label: "INDIA" },
  { lat: 39.5, lon: -98.35, label: "USA" },
];
const ARCS: [number, number][] = [
  [1, 0],
  [0, 2],
  [2, 1],
];
const STATS = [
  { value: 11.7, decimals: 1, suffix: "M", label: "records searched" },
  { value: 5.58, decimals: 2, label: "candidates left of 86.7" },
  { value: 0.998, decimals: 3, label: "validation precision" },
];

export function ResolvSpotlight() {
  const [open, setOpen] = useState(false);
  const [statsRef, statsIn] = useInView<HTMLUListElement>({ once: true, threshold: 0.4 });
  const resolv = projects.find((p) => p.id === "resolv") ?? null;

  return (
    <section id="resolv" className="section resolv">
      <div className="wrap">
        <div className="resolv-grid">
          <div className="resolv-copy">
            <span className="eyebrow" data-reveal>
              <b>[04]</b> Spotlight · Amazon ML Challenge 2026
            </span>
            <h2 className="section-title" data-reveal>
              AIR 471 <em>of 32K</em> teams
            </h2>
            <p className="section-lede" data-reveal>
              The same shop shows up in French, Indian and US databases with different spellings, scripts and addresses.
              I led a team of four that built Resolv to find every record of the same real business.
            </p>
            <ul ref={statsRef} className="resolv-stats">
              {STATS.map((s) => (
                <li key={s.label}>
                  <SpeedNumber value={s.value} decimals={s.decimals} suffix={s.suffix} start={statsIn} />
                  <span className="stat-label">{s.label}</span>
                </li>
              ))}
            </ul>
            <ol className="resolv-story">
              {[
                "Caught a train–test shift (39.8% vs 26.0% unmatched records) and simulated it, instead of trusting validation.",
                "Paired IDF keys with a multilingual-e5 retriever fine-tuned with InfoNCE: 99.86% of true pairs kept.",
                "Ran a fine-tuned Qwen3 reranker only on uncertain pairs, the biggest single jump.",
              ].map((t, i) => (
                <li key={t} data-reveal style={{ "--rd": i } as CSSProperties}>
                  {t}
                </li>
              ))}
            </ol>
            <button type="button" className="btn btn-accent" onClick={() => setOpen(true)}>
              Open the full breakdown
              <Icon name="arrow-right" />
            </button>
          </div>

          <div className="resolv-globe" data-reveal>
            <Globe markers={MARKERS} arcs={ARCS} label="A rotating dotted globe with arcs linking France, India and the USA, the three countries in the Resolv data" />
            <span className="resolv-globe-tag">drag to spin · FR ⇄ IN ⇄ US</span>
          </div>
        </div>

        <div className="resolv-graph" data-reveal>
          <LineGraph
            caption="Public leaderboard F0.5, version by version"
            data={resolvLeaderboard.map((r) => ({ label: r.version, value: r.value, note: r.note, approx: r.approx }))}
            min={0.93}
            max={0.99}
            ticks={[0.93, 0.95, 0.97, 0.99]}
          />
        </div>
      </div>

      <ProjectDialog project={open ? resolv : null} onClose={() => setOpen(false)} />
    </section>
  );
}
