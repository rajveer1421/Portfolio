import { useMemo, useState, type CSSProperties } from "react";
import { categoryLabels, experiments, projects, type Category, type Project } from "../data/content";
import { Icon } from "./Icon";
import { ProjectArt } from "./ProjectArt";
import { ProjectDialog } from "./ProjectDialog";
import { ProjectLinks, visibleLinks } from "./ProjectLinks";

type Filter = "all" | Category;
const filters: Filter[] = ["all", "live", "agents", "vision", "nlp", "scratch", "swe"];

function hasLive(p: Project) {
  return visibleLinks(p.links).some((l) => l.kind === "live");
}

function FeaturedCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <article id={`project-${project.id}`} className="featured card" data-reveal>
      <div className="featured-art">
        <ProjectArt id={project.id} />
        {project.ribbon ? <span className="ribbon">★ {project.ribbon}</span> : null}
      </div>
      <div className="featured-body">
        <div className="featured-top">
          <span className="featured-num">{String(index + 1).padStart(2, "0")}</span>
          <span className="featured-year">{project.year}</span>
          {hasLive(project) ? <span className="live-dot">Live</span> : null}
        </div>
        <h3 className="featured-title">{project.title}</h3>
        <p className="featured-tagline">{project.tagline}</p>
        <p className="featured-plain">{project.plain}</p>
        {project.recognition ? <p className="featured-recog">★ {project.recognition}</p> : null}
        <ul className="metrics">
          {project.metrics.map((m) => (
            <li key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>
        <div className="featured-actions">
          <button type="button" className="btn" onClick={onOpen}>
            How it works
            <Icon name="arrow-right" />
          </button>
          <ProjectLinks links={project.links} />
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <article id={`project-${project.id}`} className="pcard card">
      <div className="pcard-top">
        <span className="featured-year">{project.year}</span>
        {hasLive(project) ? <span className="live-dot">Live</span> : null}
      </div>
      <h3 className="pcard-title">
        <button type="button" className="pcard-open" onClick={onOpen}>
          {project.title}
        </button>
      </h3>
      <p className="pcard-tagline">{project.tagline}</p>
      <p className="pcard-plain">{project.plain}</p>
      {project.recognition ? <p className="featured-recog">★ {project.recognition}</p> : null}
      <ul className="metrics metrics-sm">
        {project.metrics.map((m) => (
          <li key={m.label}>
            <strong>{m.value}</strong>
            <span>{m.label}</span>
          </li>
        ))}
      </ul>
      <div className="pcard-foot">
        <ProjectLinks links={project.links} size="sm" />
        <span className="pcard-more" aria-hidden="true">
          Details <Icon name="arrow-right" />
        </span>
      </div>
    </article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const featured = projects.filter((p) => p.featured);
  const rest = useMemo(
    () =>
      projects.filter(
        (p) => !p.featured && (filter === "all" || (filter === "live" ? hasLive(p) : p.categories.includes(filter))),
      ),
    [filter],
  );
  const openProject = projects.find((p) => p.id === openId) ?? null;

  return (
    <section id="work" className="section section-tinted">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">02 · Projects</span>
          <h2 className="section-title">Things I've built</h2>
          <p className="section-lede">
            Four projects I'd show first, then everything else. Click any project for the full story; projects marked{" "}
            <span className="live-dot live-dot-inline">Live</span> can be tried right now.
          </p>
        </div>

        <div className="featured-list">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} project={p} index={i} onOpen={() => setOpenId(p.id)} />
          ))}
        </div>

        <div className="more-head" data-reveal>
          <h3 className="sub-title">More projects</h3>
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                className={`filter${filter === f ? " is-on" : ""}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : categoryLabels[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="pgrid" aria-live="polite">
          {rest.map((p, i) => (
            <div key={p.id} className="pgrid-item" style={{ "--rd": i % 3 } as CSSProperties} onClick={() => setOpenId(p.id)}>
              <ProjectCard project={p} onOpen={() => setOpenId(p.id)} />
            </div>
          ))}
          {rest.length === 0 ? <p className="muted">Nothing in this group outside the featured four above.</p> : null}
        </div>

        <details className="experiments" data-reveal>
          <summary>
            Smaller experiments and learning projects <span className="muted">({experiments.length})</span>
          </summary>
          <ul>
            {experiments.map((e) => (
              <li key={e.href}>
                <a href={e.href} target="_blank" rel="noreferrer">
                  <strong>{e.title}</strong>
                  <span>{e.detail}</span>
                  <Icon name="external" />
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <ProjectDialog project={openProject} onClose={() => setOpenId(null)} />
    </section>
  );
}
