import type { CSSProperties } from "react";
import { certifications, fundamentals, skillGroups } from "../data/content";
import { Marquee } from "./fx/Marquee";
import { Icon } from "./Icon";

const half = Math.ceil(skillGroups.length / 2);
const rowA = skillGroups.slice(0, half).flatMap((g) => g.items);
const rowB = skillGroups.slice(half).flatMap((g) => g.items);

export function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">
            <b>[08]</b> Toolbox
          </span>
          <h2 className="section-title">
            What I <em>work</em> with
          </h2>
          <p className="section-lede">Everything here shows up in at least one project above.</p>
        </div>
      </div>

      <div className="skills-marquees" aria-hidden="true">
        <Marquee items={rowA} speed={55} className="skills-marquee" />
        <Marquee items={rowB} speed={60} reverse className="skills-marquee is-outline" />
      </div>

      <div className="wrap">
        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <div key={g.title} className="skill-card" data-reveal style={{ "--rd": i % 3 } as CSSProperties}>
              <h3 className="skill-title">
                <span>{String(i + 1).padStart(2, "0")}</span>
                {g.title}
              </h3>
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
          <h3 className="xp-title">CS fundamentals</h3>
          <ul className="fund-list">
            {fundamentals.map((f) => (
              <li key={f.title}>
                <strong>{f.title}</strong>
                <span>{f.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <details className="certs" data-reveal>
          <summary>
            Certifications · IBM AI Engineering on Coursera <span className="muted">({certifications.length})</span>
          </summary>
          <ul>
            {certifications.map((c) => (
              <li key={c.title}>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <strong>{c.title}</strong>
                  <span className="muted">IBM</span>
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
