import { useState, type CSSProperties } from "react";
import { resumes, type Resume } from "../data/content";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";

/** A mini "paper" preview of a résumé, drawn in HTML so it stays sharp and light. */
function Sheet({ r }: { r: Resume }) {
  return (
    <div className="sheet-paper" aria-hidden="true">
      <span className="sheet-name">RAJVEER GUPTA</span>
      <span className="sheet-role">{r.title} résumé</span>
      <span className="sheet-rule" />
      {r.leads.map((l) => (
        <span key={l} className="sheet-line">
          <b />
          {l}
        </span>
      ))}
      <span className="sheet-bars">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

export function Resumes() {
  const [active, setActive] = useState(1);
  const [preview, setPreview] = useState<Resume | null>(null);

  return (
    <section id="resumes" className="section resumes">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">
            <b>[09]</b> Download
          </span>
          <h2 className="section-title">
            Pick your <em>résumé</em>
          </h2>
          <p className="section-lede">
            Three versions of the same person, each tuned for a kind of role. Pick the one that matches what you're hiring for.
          </p>
        </div>

        <div className="resume-switch" role="tablist" aria-label="Résumé type" data-reveal>
          {resumes.map((r, i) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`resume-panel-${r.id}`}
              className={`resume-tab tone-${r.accent}${i === active ? " is-on" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="resume-tab-n">0{i + 1}</span>
              {r.title}
            </button>
          ))}
        </div>

        <div className="resume-stage" data-reveal>
          <div className="resume-deck">
            {resumes.map((r, i) => {
              const offset = i - active;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`resume-sheet tone-${r.accent}${i === active ? " is-front" : ""}`}
                  style={{ "--o": offset, "--abs": Math.abs(offset) } as CSSProperties}
                  onClick={() => (i === active ? setPreview(r) : setActive(i))}
                  aria-label={i === active ? `Preview the ${r.title} résumé` : `Show the ${r.title} résumé`}
                  tabIndex={-1}
                >
                  <Sheet r={r} />
                </button>
              );
            })}
          </div>

          {resumes.map((r, i) => (
            <div key={r.id} id={`resume-panel-${r.id}`} role="tabpanel" hidden={i !== active} className={`resume-info tone-${r.accent}`}>
              <span className="resume-for">{r.forRoles}</span>
              <h3 className="resume-title">{r.title}</h3>
              <p className="resume-pitch">{r.pitch}</p>
              <ul className="resume-leads">
                {r.leads.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <div className="resume-actions">
                <a href={r.file} download={r.downloadName} className="btn btn-accent">
                  <Icon name="arrow-down" />
                  Download PDF
                </a>
                <button type="button" className="btn btn-ghost" onClick={() => setPreview(r)}>
                  <Icon name="file" />
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={preview !== null}
        onClose={() => setPreview(null)}
        labelId="resume-preview-title"
        title={preview ? `${preview.title} résumé` : ""}
        subtitle={preview?.forRoles}
        wide
      >
        {preview ? (
          <div className="resume-preview">
            <iframe src={`${preview.file}#view=FitH`} title={`${preview.title} résumé (PDF)`} />
            <div className="resume-actions">
              <a href={preview.file} download={preview.downloadName} className="btn btn-accent">
                <Icon name="arrow-down" />
                Download PDF
              </a>
              <a href={preview.file} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Icon name="external" />
                Open in a new tab
              </a>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
