import type { CSSProperties } from "react";
import { about, interests, quickFacts, roles } from "../data/content";
import { Icon } from "./Icon";

export function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="about-grid">
          <div className="section-head" data-reveal>
            <span className="eyebrow">01 · About me</span>
            <h2 className="section-title">I like building AI that has to work for real people</h2>
            {about.map((p) => (
              <p key={p.slice(0, 24)} className="section-lede">
                {p}
              </p>
            ))}
          </div>

          <dl className="facts card" data-reveal style={{ "--rd": 2 } as CSSProperties}>
            {quickFacts.map((f) => (
              <div key={f.label} className="fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="roles-head" data-reveal>
          <h3 className="sub-title">Open to roles in</h3>
          <p className="muted">Each one links to the work that backs it up.</p>
        </div>
        <ul className="roles">
          {roles.map((r, i) => (
            <li key={r.title} className="role card" data-reveal style={{ "--rd": i % 3 } as CSSProperties}>
              <span className="role-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="role-title">{r.title}</h4>
              <p className="role-what">{r.what}</p>
              <a href={r.proofHref} className="role-proof">
                {r.proof}
                <Icon name="arrow-right" />
              </a>
            </li>
          ))}
        </ul>

        <div className="interests" data-reveal>
          <h3 className="sub-title">What I'm into</h3>
          <ul className="chip-list">
            {interests.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
