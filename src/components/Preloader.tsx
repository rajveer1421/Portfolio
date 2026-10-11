import { useEffect, useRef, useState } from "react";
import { CipherText } from "./fx/CipherText";

const LINES = ["loading weights", "warming up the GPU", "decoding résumé", "ready"];
const DURATION = 1700;

/** First-visit intro: the name decodes while a counter races to 100, then the curtain lifts. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    document.body.classList.add("is-loading");
    const t0 = performance.now();
    let raf = 0;
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setLeaving(true);
      window.setTimeout(() => {
        document.body.classList.remove("is-loading");
        try {
          sessionStorage.setItem("rg-intro", "1");
        } catch {
          /* private mode: the intro just shows again next time */
        }
        onDone();
      }, 800);
    };
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / DURATION);
      const eased = 1 - Math.pow(1 - k, 3);
      setCount(Math.round(eased * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    const skip = () => finish();
    skipRef.current = skip;
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      document.body.classList.remove("is-loading");
    };
  }, [onDone]);

  const line = LINES[Math.min(LINES.length - 1, Math.floor((count / 100) * LINES.length))];

  return (
    <div className={`preloader${leaving ? " is-leaving" : ""}`} onClick={() => skipRef.current()} role="status" aria-label="Loading">
      <div className="preloader-inner">
        <CipherText as="p" className="preloader-name" text="RAJVEER GUPTA" stagger={60} scramble={700} />
        <p className="preloader-line">
          <span>&gt;_ {line}</span>
          <span className="preloader-count">{String(count).padStart(3, "0")}</span>
        </p>
        <span className="preloader-bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </span>
      </div>
    </div>
  );
}

export function shouldShowIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem("rg-intro") !== "1";
  } catch {
    return true;
  }
}
