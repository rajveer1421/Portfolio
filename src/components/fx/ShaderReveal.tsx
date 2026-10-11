import { useEffect, useRef, useState } from "react";

type Tone = "lime" | "orange" | "violet";

/** What the "model" finds in the photo. Every position is a fraction of the photo (0–1, origin top-left). */
export interface VisionSpec {
  /** blobs of attention: centre, radii and strength (0–1); up to 6 */
  attention: { x: number; y: number; rx: number; ry: number; w: number }[];
  boxes: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    tone: Tone;
    /** where the label tag sits: above the box (default) or to its left */
    labelAt?: "top" | "left";
    /** a second tag under the box */
    caption?: string;
    dashed?: boolean;
  }[];
  /** face landmarks */
  points: [number, number][];
  /** pairs of point indices joined into a mesh */
  links: [number, number][];
}

interface ShaderRevealProps {
  src: string;
  alt: string;
  vision: VisionSpec;
  /** brush radius in CSS px */
  radius?: number;
  /** seconds the trail takes to close again */
  linger?: number;
  className?: string;
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}`;

// Paints the cursor trail (plus click bursts and the intro scan line) into a mask that slowly drifts and fades.
const MASK_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uRes;
uniform vec2 uA;
uniform vec2 uB;
uniform float uR;
uniform float uStrength;
uniform float uDecay;
uniform float uTime;
uniform vec3 uBurst;
uniform vec4 uScan;
${NOISE}
float seg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 px = vUv * uRes;
  vec2 flow = vec2(vnoise(vUv * 4.0 + uTime * 0.15), vnoise(vUv * 4.0 + vec2(7.3, 1.1) - uTime * 0.15)) - 0.5;
  float prev = texture2D(uPrev, vUv + flow * 2.4 / uRes).r;
  prev = max(prev - uDecay, 0.0);
  float d = seg(px, uA, uB);
  float brush = (1.0 - smoothstep(uR * 0.3, uR, d)) * uStrength;
  float burst = 0.0;
  if (uBurst.z > 0.0) {
    float bd = abs(length(px - uBurst.xy) - uBurst.z);
    burst = (1.0 - smoothstep(0.0, uR * 0.7, bd)) * 0.95;
  }
  float scan = 0.0;
  if (uScan.z > 0.0) {
    float y = px.y + (vnoise(vec2(px.x * 0.03, uTime * 2.0)) - 0.5) * uScan.w * 0.8;
    float d = max(max(min(uScan.x, uScan.y) - y, y - max(uScan.x, uScan.y)), 0.0);
    scan = (1.0 - smoothstep(uScan.w * 0.3, uScan.w, d)) * uScan.z;
  }
  gl_FragColor = vec4(max(prev, max(max(brush, burst), scan)), 0.0, 0.0, 1.0);
}`;

