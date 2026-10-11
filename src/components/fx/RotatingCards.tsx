import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../Icon";

interface RotatingCardsProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  label: string;
}

/** A draggable ring of cards rotating in 3D. Spins slowly on its own; hover or focus pauses it. */
export function RotatingCards<T>({ items, getKey, renderItem, label }: RotatingCardsProps<T>) {
  const ringRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctl = useRef({ angle: 0, vel: 0, paused: false, dragging: false, lastX: 0, target: null as number | null });
  const [front, setFront] = useState(0);
  const n = items.length;
  const step = 360 / n;

  useEffect(() => {
    const ring = ringRef.current;
    const stage = stageRef.current;
    if (!ring || !stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const radius = () => {
      const w = cardRefs.current[0]?.offsetWidth ?? 280;
      return Math.round((w / 2 / Math.tan(Math.PI / n)) * 1.18);
    };
    let R = radius();

    const paint = () => {
      const c = ctl.current;
      ring.style.transform = `translateZ(${-R}px) rotateY(${c.angle}deg)`;
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const a = i * step;
        el.style.transform = `rotateY(${a}deg) translateZ(${R}px)`;
        const facing = Math.cos(((a + c.angle) * Math.PI) / 180);
        el.style.setProperty("--face", facing.toFixed(3));
        el.style.pointerEvents = facing > 0.55 ? "auto" : "none";
      }
      const idx = (((Math.round(-c.angle / step) % n) + n) % n);
      setFront((p) => (p === idx ? p : idx));
    };

    const tick = (now: number) => {
      raf = 0;
      const c = ctl.current;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      if (!c.dragging) {
        if (c.target !== null) {
          c.angle += (c.target - c.angle) * (1 - Math.exp(-dt / 0.15));
          if (Math.abs(c.target - c.angle) < 0.05) {
            c.angle = c.target;
            c.target = null;
          }
        } else {
          const auto = c.paused || reduced ? 0 : -8;
          c.vel += (auto - c.vel) * (1 - Math.exp(-dt / 0.8));
          c.angle += c.vel * dt;
        }
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

    let downX: number | null = null;
    const onDown = (e: PointerEvent) => {
      downX = e.clientX;
      ctl.current.lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      const c = ctl.current;
      if (!c.dragging) {
        // only start dragging after a real movement, so links on the cards stay clickable
        if (downX === null || Math.abs(e.clientX - downX) < 6) return;
        c.dragging = true;
        c.target = null;
        stage.setPointerCapture(e.pointerId);
      }
      const dx = e.clientX - c.lastX;
      c.lastX = e.clientX;
      c.angle += dx * 0.35;
      c.vel = dx * 12;
    };
    const onUp = (e: PointerEvent) => {
      downX = null;
      ctl.current.dragging = false;
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    };
    const pause = () => (ctl.current.paused = true);
    const resume = () => (ctl.current.paused = false);
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
      paint();
    };
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(stage);
    paint();

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
  }, [n, step]);

  const turn = (d: number) => {
    const c = ctl.current;
    c.target = Math.round((c.angle - d * step) / step) * step;
  };

  return (
    <div className="rot" role="region" aria-label={label}>
      <div ref={stageRef} className="rot-stage" data-cursor="drag">
        <div ref={ringRef} className="rot-ring">
          {items.map((it, i) => (
            <div
              key={getKey(it)}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`rot-card${i === front ? " is-front" : ""}`}
            >
              {renderItem(it, i)}
            </div>
          ))}
        </div>
      </div>
      <div className="rot-controls">
        <button type="button" className="icon-btn" onClick={() => turn(-1)} aria-label="Previous role">
          <Icon name="arrow-left" />
        </button>
        <button type="button" className="icon-btn" onClick={() => turn(1)} aria-label="Next role">
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  );
}
