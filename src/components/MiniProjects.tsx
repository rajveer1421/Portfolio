import { experiments } from "../data/content";
import { OrbitReel } from "./fx/OrbitReel";
import { Icon } from "./Icon";

// The wheel needs enough cards to fill its arc, so the list goes round twice.
const reel = [...experiments, ...experiments].map((e, i) => ({ ...e, key: `${i}-${e.href}` }));

export function MiniProjects() {
  return (
    <section id="side-quests" className="section side">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">
            <b>[07]</b> Mini projects
          </span>
          <h2 className="section-title">
            Side <em>quests</em>
          </h2>
          <p className="section-lede">Smaller builds where I learned the basics properly. Drag the wheel; click a card for the code.</p>
        </div>
      </div>
      <OrbitReel
        items={reel}
        getKey={(e) => e.key}
        label="Mini projects"
        renderItem={(e, i) => (
          <a href={e.href} target="_blank" rel="noreferrer" className={`orbit-link tone-${["orange", "lime", "violet"][i % 3]}`} tabIndex={i >= experiments.length ? -1 : 0}>
            <span className="orbit-num">{String((i % experiments.length) + 1).padStart(2, "0")}</span>
            <strong>{e.title}</strong>
            <span>{e.detail}</span>
            <span className="orbit-go">
              Code <Icon name="github" />
            </span>
          </a>
        )}
      />
    </section>
  );
}
