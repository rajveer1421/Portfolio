import { useCallback, useState } from "react";
import { categoryLabels, projects, type Project } from "../data/content";
import { ChromaCard } from "./fx/ChromaCard";
import { ConcaveCarousel } from "./fx/ConcaveCarousel";
import { Icon } from "./Icon";
import { ProjectArt } from "./ProjectArt";
import { ProjectDialog } from "./ProjectDialog";
import { visibleLinks } from "./ProjectLinks";

// Memora left, ReturnGuard in the middle, Resolv right when the carousel first appears.
const ORDER = ["memora", "returnguard", "resolv", "stock-simulator", "mediguard", "pneumonia-vit", "ayursutra", "peft", "babybert", "rag-assistant", "kidney-xray", "gpt-decoder"];
const ordered: Project[] = [
  ...ORDER.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => !!p),
  ...projects.filter((p) => !ORDER.includes(p.id)),
];
const TONES = ["orange", "lime", "violet"] as const;

function FallbackArt({ project }: { project: Project }) {
  const initials = project.title
    .split(/[\s:-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="pcard-fallback" aria-hidden="true">
      <span className="pcard-initials">{initials}</span>
      <span className="pcard-cat">{categoryLabels[project.categories[0]]}</span>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const live = visibleLinks(project.links).some((l) => l.kind === "live");
  const art = ProjectArt({ id: project.id });
  return (
    <ChromaCard className={`pcard tone-${TONES[index % 3]}`} tilt={7}>
      <div className="pcard-top">
        <span className="pcard-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="pcard-year">{project.year}</span>
        {live ? <span className="live-dot">Live</span> : null}
      </div>
      <div className="pcard-art">{art ?? <FallbackArt project={project} />}</div>
      <h3 className="pcard-title glitch-text" data-text={project.title}>
        {project.title}
      </h3>
      <p className="pcard-tagline">{project.tagline}</p>
      <ul className="pcard-metrics">
        {project.metrics.slice(0, 2).map((m) => (
          <li key={m.label}>
            <strong>{m.value}</strong>
            <span>{m.label}</span>
          </li>
        ))}
      </ul>
      <span className="pcard-open">
        Open case study <Icon name="arrow-right" />
      </span>
    </ChromaCard>
  );
}

export function Work() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [focus, setFocus] = useState(1);
  const openProject = ordered.find((p) => p.id === openId) ?? null;
  const onOpen = useCallback((i: number) => setOpenId(ordered[i].id), []);

  return (
    <section id="work" className="section work">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">
            <b>[03]</b> Selected work
          </span>
          <h2 className="section-title">
            Things I've <em>built</em>
          </h2>
          <p className="section-lede">
            Drag the wall, use the arrows, or click a card. The one in the middle opens the full case study, with demos and
            code.
          </p>
        </div>
      </div>

      <div data-reveal>
        <ConcaveCarousel
          items={ordered}
          getKey={(p) => p.id}
          getLabel={(p) => p.title}
          renderItem={(p, i) => <ProjectCard project={p} index={i} />}
          onOpen={onOpen}
          label="Projects"
          focusIndex={focus}
        />
      </div>

      <div className="wrap">
        <ul className="work-index" aria-label="All projects">
          {ordered.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  setFocus(i);
                  setOpenId(p.id);
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {p.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ProjectDialog project={openProject} onClose={() => setOpenId(null)} />
    </section>
  );
}
