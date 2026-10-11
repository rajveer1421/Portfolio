import { useRef, type CSSProperties, type ReactNode } from "react";

interface ChromaCardProps {
  /** Optional photo: gets the RGB-split glitch on hover. */
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  className?: string;
  /** max tilt in degrees */
  tilt?: number;
  style?: CSSProperties;
}

/**
 * A card that tilts toward the pointer, with a moving glare and an RGB glitch on hover.
 * The photo is drawn as a cyan layer plus a red layer (SVG colour filters #fx-cyan / #fx-red);
 * lined up they add back to the original picture, pulled apart they glitch.
 */
export function ChromaCard({ image, imageAlt = "", children, className, tilt = 10, style }: ChromaCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - py) * tilt}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * tilt}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    });
  };
  const onEnter = () => ref.current?.classList.add("is-hover");
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.classList.remove("is-hover");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`chroma${className ? ` ${className}` : ""}`}
      style={style}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <div className="chroma-inner">
        {image ? (
          <div className="chroma-media">
            <img className="chroma-img chroma-cyan" src={image} alt={imageAlt} loading="lazy" decoding="async" />
            <img className="chroma-img chroma-red" src={image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <img className="chroma-img chroma-slice" src={image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
        ) : null}
        {children}
        <span className="chroma-glare" aria-hidden="true" />
      </div>
    </div>
  );
}

/** The SVG colour filters the chroma cards use. Render once, anywhere. */
export function ChromaFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <filter id="fx-red" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="fx-cyan" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </svg>
  );
}
