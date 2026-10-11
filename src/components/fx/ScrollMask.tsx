import { useEffect, useRef, type ReactNode } from "react";
import { useMediaQuery } from "../../hooks/useInView";

interface ScrollMaskProps {
  image: string;
  word: string;
  children?: ReactNode;
}

/** Width of the word in px at a 100px font size, measured in the real display font once it has loaded. */
const measureWord = (word: string, family: string) => {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return word.length * 105;
  ctx.font = `800 100px ${family}`;
  // matches the -0.025em letter-spacing on .smask-word
  return ctx.measureText(word).width - (word.length - 1) * 2.5;
};

/**
 * An image revealed through a mask as you scroll: a giant word is cut out of the page,
 * and it grows until the photo behind fills the screen.
 */
export function ScrollMask({ image, word, children }: ScrollMaskProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<SVGRectElement>(null);
  const baseRef = useRef<SVGRectElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const text = textRef.current;
    if (!section || !stage || !svg || !group || !text) return;
    let raf = 0;
    let running = false;
    let smooth = 0;
    // the viewBox matches the stage in px, so the word is sized for the screen it is on (no cropping on phones)
    const geo = { w: 1600, h: 900, maxScale: 70 };

    const layout = () => {
      const w = Math.max(1, stage.clientWidth);
      const h = Math.max(1, stage.clientHeight);
      const family = getComputedStyle(text).fontFamily || "sans-serif";
      const at100 = measureWord(word, family);
      // landscape: the word spans ~62% of the width; portrait: almost edge to edge
      const target = w * (w > h ? 0.62 : 0.86);
      const fs = Math.min((target / at100) * 100, h * 0.32);
      geo.w = w;
      geo.h = h;
      // big enough that a single stroke of a letter covers the whole screen at the end
      geo.maxScale = (7 * Math.max(w, h)) / fs;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      for (const r of [baseRef.current, coverRef.current]) {
        r?.setAttribute("width", String(w));
        r?.setAttribute("height", String(h));
      }
      text.setAttribute("x", String(w / 2));
      text.setAttribute("y", String(h / 2));
      text.style.fontSize = `${fs.toFixed(2)}px`;
      text.style.letterSpacing = `${(-fs * 0.025).toFixed(2)}px`;
    };

    const tick = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const target = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      smooth += (target - smooth) * 0.16;
      const p = smooth;
      const s = 1 + Math.pow(p, 2.6) * (geo.maxScale - 1);
      const cx = geo.w / 2;
      const cy = geo.h / 2;
      group.setAttribute("transform", `translate(${cx} ${cy}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})`);
      if (imgRef.current) imgRef.current.style.transform = `scale(${(1.25 - p * 0.25).toFixed(4)})`;
      // near the end the cut-out is bigger than the screen; fade what's left of the cover away
      if (coverRef.current) coverRef.current.style.opacity = String(1 - Math.min(1, Math.max(0, (p - 0.55) / 0.25)));
      if (captionRef.current) {
        const c = Math.min(1, Math.max(0, (p - 0.72) / 0.2));
        captionRef.current.style.opacity = c.toFixed(3);
        captionRef.current.style.transform = `translateY(${(1 - c) * 30}px)`;
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    layout();
    // re-measure once the display font is in, otherwise the fallback font's width is used
    document.fonts?.ready.then(layout).catch(() => {});
    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(section);
    return () => {
      running = false;
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, word]);

  if (reduced) {
    return (
      <div className="smask smask-static">
        <img src={image} alt="" loading="lazy" decoding="async" />
        <div className="smask-caption is-static">{children}</div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="smask">
      <div ref={stageRef} className="smask-stage">
        <img ref={imgRef} className="smask-img" src={image} alt="" loading="lazy" decoding="async" />
        <svg ref={svgRef} className="smask-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <mask id={`smask-${word}`}>
              <rect ref={baseRef} width="1600" height="900" fill="white" />
              <g ref={groupRef}>
                <text ref={textRef} x="800" y="450" textAnchor="middle" dominantBaseline="central" className="smask-word">
                  {word}
                </text>
              </g>
            </mask>
          </defs>
          <rect ref={coverRef} width="1600" height="900" className="smask-cover" mask={`url(#smask-${word})`} />
        </svg>
        <div ref={captionRef} className="smask-caption">
          {children}
        </div>
      </div>
    </div>
  );
}
