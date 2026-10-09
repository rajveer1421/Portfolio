import { useState, type CSSProperties } from "react";
import { awards } from "../data/content";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";
import { Trophy } from "./Trophy";

const shelves = [awards.slice(0, 5), awards.slice(5)];

export function Awards() {
  const [index, setIndex] = useState<number | null>(null);
  const award = index === null ? null : awards[index];
  const go = (d: number) => setIndex((i) => (i === null ? 0 : (i + d + awards.length) % awards.length));

  return (
    <section id="awards" className="section section-tinted">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">04 · Awards</span>
          <h2 className="section-title">The trophy shelf</h2>
          <p className="section-lede">
            Tap any trophy to see what it was for, and the certificate where there is one.
          </p>
        </div>

        <div className="cabinet" data-reveal>
          {shelves.map((row, r) => (
            <div key={r} className="shelf">
              <ul className="shelf-items">
                {row.map((a, i) => {
                  const idx = r === 0 ? i : i + shelves[0].length;
                  return (
                    <li key={a.id} style={{ "--rd": i } as CSSProperties}>
                      <button type="button" className="trophy" onClick={() => setIndex(idx)}>
                        <Trophy shape={a.shape} tone={a.tone} />
                        <span className="trophy-plaque">{a.short}</span>
                        <span className="sr-only">
                          {a.title}, {a.event}. Open details.
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="plank" aria-hidden="true" />
            </div>
          ))}
          <button type="button" className="btn btn-ghost cabinet-open" onClick={() => setIndex(0)}>
            Open the full list
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>

      <Dialog
        open={award !== null}
        onClose={() => setIndex(null)}
        labelId="award-dialog-title"
        title={award?.title}
        subtitle={award ? (award.event.includes(award.when) ? award.event : `${award.event} · ${award.when}`) : undefined}
        wide
      >
        {award && index !== null ? (
          <div className="award-view">
            <nav className="award-list" aria-label="All awards">
              <ul>
                {awards.map((a, i) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      className={i === index ? "is-on" : undefined}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => setIndex(i)}
                    >
                      <strong>{a.title}</strong>
                      <span>{a.event}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="award-detail">
              <p>{award.detail}</p>
              {award.image ? (
                <figure className="award-cert">
                  <img key={award.image} src={award.image} alt={`Certificate: ${award.title}, ${award.event}`} loading="lazy" decoding="async" />
                  <figcaption>
                    <a href={award.image} target="_blank" rel="noreferrer" className="text-link">
                      Open full size <Icon name="external" />
                    </a>
                  </figcaption>
                </figure>
              ) : null}
              {award.link ? (
                <a href={award.link.href} target="_blank" rel="noreferrer" className="btn btn-accent">
                  <Icon name="file" />
                  {award.link.label}
                </a>
              ) : null}
              <div className="award-nav">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(-1)}>
                  <Icon name="arrow-left" /> Previous
                </button>
                <span className="muted small">
                  {index + 1} / {awards.length}
                </span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(1)}>
                  Next <Icon name="arrow-right" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
