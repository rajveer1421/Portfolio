import { useEffect, useRef, useState } from "react";
import { lockScroll } from "../lib/smooth";
import { Icon } from "./Icon";

const links = [
  { id: "about", label: "About" },
  { id: "awards", label: "Trophies" },
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "journey", label: "Journey" },
  { id: "resumes", label: "Résumés" },
];

export function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 500 && y > lastY + 4);
      if (y < lastY - 4 || y < 500) setHidden(false);
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
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
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
      <span className="nav-progress" aria-hidden="true">
        <span ref={progressRef} />
      </span>
      <div className="wrap nav-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)} aria-label="Rajveer Gupta, back to top">
          <span className="brand-mark" aria-hidden="true">
            RG
          </span>
          <span className="brand-name">
            Rajveer<span>Gupta</span>
          </span>
        </a>

        <nav aria-label="Main" className="nav-main">
          <ul id="nav-links" className="nav-links">
            {links.map((l, i) => (
              <li key={l.id} style={{ ["--i" as string]: i }}>
                <a
                  href={`#${l.id}`}
                  className={active === l.id ? "is-active" : undefined}
                  aria-current={active === l.id ? "true" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-num">0{i + 1}</span>
                  <span className="nav-label" data-text={l.label}>
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="btn btn-sm nav-cta" onClick={() => setOpen(false)}>
          Let's talk
          <Icon name="arrow-right" />
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