// Shows the photo, and inside the mask the model's view of it: patch attention, edges and detections.
const VIEW_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uBase;
uniform sampler2D uOverlay;
uniform sampler2D uMask;
uniform vec2 uScale;
uniform vec2 uTexel;
uniform vec2 uRes;
uniform vec2 uMaskRes;
uniform float uTime;
uniform float uIntro;
uniform vec3 uRim;
uniform vec4 uSpot[6];
uniform float uSpotW[6];
${NOISE}
vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }
float luma(vec2 uv) { return dot(texture2D(uBase, uv).rgb, vec3(0.299, 0.587, 0.114)); }
float attention(vec2 p) {
  float a = 0.0;
  for (int i = 0; i < 6; i++) {
    vec2 d = (p - uSpot[i].xy) / uSpot[i].zw;
    a = max(a, uSpotW[i] * exp(-dot(d, d)));
  }
  return a;
}
// violet -> orange -> lime, the site's palette as a heatmap
vec3 heat(float h) {
  vec3 c = mix(vec3(0.03, 0.04, 0.12), vec3(0.545, 0.424, 1.0), smoothstep(0.04, 0.4, h));
  c = mix(c, vec3(1.0, 0.357, 0.122), smoothstep(0.38, 0.72, h));
  return mix(c, vec3(0.79, 1.0, 0.23), smoothstep(0.74, 1.0, h));
}
void main() {
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  float m = texture2D(uMask, vUv).r;
  float n = fbm(vUv * asp * 5.0 + vec2(uTime * 0.25, -uTime * 0.18));
  float t = smoothstep(0.38, 0.62, m * 1.15 + (n - 0.5) * 0.55);
  vec2 e = 1.5 / uMaskRes;
  float mx = texture2D(uMask, vUv + vec2(e.x, 0.0)).r - texture2D(uMask, vUv - vec2(e.x, 0.0)).r;
  float my = texture2D(uMask, vUv + vec2(0.0, e.y)).r - texture2D(uMask, vUv - vec2(0.0, e.y)).r;
  vec2 g = vec2(mx, my);
  vec3 photo = texture2D(uBase, cover(vUv + g * 0.03, uScale)).rgb;

  // the model's view, slightly refracted at the edge of the trail
  vec2 uv = cover(vUv - g * 0.06, uScale);
  vec2 ip = vec2(uv.x, 1.0 - uv.y);
  // ViT-style square patches: attention is mostly decided per patch
  vec2 grid = vec2(22.0, 22.0 * uTexel.x / uTexel.y);
  vec2 cell = (floor(ip * grid) + 0.5) / grid;
  float att = mix(attention(ip), attention(cell), 0.6);
  vec2 f = fract(ip * grid);
  float gridLine = 1.0 - smoothstep(0.0, 0.05, min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)));
  // Sobel edges on brightness
  vec2 o = uTexel * 1.5;
  float tl = luma(uv + vec2(-o.x, o.y));
  float tc = luma(uv + vec2(0.0, o.y));
  float tr = luma(uv + o);
  float ml = luma(uv - vec2(o.x, 0.0));
  float mr = luma(uv + vec2(o.x, 0.0));
  float bl = luma(uv - o);
  float bc = luma(uv - vec2(0.0, o.y));
  float br = luma(uv + vec2(o.x, -o.y));
  float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
  float gy = (tl + 2.0 * tc + tr) - (bl + 2.0 * bc + br);
  float edge = smoothstep(0.3, 0.9, length(vec2(gx, gy)));
  float L = luma(uv);
  vec3 dim = vec3(L) * vec3(0.32, 0.36, 0.44);
  // the heat is shaded by the photo's brightness, so eyes, glasses and beard still read through it
  vec3 vis = mix(dim, heat(att) * (0.3 + 0.8 * L) + dim * 0.35, smoothstep(0.04, 0.65, att) * 0.8);
  vis = mix(vis, vec3(0.79, 1.0, 0.23), edge * 0.3 * (1.0 - 0.6 * att));
  vis += vec3(0.79, 1.0, 0.23) * gridLine * 0.06;
  vis *= 0.9 + 0.1 * sin(gl_FragCoord.y * 1.7);
  vec4 ov = texture2D(uOverlay, uv);
  vis = mix(vis, ov.rgb, ov.a);

  // a thin glowing edge, even while a long trail fades out
  float rim = pow(4.0 * t * (1.0 - t), 3.0);
  vec3 col = mix(photo, vis, t) + uRim * rim * 0.7;
  float intro = smoothstep(0.0, 1.0, uIntro * 1.5 - n * 0.5);
  col = mix(vec3(0.035), col, intro);
  gl_FragColor = vec4(col, 1.0);
}`;

const MASK_SCALE = 0.5;
const RIM = [201 / 255, 255 / 255, 59 / 255];
const SPOTS = 6;
const TONES: Record<Tone, string> = { lime: "#c9ff3b", orange: "#ff5b1f", violet: "#8b6cff" };
const MONO = `"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace`;

