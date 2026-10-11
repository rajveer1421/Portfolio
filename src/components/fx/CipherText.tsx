import { createElement, Fragment, useEffect, useRef, type ElementType } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\[]{}$@!?";

interface CipherTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Decoding starts when this becomes true. */
  start?: boolean;
  delay?: number;
  /** ms between characters starting to settle */
  stagger?: number;
  /** how long each character scrambles before landing */
  scramble?: number;
  /** scramble again on hover */
  hover?: boolean;
}

/**
 * A headline that decodes out of scrambled characters.
 * Every character keeps its real glyph (invisible) to reserve width, so nothing jumps while it scrambles.
 */
export function CipherText({
  text,
  as = "span",
  className,
  start = true,
  delay = 0,
  stagger = 28,
  scramble = 420,
  hover = false,
}: CipherTextProps) {
  const rootRef = useRef<HTMLElement>(null);
  const runRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cells = Array.from(root.querySelectorAll<HTMLElement>(".cipher-ch"));
    const glyphs = cells.map((c) => c.querySelector<HTMLElement>(".cipher-glyph")!);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const finish = () => cells.forEach((c) => c.classList.add("is-done"));

    const run = (wait: number) => {
      cancelAnimationFrame(raf);
      const t0 = performance.now() + wait;
      const settle = cells.map((_, i) => i * stagger + scramble * (0.6 + Math.random() * 0.8));
      cells.forEach((c) => c.classList.remove("is-done", "is-live"));
      let lastSwap = 0;
      const tick = (now: number) => {
        const t = now - t0;
        const swap = now - lastSwap > 50;
        if (swap) lastSwap = now;
        let done = 0;
        for (let i = 0; i < cells.length; i++) {
          if (t >= settle[i]) {
            if (!cells[i].classList.contains("is-done")) cells[i].classList.add("is-done");
            done++;
          } else if (t >= i * stagger * 0.5) {
            if (swap) glyphs[i].textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            cells[i].classList.add("is-live");
          }
        }
        if (done < cells.length) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    runRef.current = () => run(0);
    if (reduced) {
      finish();
      return;
    }
    if (start) run(delay);
    return () => cancelAnimationFrame(raf);
  }, [text, start, delay, stagger, scramble]);

  const words = text.split(" ");
  return createElement(
    as,
    {
      ref: rootRef,
      className: `cipher${className ? ` ${className}` : ""}`,
      onMouseEnter: hover ? () => runRef.current() : undefined,
    },
    <span className="sr-only">{text}</span>,
    <span aria-hidden="true">
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="cipher-word">
            {[...w].map((ch, ci) => (
              <span key={ci} className="cipher-ch">
                <span className="cipher-final">{ch}</span>
                <span className="cipher-glyph">{ch}</span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>,
  );
}
