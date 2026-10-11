import type { CSSProperties } from "react";
import { about, interests, quickFacts } from "../data/content";
import { HeroScene } from "./HeroScene";
import { Marquee } from "./fx/Marquee";

export function About() {
  return (
    <section id="about" className="section about">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">
            <b>[01]</b> Who's behind the screen
          </span>
          <h2 className="section-title">
            Meet the guy <em>behind</em> the code
          </h2>
        </div>

        <div className="desk theme-paper" data-reveal>
          <HeroScene />
          <span className="desk-label">LIVE · usually around 2 a.m.</span>
        </div>

        <div className="about-cols">
          <div className="about-text">
            {about.map((p, i) => (
              <p key={p.slice(0, 24)} data-reveal style={{ "--rd": i } as CSSProperties}>
                {p}
              </p>
            ))}
          </div>
          <dl className="about-facts">
            {quickFacts.map((f, i) => (
              <div key={f.label} className="about-fact" data-reveal style={{ "--rd": i } as CSSProperties}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Marquee className="about-marquee" items={interests} speed={48} reverse />
    </section>
  );
}
