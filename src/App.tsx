import { useReveal } from "./hooks/useReveal";
import { About } from "./components/About";
import { Awards } from "./components/Awards";
import { Contact } from "./components/Contact";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { ProofStrip } from "./components/ProofStrip";
import { Research } from "./components/Research";
import { Skills } from "./components/Skills";

export function App() {
  useReveal();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <ProofStrip />
        <About />
        <Projects />
        <Research />
        <Awards />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
