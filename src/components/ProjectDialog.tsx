import type { Project } from "../data/content";
import { Dialog } from "./Dialog";
import { LiteVideo } from "./LiteVideo";
import { ProjectLinks } from "./ProjectLinks";
import { ResolvVisuals } from "./ResolvVisuals";

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Dialog
      open={project !== null}
      onClose={onClose}
      labelId="project-dialog-title"
      title={project?.title}
      subtitle={project ? (project.tagline.includes(project.year) ? project.tagline : `${project.tagline} · ${project.year}`) : undefined}
    >
      {project ? (
        <div className="pd">
          {project.role || project.recognition ? (
            <div className="pd-tags">
              {project.role ? <span className="tag">{project.role}</span> : null}
              {project.recognition ? <span className="tag tag-accent">★ {project.recognition}</span> : null}
            </div>
          ) : null}

          <div className="pd-plain">
            <span className="pd-plain-label">In plain words</span>
            <p>{project.plain}</p>
          </div>

          <ProjectLinks links={project.links} showNotes />

          <ul className="metrics pd-metrics">
            {project.metrics.map((m) => (
              <li key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </li>
            ))}
          </ul>

          {project.video ? <LiteVideo {...project.video} /> : null}

          <h3 className="pd-h">How it works</h3>
          <ul className="pd-list">
            {project.highlights.map((h) => (
              <li key={h.slice(0, 32)}>{h}</li>
            ))}
          </ul>

          {project.extra === "resolv" ? (
            <>
              <h3 className="pd-h">The numbers</h3>
              <ResolvVisuals />
            </>
          ) : null}

          <h3 className="pd-h">Built with</h3>
          <ul className="chip-list">
            {project.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Dialog>
  );
}
