import { useState } from "react";
import { Icon } from "./Icon";

interface LiteVideoProps {
  provider: "youtube" | "drive";
  id: string;
  title: string;
}

/** Shows a poster first; the heavy player iframe loads only after a click. */
export function LiteVideo({ provider, id, title }: LiteVideoProps) {
  const [playing, setPlaying] = useState(false);
  const src =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : `https://drive.google.com/file/d/${id}/preview`;

  if (playing) {
    return (
      <div className="video">
        <iframe
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button type="button" className="video video-poster" onClick={() => setPlaying(true)} aria-label={`Play: ${title}`}>
      {provider === "youtube" ? (
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
      ) : null}
      <span className="video-play">
        <Icon name="play" />
      </span>
      <span className="video-label">{title}</span>
    </button>
  );
}