/** Draws the detections (boxes, tags, landmark mesh) on a transparent canvas the size of the photo. */
function drawOverlay(spec: VisionSpec, w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const u = w / 1000; // sizes are tuned for a 1000px-wide photo
  const P = (p: [number, number]) => [p[0] * w, p[1] * h] as const;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(201, 255, 59, 0.55)";
  ctx.lineWidth = 2 * u;
  ctx.beginPath();
  for (const [a, b] of spec.links) {
    const [ax, ay] = P(spec.points[a]);
    const [bx, by] = P(spec.points[b]);
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
  }
  ctx.stroke();
  for (const p of spec.points) {
    const [x, y] = P(p);
    ctx.beginPath();
    ctx.arc(x, y, 8 * u, 0, Math.PI * 2);
    ctx.strokeStyle = TONES.lime;
    ctx.lineWidth = 2.5 * u;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 3.5 * u, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  const tagH = 34 * u;
  ctx.font = `600 ${20 * u}px ${MONO}`;
  ctx.textBaseline = "middle";
  const tag = (text: string, x: number, y: number, color: string, filled: boolean, alignRight = false) => {
    const tw = ctx.measureText(text).width + 20 * u;
    const left = alignRight ? x - tw : x;
    ctx.fillStyle = filled ? color : "rgba(9, 9, 11, 0.85)";
    ctx.beginPath();
    ctx.roundRect(left, y, tw, tagH, 6 * u);
    ctx.fill();
    if (!filled) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 * u;
      ctx.stroke();
    }
    ctx.fillStyle = filled ? "#0a0a0a" : color;
    ctx.fillText(text, left + 10 * u, y + tagH / 2 + u);
  };

  for (const b of spec.boxes) {
    const color = TONES[b.tone];
    const x = b.x * w;
    const y = b.y * h;
    const bw = b.w * w;
    const bh = b.h * h;
    ctx.strokeStyle = color;
    if (b.dashed) {
      ctx.setLineDash([10 * u, 8 * u]);
      ctx.lineWidth = 2.5 * u;
      ctx.strokeRect(x, y, bw, bh);
      ctx.setLineDash([]);
    } else {
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1.5 * u;
      ctx.strokeRect(x, y, bw, bh);
      ctx.globalAlpha = 1;
      // corner brackets
      const k = Math.min(bw, bh) * 0.2;
      ctx.lineWidth = 5 * u;
      ctx.beginPath();
      ctx.moveTo(x, y + k);
      ctx.lineTo(x, y);
      ctx.lineTo(x + k, y);
      ctx.moveTo(x + bw - k, y);
      ctx.lineTo(x + bw, y);
      ctx.lineTo(x + bw, y + k);
      ctx.moveTo(x + bw, y + bh - k);
      ctx.lineTo(x + bw, y + bh);
      ctx.lineTo(x + bw - k, y + bh);
      ctx.moveTo(x + k, y + bh);
      ctx.lineTo(x, y + bh);
      ctx.lineTo(x, y + bh - k);
      ctx.stroke();
    }
    if (b.labelAt === "left") tag(b.label, x - 8 * u, y, color, true, true);
    else tag(b.label, x, y - tagH - 8 * u, color, true);
    if (b.caption) tag(b.caption, x, y + bh + 10 * u, color, false);
  }
  return c;
}

/**
 * A liquid cursor trail that shows how a computer-vision model sees the photo: patch attention,
 * edges, a face box and landmarks. Falls back to a hover overlay without WebGL or with reduced motion.
 */
