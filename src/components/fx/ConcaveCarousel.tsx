import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../Icon";

interface ConcaveCarouselProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  /** Called when the centred card is clicked or Enter is pressed. */
  onOpen: (index: number) => void;
  label: string;
  /** Imperatively jump to a card (changes when the value changes). */
  focusIndex?: number;
}

const geometry = () => {
  const small = window.matchMedia("(max-width: 720px)").matches;
  return small ? { step: 30, radius: 760, persp: 640, visible: 80, pxPerItem: 220 } : { step: 21, radius: 1250, persp: 1050, visible: 70, pxPerItem: 300 };
};

/**
 * A gallery wall that curves around the viewer. Cards sit on the inside of a cylinder;
 * drag, use the arrows, or click a side card to bring it to the middle.
 */
export function ConcaveCarousel<T>({ items, getKey, getLabel, renderItem, onOpen, label, focusIndex }: ConcaveCarouselProps<T>) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef({ pos: 0, target: 0, vel: 0, dragging: false, startX: 0, startTarget: 0, moved: 0, lastX: 0, lastT: 0 });
  const [active, setActive] = useState(0);
  const n = items.length;

  const go = (i: number) => {
    state.current.target = Math.max(0, Math.min(n - 1, i));
    kick.current();
  };
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    if (focusIndex !== undefined) go(focusIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let g = geometry();
    let raf = 0;
    let last = performance.now();

    const paint = () => {
      const s = state.current;
      stage.style.setProperty("--persp", `${g.persp}px`);
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const a = (i - s.pos) * g.step;
        const abs = Math.abs(a);
        const hidden = abs > g.visible;
        el.style.transform = `translate(-50%, -50%) translateZ(${g.persp}px) rotateY(${-a}deg) translateZ(${-g.radius}px)`;
        el.style.opacity = hidden ? "0" : String(1 - Math.max(0, abs - g.visible * 0.55) / (g.visible * 0.45));
        el.style.visibility = hidden ? "hidden" : "visible";
        el.style.zIndex = String(1000 - Math.round(abs * 10));
        el.style.setProperty("--dim", String(Math.min(1, abs / (g.step * 2.2))));
        el.classList.toggle("is-center", abs < g.step / 2);
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const s = state.current;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      if (!s.dragging) {
        const k = reduced ? 1 : 1 - Math.exp(-dt / 0.12);
        s.pos += (s.target - s.pos) * k;
        if (Math.abs(s.target - s.pos) < 0.0005) s.pos = s.target;
      }
      paint();
      const nearest = Math.max(0, Math.min(n - 1, Math.round(s.pos)));
      setActive((prev) => (prev === nearest ? prev : nearest));
      if (s.dragging || s.pos !== s.target) raf = requestAnimationFrame(tick);
    };
    kick.current = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const s = state.current;
      s.dragging = true;
      s.startX = e.clientX;
      s.lastX = e.clientX;
      s.lastT = performance.now();
      s.startTarget = s.pos;
      s.moved = 0;
      s.vel = 0;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add("is-dragging");
      kick.current();
    };
    const onMove = (e: PointerEvent) => {
      const s = state.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.startX;
      s.moved = Math.max(s.moved, Math.abs(dx));
      const now = performance.now();
      s.vel = (e.clientX - s.lastX) / Math.max(1, now - s.lastT);
      s.lastX = e.clientX;
      s.lastT = now;
      s.pos = Math.max(-0.4, Math.min(n - 0.6, s.startTarget - dx / g.pxPerItem));
    };
    const onUp = (e: PointerEvent) => {
      const s = state.current;
      if (!s.dragging) return;
      s.dragging = false;
      stage.classList.remove("is-dragging");
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
      if (s.moved < 6) {
        // a click: find which card was hit
        const hit = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>("[data-cc-index]");
        if (hit) {
          const i = Number(hit.dataset.ccIndex);
          if (i === Math.round(s.pos)) onOpen(i);
          s.target = i;
        } else {
          s.target = Math.round(s.pos);
        }
      } else {
        s.target = Math.max(0, Math.min(n - 1, Math.round(s.pos - s.vel * 3.2)));
      }
      kick.current();
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 4) return;
      e.preventDefault();
      const s = state.current;
      s.target = Math.max(0, Math.min(n - 1, Math.round(s.target + Math.sign(e.deltaX))));
      kick.current();
    };
    const onResize = () => {
      g = geometry();
      paint();
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    paint();
    // a focusIndex set before this effect ran (e.g. on first render) still needs to animate in
    if (state.current.pos !== state.current.target) kick.current();

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, [n, onOpen]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(active);
    }
  };

  return (
    <div className="cc" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={stageRef}
        className="cc-stage"
        tabIndex={0}
        onKeyDown={onKey}
        aria-label={`${label}: use the left and right arrow keys, Enter opens the card`}
        data-cursor="drag"
      >
        {items.map((item, i) => (
          <div
            key={getKey(item)}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="cc-card"
            data-cc-index={i}
            aria-hidden={i !== active}
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      <div className="cc-controls">
        <button type="button" className="icon-btn" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous project">
          <Icon name="arrow-left" />
        </button>
        <p className="cc-status" aria-live="polite">
          <span className="cc-count">
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <span className="cc-name">{getLabel(items[active])}</span>
        </p>
        <button type="button" className="icon-btn" onClick={() => go(active + 1)} disabled={active === n - 1} aria-label="Next project">
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  );
}
