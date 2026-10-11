import { journey } from "../data/content";
import { PassageGallery } from "./fx/PassageGallery";
import { ScrollMask } from "./fx/ScrollMask";

export function Journey() {
  return (
    <>
      <ScrollMask image="/photos/fest.webp" word="JOURNEY">
        <p className="smask-kicker">2022 → now</p>
        <p className="smask-text">Four years, a lot of late nights, and a few trophies. Keep scrolling to fly through it.</p>
      </ScrollMask>

      <section id="journey" className="journey" aria-label="The journey">
        <PassageGallery
          items={journey}
          heading={
            <>
              <span className="eyebrow">
                <b>[06]</b> Progress over time
              </span>
              <h2 className="section-title">
                The <em>journey</em>
              </h2>
            </>
          }
        />
      </section>
    </>
  );
}
