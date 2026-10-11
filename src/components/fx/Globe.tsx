import { useEffect, useRef } from "react";
import { LAND_BITS, LAND_COLS, LAND_ROWS } from "../../data/landmask";

export interface GlobeMarker {
  lat: number;
  lon: number;
  label: string;
}

interface GlobeProps {
  markers: GlobeMarker[];
  /** pairs of marker indexes */
  arcs: [number, number][];
  className?: string;
  label: string;
}

type V3 = [number, number, number];

const toVec = (lat: number, lon: number): V3 => {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

let landCache: Float32Array | null = null;
function landPoints() {
  if (landCache) return landCache;
  const bytes = Uint8Array.from(atob(LAND_BITS), (c) => c.charCodeAt(0));
  const pts: number[] = [];
  for (let r = 0; r < LAND_ROWS; r++) {
    const lat = 90 - ((r + 0.5) / LAND_ROWS) * 180;
    // keep dots evenly spaced on the sphere: skip more columns near the poles
    const every = Math.max(1, Math.round(1 / Math.max(0.12, Math.cos((lat * Math.PI) / 180))));
    for (let c = 0; c < LAND_COLS; c += every) {
      const i = r * LAND_COLS + c;
      if (bytes[i >> 3] & (1 << (i & 7))) {
        const lon = -180 + ((c + 0.5) / LAND_COLS) * 360;
        pts.push(...toVec(lat, lon));
      }
    }
  }
  landCache = new Float32Array(pts);
  return landCache;
}

const slerp = (a: V3, b: V3, t: number): V3 => {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s;
  const k2 = Math.sin(t * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
};

/** A dotted 3D globe with animated arcs between markers. Drag to spin it. */
export function Globe({ markers, arcs, className, label }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts = landPoints();
    const count = pts.length / 3;
    const mk = markers.map((m) => toVec(m.lat, m.lon));
    const arcPaths = arcs.map(([a, b]) => {
      const A = mk[a];
      const B = mk[b];
      const ang = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
      const lift = 0.12 + ang * 0.16;
      return Array.from({ length: 72 }, (_, i) => {
        const t = i / 71;
        const p = slerp(A, B, t);
        const h = 1 + lift * Math.sin(Math.PI * t);
        return [p[0] * h, p[1] * h, p[2] * h] as V3;
      });
    });

    let w = 1;
    let h = 1;
    let dpr = 1;
    let yaw = -0.6;
    let pitch = 0.32;
    let spin = reduced ? 0 : 0.12;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const t0 = performance.now();
    const buckets: number[][] = [[], [], [], [], []];
    const shades = [0.16, 0.28, 0.42, 0.6, 0.85];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const project = (x: number, y: number, z: number, cy: number, sy: number, cp: number, sp: number) => {
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      return [x1, y2, z2] as V3;
    };

    const draw = (now: number) => {
      raf = 0;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      const time = (now - t0) / 1000;
      if (!dragging) {
        yaw += spin * dt;
        spin += ((reduced ? 0 : 0.12) - spin) * (1 - Math.exp(-dt / 1.5));
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.42;
      const cx = w / 2;
      const cyy = h / 2;

      // atmosphere
      const glow = ctx.createRadialGradient(cx, cyy, R * 0.85, cx, cyy, R * 1.35);
      glow.addColorStop(0, "rgba(139,108,255,0.28)");
      glow.addColorStop(1, "rgba(139,108,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();
      ctx.arc(cx, cyy, R, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(14,14,20,0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      for (const b of buckets) b.length = 0;
      for (let i = 0; i < count; i++) {
        const [x, y, z] = project(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2], cyw, syw, cp, sp);
        if (z < 0) continue;
        const k = Math.min(4, Math.floor(z * 5));
        buckets[k].push(cx + x * R, cyy - y * R);
      }
      const dot = Math.max(1.2, R / 150);
      for (let k = 0; k < 5; k++) {
        ctx.fillStyle = `rgba(244,240,232,${shades[k]})`;
        const b = buckets[k];
        for (let j = 0; j < b.length; j += 2) ctx.fillRect(b[j] - dot / 2, b[j + 1] - dot / 2, dot, dot);
      }

      // arcs: a faint path plus a bright comet travelling along it
      arcPaths.forEach((path, ai) => {
        const proj = path.map((p) => project(p[0], p[1], p[2], cyw, syw, cp, sp));
        ctx.lineCap = "round";
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(201,255,59,0.28)";
        ctx.beginPath();
        let pen = false;
        proj.forEach(([x, y, z]) => {
          if (z < -0.05) {
            pen = false;
            return;
          }
          if (!pen) ctx.moveTo(cx + x * R, cyy - y * R);
          else ctx.lineTo(cx + x * R, cyy - y * R);
          pen = true;
        });
        ctx.stroke();

        const head = ((time * 0.35 + ai * 0.37) % 1.4) / 1.2;
        const tail = head - 0.22;
        ctx.lineWidth = 2.4;
        for (let i = 1; i < proj.length; i++) {
          const t = i / (proj.length - 1);
          if (t < tail || t > head) continue;
          const [x0, y0, z0] = proj[i - 1];
          const [x1, y1, z1] = proj[i];
          if (z0 < -0.05 || z1 < -0.05) continue;
          const a = Math.max(0, (t - tail) / (head - tail));
          ctx.strokeStyle = `rgba(201,255,59,${0.15 + a * 0.85})`;
          ctx.beginPath();
          ctx.moveTo(cx + x0 * R, cyy - y0 * R);
          ctx.lineTo(cx + x1 * R, cyy - y1 * R);
          ctx.stroke();
        }
      });

      // markers + labels
      ctx.font = `600 ${Math.max(11, R / 18)}px "JetBrains Mono Variable", ui-monospace, monospace`;
      mk.forEach((m, i) => {
        const [x, y, z] = project(m[0], m[1], m[2], cyw, syw, cp, sp);
        if (z < 0.02) return;
        const sx = cx + x * R;
        const sy = cyy - y * R;
        const pulse = (time * 0.8 + i * 0.3) % 1;
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + pulse * 16, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,91,31,${(1 - pulse) * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ff5b1f";
        ctx.fill();
        ctx.fillStyle = `rgba(244,240,232,${Math.min(1, z * 2)})`;
        ctx.fillText(markers[i].label, sx + 10, sy - 8);
      });

      if (visible && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw += dx * 0.008;
      pitch = Math.max(-0.9, Math.min(0.9, pitch + dy * 0.006));
      spin = dx * 0.4;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const ro = new ResizeObserver(() => {
      resize();
      wake();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(canvas);
    const onVis = () => wake();
    document.addEventListener("visibilitychange", onVis);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [markers, arcs]);

  return <canvas ref={canvasRef} className={`globe${className ? ` ${className}` : ""}`} role="img" aria-label={label} data-cursor="drag" />;
}
