import { useCallback, useEffect, useState } from "react";
import { useReveal } from "./hooks/useReveal";
import { initSmooth } from "./lib/smooth";
import { tickerWords } from "./data/content";
import { About } from "./components/About";
import { Awards } from "./components/Awards";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { MiniProjects } from "./components/MiniProjects";
import { Nav } from "./components/Nav";
import { Preloader, shouldShowIntro } from "./components/Preloader";
import { Research } from "./components/Research";
import { ResolvSpotlight } from "./components/ResolvSpotlight";
import { Resumes } from "./components/Resumes";
import { Roles } from "./components/Roles";
import { Skills } from "./components/Skills";
import { Work } from "./components/Work";
import { ChromaFilters } from "./components/fx/ChromaCard";
import { CustomCursor } from "./components/fx/CustomCursor";
import { Marquee } from "./components/fx/Marquee";

export function App() {
  const [intro] = useState(shouldShowIntro);
  const [ready, setReady] = useState(!intro);
  const onIntroDone = useCallback(() => setReady(true), []);
  useReveal();

  useEffect(() => initSmooth(), []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {intro && !ready ? <Preloader onDone={onIntroDone} /> : null}
      <ChromaFilters />
      <CustomCursor />
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <Marquee className="ticker" items={tickerWords} speed={36} />
        <About />
        <Awards />
        <Work />
        <ResolvSpotlight />
        <Research />
        <Journey />
        <MiniProjects />
        <Skills />
        <Resumes />
        <Roles />
      </main>
    </>
  );
}
