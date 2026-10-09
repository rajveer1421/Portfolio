import type { Award } from "../data/content";

const tones: Record<Award["tone"], { main: string; dark: string; light: string }> = {
  gold: { main: "#d9a62e", dark: "#a97b15", light: "#f3d27a" },
  silver: { main: "#b7bcc4", dark: "#868c96", light: "#e3e6ea" },
  bronze: { main: "#c07a45", dark: "#8f542a", light: "#e3a777" },
  blue: { main: "#3b5bdb", dark: "#2a44ad", light: "#91a7ff" },
  ink: { main: "#2b2b30", dark: "#141417", light: "#5a5a63" },
};

/** Little trophy drawings for the shelf. Each sits on a 100×120 box with its base at y=118. */
export function Trophy({ shape, tone }: Pick<Award, "shape" | "tone">) {
  const c = tones[tone];
  switch (shape) {
    case "cup":
      return (
        <svg viewBox="0 0 100 120" className="trophy-svg" aria-hidden="true">
          <path d="M26 22 h-12 a10 12 0 0 0 14 22" fill="none" stroke={c.dark} strokeWidth="5" />
          <path d="M74 22 h12 a10 12 0 0 1 -14 22" fill="none" stroke={c.dark} strokeWidth="5" />
          <path d="M24 14 h52 v18 a26 28 0 0 1 -52 0 Z" fill={c.main} />
          <path d="M32 18 v14 a18 20 0 0 0 8 16" fill="none" stroke={c.light} strokeWidth="4" strokeLinecap="round" />
          <rect x="44" y="58" width="12" height="22" fill={c.dark} />
          <rect x="30" y="80" width="40" height="10" rx="3" fill={c.main} />
          <rect x="22" y="90" width="56" height="28" rx="4" fill="#3a2a1d" />
          <rect x="34" y="98" width="32" height="12" rx="2" fill={c.light} opacity="0.85" />
        </svg>
      );
    case "medal":
      return (
        <svg viewBox="0 0 100 120" className="trophy-svg" aria-hidden="true">
          <path d="M30 6 L50 52 L70 6 Z" fill="#d4471f" />
          <path d="M42 6 L50 30 L58 6 Z" fill="#fffcf6" opacity="0.6" />
          <circle cx="50" cy="78" r="30" fill={c.main} />
          <circle cx="50" cy="78" r="22" fill="none" stroke={c.light} strokeWidth="3" />
          <path d="M50 64 l4.5 9 l10 1.4 l-7.2 7 l1.7 10 l-9 -4.7 l-9 4.7 l1.7 -10 l-7.2 -7 l10 -1.4 Z" fill={c.dark} />
        </svg>
      );
    case "plaque":
      return (
        <svg viewBox="0 0 100 120" className="trophy-svg" aria-hidden="true">
          <rect x="14" y="20" width="72" height="96" rx="8" fill="#5a3b26" />
          <rect x="22" y="28" width="56" height="80" rx="4" fill={c.main} />
          <circle cx="50" cy="56" r="14" fill="none" stroke={c.light} strokeWidth="4" />
          <rect x="32" y="80" width="36" height="5" rx="2" fill={c.light} />
          <rect x="38" y="90" width="24" height="5" rx="2" fill={c.light} />
        </svg>
      );
    case "scroll":
      return (
        <svg viewBox="0 0 100 120" className="trophy-svg" aria-hidden="true">
          <rect x="10" y="30" width="80" height="62" rx="4" fill="#fffcf6" stroke="#d8cfbd" strokeWidth="2" />
          <rect x="20" y="40" width="60" height="6" rx="3" fill={c.main} />
          <rect x="20" y="52" width="44" height="4" rx="2" fill="#c9bfae" />
          <rect x="20" y="61" width="52" height="4" rx="2" fill="#c9bfae" />
          <rect x="20" y="70" width="36" height="4" rx="2" fill="#c9bfae" />
          <circle cx="72" cy="80" r="11" fill="#d4471f" />
          <path d="M66 88 l-4 22 l10 -6 l10 6 l-4 -22" fill="#b03a16" />
          <rect x="6" y="92" width="88" height="26" rx="4" fill="#3a2a1d" />
          <text x="50" y="110" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="13" fill={c.light}>
            IEEE
          </text>
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 100 120" className="trophy-svg" aria-hidden="true">
          <path d="M50 8 l11 24 l26 3 l-19 18 l5 26 l-23 -13 l-23 13 l5 -26 l-19 -18 l26 -3 Z" fill={c.main} />
          <path d="M50 22 l6 13 l14 2" fill="none" stroke={c.light} strokeWidth="3" strokeLinecap="round" />
          <rect x="44" y="80" width="12" height="14" fill={c.dark} />
          <rect x="24" y="94" width="52" height="24" rx="4" fill="#3a2a1d" />
        </svg>
      );
    case "frame":
      return (
        <svg viewBox="0 0 100 120" className="trophy-svg" aria-hidden="true">
          <rect x="8" y="22" width="84" height="94" rx="4" fill={c.main} />
          <rect x="15" y="29" width="70" height="80" fill="#fffcf6" />
          <rect x="24" y="40" width="52" height="6" rx="3" fill="#ff9900" />
          <rect x="24" y="54" width="38" height="4" rx="2" fill="#c9bfae" />
          <rect x="24" y="63" width="46" height="4" rx="2" fill="#c9bfae" />
          <path d="M28 86 q22 12 44 0" fill="none" stroke="#ff9900" strokeWidth="4" strokeLinecap="round" />
          <path d="M66 82 l7 4 l-3 7" fill="none" stroke="#ff9900" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
