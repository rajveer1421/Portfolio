import { useEffect, useState } from "react";
import { profile } from "../data/content";
import { Icon } from "./Icon";

const links = [
  { id: "about", label: "About" },
  { id: "work", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "awards", label: "Awards" },
  { id: "skills", label: "Skills" },
];

export function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = [...links.map((l) => l.id), "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)} aria-label="Rajveer Gupta, back to top">
          <span className="brand-mark" aria-hidden="true">
            RG
          </span>
          <span className="brand-name">Rajveer Gupta</span>
        </a>

        <nav aria-label="Main">
          <ul id="nav-links" className="nav-links">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={active === l.id ? "is-active" : undefined}
                  aria-current={active === l.id ? "true" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            {profile.resumeUrl ? (
              <li>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                  Résumé
                </a>
              </li>
            ) : null}
            <li className="nav-cta-item">
              <a href="#contact" className="btn btn-accent btn-sm" onClick={() => setOpen(false)}>
                Contact me
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}
