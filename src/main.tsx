import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/syne";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./styles/base.css";
import "./styles/content.css";
import "./styles/fx.css";
import "./styles/sections.css";
import "./styles/scene.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
