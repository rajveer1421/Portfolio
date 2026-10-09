import { useState } from "react";
import { profile } from "../data/content";
import { Icon } from "./Icon";

export function Contact() {
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
    <section id="contact" className="section contact">
      <div className="wrap contact-inner" data-reveal>
        <span className="eyebrow eyebrow-light">06 · Contact</span>
        <h2 className="contact-title">Let's build something that works</h2>
        <p className="contact-lede">
          I'm open to AI/ML, AI engineering, applied AI, research, application engineering and SDE roles. Email is the
          fastest way to reach me.
        </p>

        <div className="contact-mail">
          <a href={`mailto:${profile.email}`} className="contact-email">
            {profile.email}
          </a>
          <button type="button" className="btn btn-light btn-sm" onClick={copy} aria-live="polite">
            <Icon name={copied ? "check" : "copy"} />
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>

        <ul className="contact-links">
          <li>
            <a href={profile.phoneHref} className="btn btn-outline-light">
              <Icon name="phone" />
              {profile.phone}
            </a>
          </li>
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="btn btn-outline-light">
                <Icon name={s.icon} />
                {s.label}
              </a>
            </li>
          ))}
          {profile.resumeUrl ? (
            <li>
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-accent">
                <Icon name="file" />
                Résumé
              </a>
            </li>
          ) : null}
        </ul>
      </div>

      <footer className="wrap footer">
        <span>
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName}. Designed and built by me.
        </span>
        <a href="#top" className="text-link">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
