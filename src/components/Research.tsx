import { useState, type CSSProperties } from "react";
import { education, experience, publication } from "../data/content";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";

export function Research() {
  const [certOpen, setCertOpen] = useState(false);

  return (
    <section id="research" className="section">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">03 · Research & experience</span>
          <h2 className="section-title">Research I've published</h2>
          <p className="section-lede">{publication.plain}</p>
        </div>

        <article className="paper card" data-reveal>
          <div className="paper-main">
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
              {publication.venue}
              <br />
              {publication.where} · Paper ID {publication.paperId}
            </p>

            <ol className="pipeline">
              {publication.pipeline.map((s, i) => (
                <li key={s.step} style={{ "--rd": i } as CSSProperties} data-reveal>
                  <span className="pipeline-step">{s.step}</span>
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
          </div>

          <button type="button" className="paper-cert" onClick={() => setCertOpen(true)}>
            <img
              src="/certificates/irai-2026-presentation-thumb.webp"
              alt="IRAI 2026 certificate of presentation"
              width="480"
              height="337"
              loading="lazy"
              decoding="async"
            />
            <span className="paper-cert-label">
              View certificate <Icon name="arrow-right" />
            </span>
          </button>
        </article>

        <div className="xp-grid">
          <div>
            <h3 className="sub-title" data-reveal>
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
            <h3 className="sub-title" data-reveal>
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
