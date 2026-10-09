import type { CSSProperties } from "react";
import { certifications, fundamentals, skillGroups } from "../data/content";
import { Icon } from "./Icon";

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">05 · Skills</span>
          <h2 className="section-title">Languages, libraries and fundamentals</h2>
          <p className="section-lede">Everything here shows up in at least one of the projects above.</p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <div key={g.title} className="skill-card card" data-reveal style={{ "--rd": i % 3 } as CSSProperties}>
              <h3 className="skill-title">{g.title}</h3>
              <ul className="chip-list">
                {g.items.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="fundamentals" data-reveal>
          <h3 className="sub-title">CS fundamentals</h3>
          <ul className="fund-list">
            {fundamentals.map((f) => (
              <li key={f.title}>
                <strong>{f.title}</strong>
                <span>{f.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <details className="experiments" data-reveal>
          <summary>
            Certifications: IBM AI Engineering (Coursera) <span className="muted">({certifications.length})</span>
          </summary>
          <ul>
            {certifications.map((c) => (
              <li key={c.title}>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <strong>{c.title}</strong>
                  <Icon name="external" />
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
