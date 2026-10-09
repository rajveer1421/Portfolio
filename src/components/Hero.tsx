import type { CSSProperties } from "react";
import { profile } from "../data/content";
import { HeroScene } from "./HeroScene";
import { Icon } from "./Icon";

function Letters({ text, offset, className }: { text: string; offset: number; className?: string }) {
  return (
    <span className={`word${className ? ` ${className}` : ""}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={i} className="ch" style={{ "--i": offset + i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap hero-text">
        <p className="hero-hello">
          <b>&gt;_</b> hello, world. I'm
        </p>
        <h1 className="hero-name">
          <span className="sr-only">
            {profile.firstName} {profile.lastName}
          </span>
          <Letters text={profile.firstName} offset={0} />{" "}
          <Letters text={profile.lastName} offset={profile.firstName.length} className="last" />
          <svg className="underline" viewBox="0 0 600 30" preserveAspectRatio="none" aria-hidden="true">
            <path d="M6 20 C 120 6, 260 26, 380 14 S 560 8, 594 18" pathLength={1} />
          </svg>
        </h1>
        <p className="hero-role">
          <strong>{profile.headline}</strong> at IIIT Nagpur. I train models, build multi-agent LLM systems and ship
          them as real products.
        </p>
      </div>

      <div className="wrap scene-wrap">
        <HeroScene />
      </div>

      <div className="hero-cta">
        <a href="#about" className="btn btn-accent know-more">
          Know more about me
          <span className="arrow">
            <Icon name="arrow-down" />
          </span>
        </a>
        <a href="#work" className="btn btn-ghost">
          See my projects
        </a>
      </div>
    </section>
  );
}
