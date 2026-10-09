import type { LinkKind, ProjectLink } from "../data/content";
import { Icon, type IconName } from "./Icon";

const iconFor: Record<LinkKind, IconName> = {
  live: "live",
  video: "play",
  code: "github",
  kaggle: "kaggle",
  design: "figma",
  doc: "file",
  paper: "file",
};

export function visibleLinks(links: ProjectLink[]) {
  return links.filter((l) => l.href.trim() !== "");
}

export function ProjectLinks({ links, size = "md", showNotes = false }: { links: ProjectLink[]; size?: "sm" | "md"; showNotes?: boolean }) {
  const shown = visibleLinks(links);
  if (shown.length === 0) return null;
  return (
    <div className="plinks">
      <ul className="plinks-row">
        {shown.map((l) => (
          <li key={l.kind + l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`btn ${l.kind === "live" ? "btn-accent" : "btn-ghost"}${size === "sm" ? " btn-sm" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name={iconFor[l.kind]} />
              {l.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      {showNotes
        ? shown
            .filter((l) => l.note)
            .map((l) => (
              <p key={l.href} className="plink-note">
                {l.label}: {l.note}
              </p>
            ))
        : null}
    </div>
  );
}
