import { useEffect, useRef, type CSSProperties } from "react";

type Phase = "code" | "train" | "ready" | "reset";

const PHASES: { phase: Phase; ms: number }[] = [
  { phase: "code", ms: 4200 },
  { phase: "train", ms: 6000 },
  { phase: "ready", ms: 6200 },
  { phase: "reset", ms: 700 },
];
const EPOCHS = 10;

const NET: { x: number; ys: number[] }[] = [
  { x: 680, ys: [128, 150, 172] },
  { x: 740, ys: [118, 140, 162, 184] },
  { x: 808, ys: [118, 140, 162, 184] },
  { x: 868, ys: [139, 161] },
];

const lossAt = (e: number) => 0.92 * Math.exp(-0.32 * e) + 0.07;
const accAt = (e: number) => Math.min(0.97, 0.52 + 0.046 * e);

/**
 * The hero illustration: me at the desk, a notebook training a model on the left
 * half of the monitor and the model "assembling" on the right half.
 * One tiny timeline flips a data-phase attribute; CSS does all the animation
 * (opacity / transform only). The loop pauses when the hero is off-screen.
 */
export function HeroScene() {
  const svgRef = useRef<SVGSVGElement>(null);
  const epochRef = useRef<SVGTSpanElement>(null);
  const lossRef = useRef<SVGTSpanElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setPhase = (p: Phase) => svg.setAttribute("data-phase", p);
    const setEpoch = (e: number) => {
      if (epochRef.current) epochRef.current.textContent = `Epoch ${e}/${EPOCHS}`;
      if (lossRef.current) lossRef.current.textContent = `loss ${lossAt(e).toFixed(3)} · acc ${accAt(e).toFixed(2)}`;
    };

    if (reduced) {
      setPhase("ready");
      setEpoch(EPOCHS);
      return;
    }

    let idx = 0;
    let phaseTimer = 0;
    let epochTimer = 0;
    let running = false;

    const run = () => {
      const { phase, ms } = PHASES[idx];
      setPhase(phase);
      window.clearInterval(epochTimer);
      if (phase === "code") setEpoch(0);
      if (phase === "train") {
        let e = 0;
        epochTimer = window.setInterval(() => {
          e = Math.min(EPOCHS, e + 1);
          setEpoch(e);
          if (e === EPOCHS) window.clearInterval(epochTimer);
        }, ms / EPOCHS);
      }
      phaseTimer = window.setTimeout(() => {
        idx = (idx + 1) % PHASES.length;
        run();
      }, ms);
    };

    const start = () => {
      if (running) return;
      running = true;
      svg.classList.remove("is-paused");
      run();
    };
    const stop = () => {
      if (!running) return;
      running = false;
      svg.classList.add("is-paused");
      window.clearTimeout(phaseTimer);
      window.clearInterval(epochTimer);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.15 });
    io.observe(svg);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Gentle depth on desktop: layers drift with the pointer.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    const onMove = (ev: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = svg.getBoundingClientRect();
        const x = ((ev.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((ev.clientY - r.top) / r.height - 0.5) * 2;
        svg.style.setProperty("--px", Math.max(-1, Math.min(1, x)).toFixed(3));
        svg.style.setProperty("--py", Math.max(-1, Math.min(1, y)).toFixed(3));
      });
    };
    const host = svg.closest("section");
    if (fine && host) host.addEventListener("pointermove", onMove);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (fine && host) host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="scene"
      data-phase="code"
      viewBox="0 0 1000 690"
      role="img"
      aria-labelledby="scene-title scene-desc"
    >
      <title id="scene-title">Rajveer coding at his desk</title>
      <desc id="scene-desc">
        An illustration of Rajveer at a desk with a large monitor. On the left half a notebook trains a model; on the
        right half a robot assembles as training progresses, then says hello.
      </desc>

      {/* ── Back layer: wall, lamp ─────────────────────────────── */}
      <g className="layer l-back">
        <circle cx="640" cy="300" r="300" className="s-blob" />
        <path d="M60 690 H940" className="s-floor" />
        {/* pendant lamp above me */}
        <line x1="250" y1="-10" x2="250" y2="148" className="s-cord" />
        <polygon points="160,190 340,190 430,420 70,420" className="s-cone" />
        <path d="M212 150 H288 L310 190 H190 Z" className="s-shade" />
        <ellipse cx="250" cy="192" rx="22" ry="6" className="s-bulb" />
      </g>

      {/* ── Desk layer: desk, monitor, mug ─────────────────────── */}
      <g className="layer l-desk">
        {/* desk */}
        <polygon points="96,492 904,492 948,540 52,540" className="s-desk-top" />
        <rect x="52" y="540" width="896" height="18" rx="3" className="s-desk-edge" />
        <rect x="92" y="558" width="16" height="132" className="s-desk-leg" />
        <rect x="892" y="558" width="16" height="132" className="s-desk-leg" />

        {/* plant */}
        <g className="plant">
          <path d="M128 470 q-18 -30 4 -52 q6 26 -4 52Z" className="s-leaf" />
          <path d="M136 470 q4 -40 30 -50 q-6 30 -30 50Z" className="s-leaf s-leaf-2" />
          <path d="M132 470 q-30 -12 -38 -36 q26 6 38 36Z" className="s-leaf s-leaf-2" />
          <path d="M112 468 h44 l-6 30 h-32 Z" className="s-pot" />
        </g>

        {/* monitor stand */}
        <rect x="610" y="440" width="40" height="58" className="s-stand" />
        <rect x="564" y="494" width="132" height="10" rx="5" className="s-stand" />

        {/* monitor */}
        <rect x="330" y="68" width="600" height="374" rx="14" className="s-bezel" />
        <rect x="343" y="81" width="574" height="338" rx="6" className="s-screen" />
        <circle cx="630" cy="431" r="3" className="s-led" />

        {/* sticky note */}
        <g transform="rotate(5 892 70)">
          <rect x="858" y="46" width="70" height="54" className="s-note" />
          <text x="866" y="70" className="s-note-text">ship it</text>
          <text x="866" y="88" className="s-note-text">p ≥ 0.70</text>
        </g>

        {/* LEFT HALF: notebook training a model */}
        <g className="pane-left">
          <rect x="343" y="81" width="286" height="22" className="s-bar" />
          <circle cx="356" cy="92" r="3.5" fill="#ff6b6b" />
          <circle cx="368" cy="92" r="3.5" fill="#ffd166" />
          <circle cx="380" cy="92" r="3.5" fill="#06d6a0" />
          <text x="394" y="96" className="s-tab">train_model.ipynb</text>
          <text x="590" y="96" className="s-tab s-kernel">● py3</text>

          <g className="code">
            <text x="350" y="124" className="s-prompt">[1]</text>
            <text x="350" y="162" className="s-prompt">[2]</text>
            <text x="350" y="200" className="s-prompt">[3]</text>

            <text x="374" y="124" className="code-line" style={{ "--i": 0 } as CSSProperties}>
              <tspan className="k">import</tspan> torch, torch.nn <tspan className="k">as</tspan> nn
            </text>
            <text x="374" y="139" className="code-line" style={{ "--i": 1 } as CSSProperties}>
              <tspan className="k">from</tspan> data <tspan className="k">import</tspan> <tspan className="f">load_reviews</tspan>
            </text>
            <text x="374" y="162" className="code-line" style={{ "--i": 2 } as CSSProperties}>
              model = <tspan className="f">Transformer</tspan>(d=<tspan className="n">512</tspan>, heads=<tspan className="n">8</tspan>)
            </text>
            <text x="374" y="177" className="code-line" style={{ "--i": 3 } as CSSProperties}>
              opt = <tspan className="f">AdamW</tspan>(model.<tspan className="f">parameters</tspan>(), <tspan className="n">3e-4</tspan>)
            </text>
            <text x="374" y="200" className="code-line" style={{ "--i": 4 } as CSSProperties}>
              <tspan className="k">for</tspan> epoch <tspan className="k">in</tspan> <tspan className="f">range</tspan>(<tspan className="n">10</tspan>):
            </text>
            <text x="374" y="215" className="code-line" style={{ "--i": 5 } as CSSProperties}>
              {"    "}loss = <tspan className="f">train_step</tspan>(model, batch)
            </text>
            <text x="374" y="230" className="code-line" style={{ "--i": 6 } as CSSProperties}>
              {"    "}<tspan className="f">log</tspan>(epoch, loss)<tspan className="caret">▍</tspan>
            </text>
          </g>

          {/* output: epoch + progress bar */}
          <g className="output">
            <rect x="350" y="242" width="270" height="168" rx="4" className="s-out" />
            <text x="362" y="262" className="s-out-text">
              <tspan ref={epochRef}>Epoch 0/10</tspan>
            </text>
            <text x="608" y="262" className="s-out-text s-out-dim" textAnchor="end">
              <tspan ref={lossRef}>loss 0.990 · acc 0.52</tspan>
            </text>
            <rect x="362" y="272" width="246" height="6" rx="3" className="s-track" />
            <rect x="362" y="272" width="246" height="6" rx="3" className="progress" />

            {/* loss curve */}
            <path d="M366 296 V398 H606" className="s-axis" />
            <path d="M366 312 C 410 318, 430 360, 470 372 S 560 392, 604 394" pathLength={1} className="loss-curve" />
            <text x="372" y="306" className="s-axis-label">loss ↓</text>
          </g>
        </g>

        <line x1="630" y1="81" x2="630" y2="419" className="s-divider" />

        {/* RIGHT HALF: the model taking shape */}
        <g className="pane-right">
          <rect x="631" y="81" width="286" height="22" className="s-bar" />
          <text x="644" y="96" className="s-tab">model.generate()</text>
          <text x="904" y="96" textAnchor="end" className="s-status s-status-train">training…</text>
          <text x="904" y="96" textAnchor="end" className="s-status s-status-ready">ready ✓</text>

          {/* neural net */}
          <g className="net">
            {NET.slice(0, -1).flatMap((layer, col) =>
              layer.ys.flatMap((y) =>
                NET[col + 1].ys.map((y2) => (
                  <line key={`${col}-${y}-${y2}`} x1={layer.x} y1={y} x2={NET[col + 1].x} y2={y2} className="net-edge" />
                )),
              ),
            )}
            {NET.flatMap((layer, col) =>
              layer.ys.map((y) => (
                <g key={`n-${col}-${y}`}>
                  <circle cx={layer.x} cy={y} r="6" className="net-node" />
                  <circle cx={layer.x} cy={y} r="6" className="net-lit" style={{ "--c": col } as CSSProperties} />
                </g>
              )),
            )}
          </g>

          {/* speech bubble (replaces the net once ready) */}
          <g className="bubble">
            <path d="M650 116 h250 a10 10 0 0 1 10 10 v44 a10 10 0 0 1 -10 10 h-112 l-14 14 l-2 -14 h-122 a10 10 0 0 1 -10 -10 v-44 a10 10 0 0 1 10 -10z" className="s-bubble" />
            <text x="666" y="142" className="s-bubble-text">Hi! I'm the model Rajveer</text>
            <text x="666" y="160" className="s-bubble-text">just trained. Scroll to meet him ↓</text>
          </g>

          {/* robot */}
          <g className="robot">
            <rect x="714" y="218" width="120" height="100" rx="28" pathLength={1} className="r-wire" />
            <g className="r-part" style={{ "--i": 0 } as CSSProperties}>
              <path d="M700 372 C700 344 722 330 744 330 H804 C826 330 848 344 848 372 Z" className="r-body" />
              <rect x="760" y="316" width="28" height="16" className="r-neck" />
            </g>
            <g className="r-part" style={{ "--i": 1 } as CSSProperties}>
              <rect x="702" y="250" width="14" height="36" rx="6" className="r-ear" />
              <rect x="832" y="250" width="14" height="36" rx="6" className="r-ear" />
            </g>
            <g className="r-part" style={{ "--i": 2 } as CSSProperties}>
              <rect x="714" y="218" width="120" height="100" rx="28" className="r-head" />
            </g>
            <g className="r-part" style={{ "--i": 3 } as CSSProperties}>
              <rect x="730" y="242" width="88" height="44" rx="20" className="r-visor" />
            </g>
            <g className="r-part" style={{ "--i": 4 } as CSSProperties}>
              <line x1="774" y1="218" x2="774" y2="198" className="r-antenna" />
              <circle cx="774" cy="193" r="6" className="r-bulb" />
            </g>
            <g className="r-eyes">
              <ellipse cx="756" cy="264" rx="8" ry="8" className="r-eye" />
              <ellipse cx="792" cy="264" rx="8" ry="8" className="r-eye" />
            </g>
            <path d="M762 300 q12 8 24 0" className="r-smile" />
          </g>

          {/* voice waveform */}
          <g className="wave">
            {Array.from({ length: 17 }, (_, i) => {
              const h = [6, 10, 16, 22, 14, 26, 18, 30, 20, 28, 16, 24, 12, 20, 14, 9, 6][i];
              return (
                <rect
                  key={i}
                  x={698 + i * 9}
                  y={392 - h / 2}
                  width="5"
                  height={h}
                  rx="2.5"
                  className="wave-bar"
                  style={{ "--d": `${(i % 5) * 90}ms` } as CSSProperties}
                />
              );
            })}
          </g>
        </g>

        {/* keyboard + mouse */}
        <polygon points="392,504 578,504 588,528 382,528" className="s-keyboard" />
        <path d="M392 512 H580 M388 520 H584" className="s-keys" />
        <ellipse cx="616" cy="520" rx="12" ry="7" className="s-mouse" />

        {/* coffee */}
        <g className="coffee">
          <path d="M862 448 q-8 -10 0 -20 q8 -10 0 -20" className="steam" style={{ "--d": "0s" } as CSSProperties} />
          <path d="M876 448 q-8 -10 0 -20 q8 -10 0 -20" className="steam" style={{ "--d": "0.7s" } as CSSProperties} />
          <path d="M890 448 q-8 -10 0 -20 q8 -10 0 -20" className="steam" style={{ "--d": "1.4s" } as CSSProperties} />
          <path d="M896 476 h6 a10 10 0 0 1 0 22 h-6" className="s-handle" />
          <rect x="852" y="462" width="46" height="50" rx="8" className="s-mug" />
          <text x="875" y="493" textAnchor="middle" className="s-mug-text">{"{ }"}</text>
        </g>
      </g>

      {/* ── Front layer: me on the chair ───────────────────────── */}
      <g className="layer l-front">
        {/* left arm (mostly behind the body) */}
        <path d="M196 436 Q300 500 414 514" className="s-arm s-arm-back" />
        {/* torso / hoodie */}
        <path d="M168 610 L164 474 C164 420 200 394 240 390 L280 390 C326 394 352 422 354 474 L350 610 Z" className="s-hoodie" />
        <path d="M216 392 C230 410 290 410 304 392 C292 384 228 384 216 392 Z" className="s-hood" />
        {/* right arm */}
        <path d="M336 424 Q376 452 398 488 L446 510" className="s-arm" />
        {/* hands typing */}
        <ellipse cx="420" cy="514" rx="13" ry="7" className="s-skin hand hand-l" />
        <ellipse cx="452" cy="511" rx="13" ry="7" className="s-skin hand hand-r" />
        {/* neck + head */}
        <rect x="240" y="352" width="28" height="40" rx="8" className="s-skin-dark" />
        <circle cx="254" cy="318" r="44" className="s-skin" />
        <ellipse cx="298" cy="326" rx="6" ry="10" className="s-skin" />
        {/* seen from behind: hair covers most of the head, only the jaw and ear show */}
        <path
          d="M210 318 C208 280 230 266 256 266 C286 266 302 290 299 318 C296 330 290 336 284 340 C276 336 268 340 262 348 C250 360 228 356 218 344 C212 336 210 328 210 318 Z"
          className="s-hair"
        />
        {/* headphones */}
        <path d="M206 318 C204 276 230 258 254 258 C282 258 304 278 302 318" className="s-phones-band" />
        <rect x="292" y="304" width="16" height="30" rx="7" className="s-phones" />
        <rect x="198" y="306" width="14" height="28" rx="6" className="s-phones" />
        {/* chair back over the lower body */}
        <rect x="146" y="452" width="226" height="150" rx="40" className="s-chair" />
        <rect x="248" y="600" width="18" height="44" className="s-chair-post" />
        <path d="M180 660 L257 640 L334 660" className="s-chair-base" />
        <circle cx="180" cy="666" r="8" className="s-wheel" />
        <circle cx="257" cy="660" r="8" className="s-wheel" />
        <circle cx="334" cy="666" r="8" className="s-wheel" />
      </g>
    </svg>
  );
}
