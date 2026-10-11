import type { CSSProperties, ReactNode } from "react";

/** An endless strip of words. The list is rendered twice so the loop is seamless. */
export function Marquee({
  items,
  reverse = false,
  speed = 40,
  className,
  separator = "✦",
}: {
  items: ReactNode[];
  reverse?: boolean;
  /** seconds per loop */
  speed?: number;
  className?: string;
  separator?: ReactNode;
}) {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i}>
          <span className="marquee-item">{it}</span>
          <span className="marquee-sep" aria-hidden="true">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className={`marquee${reverse ? " is-reverse" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--speed": `${speed}s` } as CSSProperties}
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
