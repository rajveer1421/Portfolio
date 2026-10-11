import { heroStats, profile } from "../data/content";
import { useInView } from "../hooks/useInView";
import { CipherText } from "./fx/CipherText";
import { ShaderReveal, type VisionSpec } from "./fx/ShaderReveal";
import { SpeedNumber } from "./fx/SpeedNumber";
import { Icon } from "./Icon";

const SUMMARY =
  "I build AI where computer vision meets language: agents that catch return fraud, cameras that rebuild a dead view, models trained from scratch. Then I ship them behind real APIs.";

// What the "model" finds in /photos/hero.webp (fractions of the 1200x1600 original, origin top-left)
const VISION: VisionSpec = {
  attention: [
    { x: 0.6, y: 0.39, rx: 0.17, ry: 0.15, w: 1 },
    { x: 0.5, y: 0.322, rx: 0.055, ry: 0.04, w: 0.95 },
    { x: 0.654, y: 0.301, rx: 0.055, ry: 0.04, w: 0.95 },
    { x: 0.6, y: 0.43, rx: 0.08, ry: 0.04, w: 0.85 },
    { x: 0.852, y: 0.745, rx: 0.05, ry: 0.04, w: 0.55 },
    { x: 0.6, y: 0.15, rx: 0.16, ry: 0.08, w: 0.3 },
  ],
  boxes: [
    { x: 0.433, y: 0.181, w: 0.367, h: 0.356, label: "face 0.99", tone: "lime", caption: "match: Rajveer Gupta" },
    { x: 0.414, y: 0.258, w: 0.369, h: 0.119, label: "glasses 0.97", tone: "orange", labelAt: "left", dashed: true },
    { x: 0.808, y: 0.713, w: 0.088, h: 0.066, label: "logo 0.81", tone: "violet" },
  ],
  points: [
    [0.5, 0.322],
    [0.654, 0.301],
    [0.581, 0.386],
    [0.536, 0.433],
    [0.664, 0.419],
    [0.64, 0.508],
    [0.473, 0.406],
    [0.763, 0.375],
    [0.579, 0.316],
  ],
  links: [
    [0, 8], [8, 1], [8, 2], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5], [6, 0], [6, 3], [7, 1], [7, 4], [6, 5], [5, 7],
  ],
};

export function Hero({ ready }: { ready: boolean }) {
  const [statsRef, statsIn] = useInView<HTMLUListElement>({ once: true, threshold: 0.4 });

  return (
    <section id="top" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-glow hero-glow-a" />
        <span className="hero-glow hero-glow-b" />
        <span className="hero-grid-lines" />
      </div>

      <div className="wrap hero-layout">
        <div className={`hero-media${ready ? " is-in" : ""}`}>
          <div className="hero-frame">
            <ShaderReveal
              src="/photos/hero.webp"
              vision={VISION}
              alt="Rajveer Gupta in glasses and a striped shirt. Hovering shows how a computer-vision model sees the photo: an attention heatmap, a face box, landmarks and labels."
            />
            <span className="hero-tag hero-tag-tl">RG · 2026</span>
            <span className="hero-tag hero-tag-tr">IIIT Nagpur</span>
            <span className="hero-tag hero-tag-br">
              <span className="hero-tag-dot" />
              <span className="hint-fine">hover to see what the model sees</span>
              <span className="hint-touch">tap to see what the model sees</span>
            </span>
          </div>
          <span className="hero-sticker" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path id="sticker-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#sticker-circle" textLength="284" lengthAdjust="spacing">
                  OPEN TO 2027 INTERNSHIPS ✦
                </textPath>
              </text>
            </svg>
            <span>✦</span>
          </span>
        </div>

        <div className="hero-copy">
          <CipherText as="p" className="hero-kicker" text="AI/ML Engineer · Researcher · Builder" start={ready} stagger={18} scramble={380} />
          <h1 className="hero-name">
            <CipherText className="hero-first" text={profile.firstName} start={ready} delay={150} stagger={55} scramble={620} hover />
            <CipherText className="hero-last" text={profile.lastName} start={ready} delay={380} stagger={55} scramble={620} hover />
          </h1>
          <CipherText as="p" className="hero-summary" text={SUMMARY} start={ready} delay={650} stagger={4} scramble={300} />

          <ul ref={statsRef} className="hero-stats">
            {heroStats.map((s) => (
              <li key={s.label}>
                <SpeedNumber value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} start={ready && statsIn} />
                <span className="stat-label">{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="hero-cta">
            <a href="#work" className="btn btn-accent">
              See my work
              <Icon name="arrow-down" />
            </a>
            <a href="#resumes" className="btn btn-ghost">
              <Icon name="file" />
              Grab a résumé
            </a>
          </div>

          <ul className="hero-socials" aria-label="Elsewhere">
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Icon name="github" />
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
            </li>
            <li>
              <a href={profile.kaggle} target="_blank" rel="noreferrer" aria-label="Kaggle">
                <Icon name="kaggle" />
              </a>
            </li>
            <li>
              <a href={profile.huggingface} target="_blank" rel="noreferrer" aria-label="Hugging Face">
                <Icon name="hf" />
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <Icon name="mail" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <a href="#about" className="hero-scroll" aria-label="Scroll to About">
        <span>scroll</span>
        <span className="hero-scroll-line" />
      </a>
    </section>
  );
}
