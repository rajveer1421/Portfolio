import { useState, type CSSProperties } from "react";
import { education, experience, publication } from "../data/content";
import { ChromaCard } from "./fx/ChromaCard";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";

const STEP_WHAT: Record<string, string> = {
  Detect: "Flags a camera only when a fault persists, so one glitchy frame is not an alarm.",
  Reconstruct: "Rebuilds the dead camera's view from the overlapping cameras around it.",
  Fill: "Paints in the regions no other camera can see.",
  Restore: "Cleans blur and noise in linear, not quadratic, time.",
};

export function Research() {
  const [certOpen, setCertOpen] = useState(false);

  return (
    <section id="research" className="section research">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow-lg">
            <b>[05]</b> Publication & experience
          </span>
          <h2 className="section-title">
            Cameras that <em>heal</em> themselves
          </h2>
          <p className="section-lede">{publication.plain}</p>
        </div>

        <div className="paper-grid">
          <article className="paper" data-reveal>
            <div className="paper-badges">
              <span className="tag tag-accent">IEEE · IRAI 2026</span>
              <span className="tag">{publication.status}</span>
            </div>
            <h3 className="paper-title">{publication.title}</h3>
            <p className="paper-authors">
              {publication.authors.map((a, i) => (
                <span key={a}>
                  {a === "Rajveer Gupta" ? <strong>{a}</strong> : a}
                  {i < publication.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p className="paper-venue">
              {publication.venue} · {publication.where}
            </p>

            <ol className="pipeline">
              {publication.pipeline.map((s, i) => (
                <li key={s.step} data-reveal style={{ "--rd": i } as CSSProperties}>
                  <span className="pipeline-n">0{i + 1}</span>
                  <span className="pipeline-step">{s.step}</span>
                  <span className="pipeline-what">{STEP_WHAT[s.step] ?? ""}</span>
                  <span className="pipeline-detail">{s.detail}</span>
                </li>
              ))}
            </ol>

            <ul className="metrics">
              {publication.results.map((r) => (
                <li key={r.label}>
                  <strong>{r.value}</strong>
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
            <p className="muted small">{publication.resultNote}</p>
          </article>

          <div className="paper-side" data-reveal style={{ "--rd": 2 } as CSSProperties}>
            <div className="paper-cert">
              <ChromaCard image="/certificates/irai-2026-presentation-thumb.webp" imageAlt="IRAI 2026 certificate of presentation" tilt={12} />
              <button type="button" className="paper-cert-label" onClick={() => setCertOpen(true)}>
                View the certificate of presentation <Icon name="arrow-right" />
              </button>
            </div>
          </div>
        </div>

        <div className="xp-grid">
          <div>
            <h3 className="xp-title" data-reveal>
              Experience
            </h3>
            <ol className="timeline">
              {experience.map((x) => (
                <li key={x.title} className="timeline-item" data-reveal>
                  <span className="timeline-when">{x.when}</span>
                  <h4 className="timeline-title">{x.title}</h4>
                  <p className="timeline-org">{x.org}</p>
                  <ul className="pd-list">
                    {x.points.map((p) => (
                      <li key={p.slice(0, 24)}>{p}</li>
                    ))}
                  </ul>
                  {x.link ? (
                    <a href={x.link.href} target="_blank" rel="noreferrer" className="text-link">
                      {x.link.label} <Icon name="external" />
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="xp-title" data-reveal>
              Education
            </h3>
            <ol className="timeline">
              {education.map((e) => (
                <li key={e.school} className="timeline-item" data-reveal>
                  <span className="timeline-when">{e.when}</span>
                  <h4 className="timeline-title">{e.school}</h4>
                  <p className="timeline-org">
                    {e.detail} · <strong className="score">{e.score}</strong>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <Dialog open={certOpen} onClose={() => setCertOpen(false)} labelId="irai-cert-title" title="IRAI 2026 · Certificate of presentation">
        <img className="cert-full" src={publication.certificate} alt="IEEE IRAI 2026 certificate of presentation" width="1000" height="702" />
        <a href={publication.certificate} target="_blank" rel="noreferrer" className="text-link">
          Open full size <Icon name="external" />
        </a>
      </Dialog>
    </section>
  );
}
