import type { CSSProperties } from "react";
import { proof } from "../data/content";

export function ProofStrip() {
  return (
    <div className="proof" aria-label="Highlights">
      <ul className="wrap proof-list">
        {proof.map((p, i) => (
          <li key={p.value} data-reveal style={{ "--rd": i } as CSSProperties}>
            <a href={p.href} className="proof-item">
              <span className="proof-value">{p.value}</span>
              <span className="proof-label">{p.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
