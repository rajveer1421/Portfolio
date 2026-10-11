import { useEffect, useRef } from "react";

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  flip: number;
  vf: number;
  wob: number;
  color: string;
  life: number;
}

const COLORS = ["#ff5b1f", "#c9ff3b", "#8b6cff", "#e8b33c", "#f4f0e8", "#ff8a57"];
const MAX = 260;

/**
 * Tumbling paper confetti that spills from the cursor and bursts on click.
 * Only listens while `active` (the trophy shelf is on screen); pieces already in the air finish falling.
 */
export function CelebrationCursor({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieces = useRef<Piece[]>([]);
  const raf = useRef(0);
  const runRef = useRef<() => void>(() => {});

  // drawing loop (lives for the whole component)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    let last = performance.now();

    const tick = (now: number) => {
      raf.current = 0;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const list = pieces.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.life += dt;
        p.vx *= Math.pow(0.4, dt);
        p.vy = p.vy * Math.pow(0.55, dt) + 520 * dt;
        p.x += (p.vx + Math.sin(p.life * 6 + p.wob) * 40) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.flip += p.vf * dt;
        if (p.y > window.innerHeight + 30 || p.life > 6) {
          list.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flip));
        ctx.globalAlpha = Math.min(1, (6 - p.life) / 1.2);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (list.length) raf.current = requestAnimationFrame(tick);
    };
    runRef.current = () => {
      if (!raf.current) {
        last = performance.now();
        raf.current = requestAnimationFrame(tick);
      }
    };
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      window.removeEventListener("resize", resize);
    };
  }, []);

  // spawning (only while the trophy shelf is visible)
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spawn = (x: number, y: number, n: number, power: number) => {
      const list = pieces.current;
      for (let i = 0; i < n && list.length < MAX; i++) {
        const a = power > 200 ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const sp = power * (0.35 + Math.random() * 0.65);
        list.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - (power > 200 ? 160 : 40),
          w: 6 + Math.random() * 7,
          h: 3 + Math.random() * 5,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 12,
          flip: Math.random() * Math.PI,
          vf: 4 + Math.random() * 8,
          wob: Math.random() * 10,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          life: 0,
        });
      }
      runRef.current();
    };
    let lx = -1;
    let ly = -1;
    let travel = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (lx >= 0) travel += Math.hypot(e.clientX - lx, e.clientY - ly);
      lx = e.clientX;
      ly = e.clientY;
      if (travel > 26) {
        travel = 0;
        spawn(e.clientX, e.clientY, 2, 120);
      }
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("dialog")) return;
      spawn(e.clientX, e.clientY, 70, 620);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />;
}