export function ShaderReveal({ src, alt, vision, radius = 170, linger = 1.4, className }: ShaderRevealProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "gl" | "fallback">("loading");
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);

  // without WebGL: a still picture of the detections, shown on hover over a darkened photo
  useEffect(() => {
    if (mode !== "fallback") return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      document.fonts?.load(`600 20px ${MONO}`).catch(() => {}).finally(() => {
        if (!cancelled) setOverlayUrl(drawOverlay(vision, 1000, Math.round((1000 * img.naturalHeight) / img.naturalWidth)).toDataURL());
      });
    };
    img.src = src;
    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [mode, src, vision]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMode("fallback");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "reveal-canvas";
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
    if (!gl) {
      setMode("fallback");
      return;
    }
    host.appendChild(canvas);

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
      return sh;
    };
    const link = (frag: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(p, 0, "aPos");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
      return p;
    };

    let maskProg: WebGLProgram;
    let viewProg: WebGLProgram;
    try {
      maskProg = link(MASK_FRAG);
      viewProg = link(VIEW_FRAG);
    } catch {
      canvas.remove();
      setMode("fallback");
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uni = (p: WebGLProgram, names: string[]) =>
      Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)])) as Record<string, WebGLUniformLocation | null>;
    const mu = uni(maskProg, ["uPrev", "uRes", "uA", "uB", "uR", "uStrength", "uDecay", "uTime", "uBurst", "uScan"]);
    const vu = uni(viewProg, ["uBase", "uOverlay", "uMask", "uScale", "uTexel", "uRes", "uMaskRes", "uTime", "uIntro", "uRim", "uSpot[0]", "uSpotW[0]"]);

    // attention blobs, converted to the shader's layout (padded to SPOTS entries)
    const spots = new Float32Array(SPOTS * 4);
    const weights = new Float32Array(SPOTS);
    vision.attention.slice(0, SPOTS).forEach((s, i) => {
      spots.set([s.x, s.y, s.rx, s.ry], i * 4);
      weights[i] = s.w;
    });
    for (let i = vision.attention.length; i < SPOTS; i++) spots.set([0, 0, 1, 1], i * 4);

    const makeTex = () => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    const photo = { tex: makeTex(), w: 1, h: 1, ready: false };
    // detections start empty and are drawn once the photo size and the label font are known
    const overlayTex = makeTex();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));

    let disposed = false;
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, photo.tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      photo.w = image.naturalWidth;
      photo.h = image.naturalHeight;
      photo.ready = true;
      introStart = performance.now();
      setMode("gl");
      wake();
      document.fonts?.load(`600 20px ${MONO}`).catch(() => {}).finally(() => {
        if (disposed) return;
        const ow = Math.min(1200, photo.w);
        const ov = drawOverlay(vision, ow, Math.round((ow * photo.h) / photo.w));
        gl.bindTexture(gl.TEXTURE_2D, overlayTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ov);
        wake();
      });
    };
    image.src = src;

    // ping-pong mask targets
    type Target = { tex: WebGLTexture; fb: WebGLFramebuffer; w: number; h: number };
    const makeTarget = (w: number, h: number): Target => {
      const tex = makeTex();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tex, fb, w, h };
    };
    const dropTarget = (t: Target) => {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fb);
    };
    let targets: [Target, Target] = [makeTarget(2, 2), makeTarget(2, 2)];

    let cssW = 1;
    let cssH = 1;
    const layout = () => {
      cssW = Math.max(1, host.clientWidth);
      cssH = Math.max(1, host.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      const mw = Math.max(2, Math.round(cssW * MASK_SCALE));
      const mh = Math.max(2, Math.round(cssH * MASK_SCALE));
      if (mw !== targets[0].w || mh !== targets[0].h) {
        targets.forEach(dropTarget);
        targets = [makeTarget(mw, mh), makeTarget(mw, mh)];
      }
    };

    const coverScale = (iw: number, ih: number): [number, number] => {
      const ca = cssW / cssH;
      const ia = iw / ih;
      return ca > ia ? [1, ia / ca] : [ca / ia, 1];
    };

    // pointer + brush state (CSS px, origin top-left)
    const pointer = { x: cssW * 0.5, y: cssH * 0.4, inside: false };
    const brush = { x: pointer.x, y: pointer.y, px: pointer.x, py: pointer.y };
    let presence = 0;
    let burst: { x: number; y: number; start: number } | null = null;
    let introStart = 0;
    let lastActive = performance.now();
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const t0 = performance.now();
    const SCAN_DELAY = 700;
    const SCAN_MS = 1700;
    let scanPrevY: number | null = null;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      const time = (now - t0) / 1000;

      const follow = 1 - Math.exp(-dt / 0.04);
      brush.x += (pointer.x - brush.x) * follow;
      brush.y += (pointer.y - brush.y) * follow;
      presence += ((pointer.inside ? 1 : 0) - presence) * (1 - Math.exp(-dt / 0.2));

      // one scan line sweeps down the photo after it appears, so people see there is something to find
      const scanK = introStart ? (now - introStart - SCAN_DELAY) / SCAN_MS : -1;
      const scanning = scanK >= 0 && scanK < 1;
      if (scanning || burst || pointer.inside) lastActive = now;

      const s = MASK_SCALE;
      const [mA, mB] = targets;
      gl.useProgram(maskProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, mB.fb);
      gl.viewport(0, 0, mB.w, mB.h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, mA.tex);
      gl.uniform1i(mu.uPrev, 0);
      gl.uniform2f(mu.uRes, mB.w, mB.h);
      gl.uniform2f(mu.uA, brush.px * s, (cssH - brush.py) * s);
      gl.uniform2f(mu.uB, brush.x * s, (cssH - brush.y) * s);
      gl.uniform1f(mu.uR, radius * s * (0.55 + 0.45 * presence));
      gl.uniform1f(mu.uStrength, presence);
      gl.uniform1f(mu.uDecay, Math.max(dt / linger, 1.5 / 255));
      gl.uniform1f(mu.uTime, time);
      if (burst) {
        const k = (now - burst.start) / 900;
        if (k >= 1) burst = null;
        else gl.uniform3f(mu.uBurst, burst.x * s, (cssH - burst.y) * s, Math.max(cssW, cssH) * s * k);
      }
      if (!burst) gl.uniform3f(mu.uBurst, 0, 0, 0);
      if (scanning) {
        const y = (cssH - cssH * (-0.15 + 1.3 * scanK)) * s;
        gl.uniform4f(mu.uScan, scanPrevY ?? y, y, Math.min(1, scanK * 8, (1 - scanK) * 8) * 0.95, cssH * 0.09 * s);
        scanPrevY = y;
      } else gl.uniform4f(mu.uScan, 0, 0, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      targets = [mB, mA];
      brush.px = brush.x;
      brush.py = brush.y;

      gl.useProgram(viewProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, photo.tex);
      gl.uniform1i(vu.uBase, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, overlayTex);
      gl.uniform1i(vu.uOverlay, 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, targets[0].tex);
      gl.uniform1i(vu.uMask, 2);
      gl.uniform2fv(vu.uScale, coverScale(photo.w, photo.h));
      gl.uniform2f(vu.uTexel, 1 / photo.w, 1 / photo.h);
      gl.uniform2f(vu.uRes, canvas.width, canvas.height);
      gl.uniform2f(vu.uMaskRes, targets[0].w, targets[0].h);
      gl.uniform1f(vu.uTime, time);
      const intro = introStart ? Math.min(1, (now - introStart) / 1400) : 0;
      gl.uniform1f(vu.uIntro, intro);
      gl.uniform3fv(vu.uRim, RIM);
      gl.uniform4fv(vu["uSpot[0]"], spots);
      gl.uniform1fv(vu["uSpotW[0]"], weights);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // nothing on screen is moving any more: stop until the pointer comes back
      const settled = intro >= 1 && scanK >= 1 && now - lastActive > linger * 1000 + 600;
      if (visible && !document.hidden && !settled) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible || !photo.ready) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const locate = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      lastActive = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      locate(e);
      if (!pointer.inside) {
        pointer.inside = true;
        brush.x = brush.px = pointer.x;
        brush.y = brush.py = pointer.y;
      }
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      lastActive = performance.now();
      wake();
    };
    const onDown = (e: PointerEvent) => {
      locate(e);
      burst = { x: pointer.x, y: pointer.y, start: performance.now() };
      wake();
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    host.addEventListener("pointercancel", onLeave, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });

    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(host);
    const onVis = () => wake();
    document.addEventListener("visibilitychange", onVis);
    layout();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      host.removeEventListener("pointerdown", onDown);
      image.onload = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [src, vision, radius, linger]);

  return (
    <div ref={hostRef} className={`reveal is-${mode}${className ? ` ${className}` : ""}`} role="img" aria-label={alt}>
      <img className="reveal-img reveal-img-base" src={src} alt="" fetchPriority="high" decoding="async" />
      {overlayUrl ? <img className="reveal-img reveal-img-top" src={overlayUrl} alt="" /> : null}
    </div>
  );
}
