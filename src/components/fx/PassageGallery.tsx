import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMediaQuery } from "../../hooks/useInView";

export interface PassageItem {
  when: string;
  title: string;
  detail: string;
  image?: string;
  /** big text shown instead of an image (defaults to the date) */
  tile?: string;
  tone?: "orange" | "lime" | "violet";
}

interface PassageGalleryProps {
  items: PassageItem[];
  heading: ReactNode;
}

const GAP = 720;

/** Tile text size: long words need a smaller size to fit the card. */
const tileClass = (text: string) => {
  const longest = Math.max(...text.split(" ").map((w) => w.length));
  return longest > 6 ? " is-xlong" : text.length > 5 ? " is-long" : "";
};

/**
 * A tunnel of moments you glide through as you scroll. The section is tall; a sticky
 * stage inside it moves a 3D camera forward, so each card flies past in turn.
 * On small screens (or with reduced motion) it becomes a plain vertical timeline.
 */
export function PassageGallery({ items, heading }: PassageGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const ringRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const small = useMediaQuery("(max-width: 720px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const flat = small || reduced;
  const n = items.length;

  useEffect(() => {
    if (flat) return;
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;
    let raf = 0;
    let running = false;
    let smooth = 0;

    const tick = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const target = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      smooth += (target - smooth) * 0.14;
      if (Math.abs(target - smooth) < 0.0004) smooth = target;
      const camera = smooth * (n - 1) * GAP - 260;
      scene.style.transform = `translateZ(${camera}px)`;
      for (let i = 0; i < ringRefs.current.length; i++) {
        const ring = ringRefs.current[i];
        if (!ring) continue;
        const ahead = i * (GAP / 2) - camera;
        ring.style.opacity = ahead < 80 ? "0" : String(Math.min(1, (ahead - 80) / 400) * Math.max(0, 1 - ahead / (GAP * 6)));
      }
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const ahead = i * GAP - camera; // distance in front of the camera
        let o = 1;
        if (ahead < -60) o = Math.max(0, 1 + (ahead + 60) / 220);
        else if (ahead > GAP * 3.2) o = Math.max(0, 1 - (ahead - GAP * 3.2) / GAP);
        el.style.opacity = o.toFixed(3);
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${smooth})`;
      const idx = Math.min(n - 1, Math.max(0, Math.round(smooth * (n - 1))));
      setCurrent((p) => (p === idx ? p : idx));
      if (running) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(section);
    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [flat, n]);

  if (flat) {
    return (
      <div className="passage-flat">
        <div className="passage-flat-head">{heading}</div>
        <ol className="passage-list">
          {items.map((it) => (
            <li key={it.title} className={`passage-card tone-${it.tone ?? "lime"}`} data-reveal>
              {it.image ? (
                <img src={it.image} alt="" loading="lazy" decoding="async" />
              ) : it.tile ? (
                <span className={`passage-big${tileClass(it.tile)}`}>{it.tile}</span>
              ) : null}
              <span className="passage-when">{it.when}</span>
              <h3 className="passage-title">{it.title}</h3>
              <p className="passage-detail">{it.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="passage" style={{ height: `${(n + 1) * 70}vh` } as CSSProperties}>
      <div className="passage-stage">
        <div className="passage-head">{heading}</div>
        <div className="passage-viewport" aria-hidden="true">
          <div ref={sceneRef} className="passage-scene">
            {Array.from({ length: n * 2 }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  ringRefs.current[i] = el;
                }}
                className="passage-ring"
                style={{ transform: `translate(-50%, -50%) translateZ(${-i * (GAP / 2)}px)` }}
              />
            ))}
            <ol className="passage-track">
              {items.map((it, i) => {
                const side = i % 2 === 0 ? -1 : 1;
                const lift = [0, -60, 40, -20][i % 4];
                return (
                  <li
                    key={it.title}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className={`passage-card tone-${it.tone ?? "lime"}${i === current ? " is-current" : ""}`}
                    style={{ transform: `translate(-50%, -50%) translate3d(${side * 300}px, ${lift}px, ${-i * GAP}px) rotateY(${side * -14}deg)` }}
                  >
                    {it.image ? (
                      <img src={it.image} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className={`passage-big${tileClass(it.tile ?? it.when)}`}>{it.tile ?? it.when}</span>
                    )}
                    <span className="passage-when">{it.when}</span>
                    <h3 className="passage-title">{it.title}</h3>
                    <p className="passage-detail">{it.detail}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className="passage-hud">
          <span className="passage-hud-when">{items[current].when}</span>
          <span className="passage-hud-title">{items[current].title}</span>
          <span className="passage-bar">
            <span ref={barRef} />
          </span>
        </div>
        {/* readable version for screen readers */}
        <ol className="sr-only">
          {items.map((it) => (
            <li key={it.title}>
              {it.when}: {it.title}. {it.detail}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
