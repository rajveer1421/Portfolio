import { useEffect, useRef, type ReactNode } from "react";

interface OrbitReelProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  label: string;
}


/**
 * A turning wheel of cards that sweeps into an arc. The wheel's centre sits below the stage,
 * so cards rise in from the left, crest the top and sink away on the right. Drag to spin; hover pauses.
 */
export function OrbitReel<T>({ items, getKey, renderItem, label }: OrbitReelProps<T>) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const n = items.length;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0;
    let vel = reduced ? 0 : -4;
    let paused = false;
    let dragging = false;
    let downX: number | null = null;
    let lastX = 0;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const radius = () => Math.max(700, Math.min(1300, stage.clientWidth * 0.95));
    // degrees between cards: enough that neighbours clear each other on the current radius (13° on desktop)
    const stepFor = (r: number) => {
      const w = cardRefs.current[0]?.offsetWidth ?? 240;
      return Math.max(13, (2 * Math.asin(Math.min(0.9, (w * 1.06) / (2 * r))) * 180) / Math.PI);
    };
    let R = radius();
    let step = stepFor(R);
    let span = n * step;

    const paint = () => {
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        // wrap each card's angle into [-span/2, span/2) so the reel loops forever
        let a = (((i * step + angle) % span) + span) % span;
        if (a >= span / 2) a -= span;
        const abs = Math.abs(a);
        el.style.transform = `translate(-50%, 0) rotate(${a}deg) translateY(${-R}px)`;
        el.style.opacity = abs > 52 ? "0" : String(Math.min(1, (52 - abs) / 14));
        el.style.zIndex = String(100 - Math.round(abs));
        el.style.pointerEvents = abs > 40 ? "none" : "auto";
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      if (!dragging) {
        const want = paused || reduced ? 0 : -4;
        vel += (want - vel) * (1 - Math.exp(-dt / 0.6));
        angle += vel * dt;
      }
      paint();
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onDown = (e: PointerEvent) => {
      downX = e.clientX;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) {
        if (downX === null || Math.abs(e.clientX - downX) < 6) return;
        dragging = true;
        stage.setPointerCapture(e.pointerId);
      }
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      angle += dx * 0.06;
      vel = dx * 3;
    };
    const onUp = (e: PointerEvent) => {
      downX = null;
      dragging = false;
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    };
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("pointerenter", pause);
    stage.addEventListener("pointerleave", resume);
    stage.addEventListener("focusin", pause);
    stage.addEventListener("focusout", resume);
    const onResize = () => {
      R = radius();
      step = stepFor(R);
      span = n * step;
      stage.style.setProperty("--R", `${R}px`);
      paint();
    };
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(stage);
    onResize();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("pointerenter", pause);
      stage.removeEventListener("pointerleave", resume);
      stage.removeEventListener("focusin", pause);
      stage.removeEventListener("focusout", resume);
    };
  }, [n]);

  return (
    <div ref={stageRef} className="orbit" role="region" aria-label={label} data-cursor="drag">
      <div className="orbit-hub">
        {items.map((it, i) => (
          <div
            key={getKey(it)}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="orbit-card"
          >
            {renderItem(it, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
