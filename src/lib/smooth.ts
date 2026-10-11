import Lenis from "lenis";

/** One shared smooth-scroll instance (Lenis). Native scrolling still drives window.scrollY. */
let lenis: Lenis | null = null;

const navOffset = () => -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72) - 8;

export function initSmooth(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: true,
    prevent: (node) => node.closest?.("dialog, [data-lenis-prevent]") !== null,
  });

  // Same-page anchor links glide instead of jumping.
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el && id !== "top") return;
    e.preventDefault();
    scrollToTarget(el ?? 0);
    history.replaceState(null, "", `#${id}`);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : navOffset(), duration: 1.4 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function lockScroll(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
