import type { CSSProperties } from "react";

interface SpeedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Rolls when this becomes true. */
  start: boolean;
  /** ms for the slowest reel */
  duration?: number;
  className?: string;
}

/**
 * Numbers that change with a speed blur: every digit is a reel that spins past
 * 0–9 a few times, blurred while it moves, and lands on the real value.
 */
export function SpeedNumber({ value, decimals = 0, prefix = "", suffix = "", start, duration = 1600, className }: SpeedNumberProps) {
  const text = `${prefix}${value.toFixed(decimals)}${suffix}`;
  const chars = [...text];
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let digitIndex = 0;

  return (
    <span className={`speed${start ? " is-rolling" : ""}${className ? ` ${className}` : ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="speed-row">
        {chars.map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span key={i} className="speed-static" style={{ "--d": `${i * 40}ms` } as CSSProperties}>
                {ch}
              </span>
            );
          }
          const fromRight = digitCount - 1 - digitIndex;
          digitIndex++;
          const loops = 1 + Math.min(fromRight, 3);
          const target = loops * 10 + Number(ch);
          const ms = duration * (0.6 + 0.4 * (fromRight / Math.max(1, digitCount - 1)));
          return (
            <span key={i} className="speed-reel">
              <span className="speed-ghost">{ch}</span>
              <span
                className="speed-strip"
                style={{ "--to": target, "--ms": `${ms}ms`, "--d": `${i * 50}ms` } as CSSProperties}
              >
                {Array.from({ length: (loops + 1) * 10 }, (_, k) => (
                  <span key={k}>{k % 10}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
