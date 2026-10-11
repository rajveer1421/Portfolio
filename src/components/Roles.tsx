import { useState } from "react";
import { profile, roles } from "../data/content";
import { ChromaCard } from "./fx/ChromaCard";
import { RotatingCards } from "./fx/RotatingCards";
import { Icon } from "./Icon";

const TONES = ["orange", "lime", "violet"] as const;

/** The last section: the roles I'm open to (a rotating ring), then how to reach me. */
export function Roles() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const socials = [
    { label: "LinkedIn", href: profile.linkedin, icon: "linkedin" as const },
    { label: "GitHub", href: profile.github, icon: "github" as const },
    { label: "Kaggle", href: profile.kaggle, icon: "kaggle" as const },
    { label: "Hugging Face", href: profile.huggingface, icon: "hf" as const },
  ];

  return (
    <section id="contact" className="section roles">
      <div className="wrap">
        <div className="section-head roles-head" data-reveal>
          <span className="eyebrow">
            <b>[10]</b> Open to roles
          </span>
          <h2 className="section-title">
            Where I'd <em>fit</em>
          </h2>
          <p className="section-lede">Six kinds of roles, each backed by real work. Drag the ring or let it spin.</p>
        </div>
      </div>

      <RotatingCards
        items={roles}
        getKey={(r) => r.title}
        label="Roles I'm open to"
        renderItem={(r, i) => (
          <div className={`role-card tone-${TONES[i % 3]}`}>
            <span className="role-n">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="role-title">{r.title}</h3>
            <p className="role-what">{r.what}</p>
            <a href={r.proofHref} className="role-proof">
              {r.proof}
              <Icon name="arrow-right" />
            </a>
          </div>
        )}
      />

      <div className="wrap contact">
        <div className="contact-copy" data-reveal>
          <h2 className="contact-title">
            Let's build something <em>that works</em>.
          </h2>
          <p className="contact-lede">
            Open to AI/ML, applied AI, agentic AI, research and SDE internships for 2027. Email is the fastest way to reach me.
          </p>
          <div className="contact-mail">
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
            </a>
            <button type="button" className="btn btn-sm" onClick={copy} aria-live="polite">
              <Icon name={copied ? "check" : "copy"} />
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>
          <ul className="contact-links">
            <li>
              <a href={profile.phoneHref} className="btn btn-ghost btn-sm">
                <Icon name="phone" />
                {profile.phone}
              </a>
            </li>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                  <Icon name={s.icon} />
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#resumes" className="btn btn-accent btn-sm">
                <Icon name="file" />
                Résumés
              </a>
            </li>
          </ul>
        </div>

        <div className="contact-card" data-reveal>
          <ChromaCard image="/photos/fest-sm.webp" imageAlt="Rajveer at a college fest at night, under string lights" tilt={14}>
            <div className="contact-card-caption">
              <span className="contact-card-kicker">Say hi</span>
              <strong>I reply fast.</strong>
            </div>
          </ChromaCard>
        </div>
      </div>

      <footer className="wrap footer">
        <span>
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName}. Designed and built by me, no templates.
        </span>
        <a href="#top" className="text-link">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
