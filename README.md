# Rajveer Gupta · Portfolio

Personal portfolio site. Vite + React + TypeScript, plain CSS. Every effect (the WebGL shader reveal, dotted globe, 3D carousels, scroll mask, confetti cursor, …) is hand-written in `src/components/fx/`, with no animation or 3D library. The only runtime dependency besides React is Lenis, for smooth scrolling.

## Run locally

Needs Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the built site at http://localhost:4173
```

## What's where

| Path | What it holds |
| --- | --- |
| `src/data/content.ts` | Every word, number and link on the site: profile, projects, awards, journey milestones, roles, résumés |
| `src/components/` | One file per section, in page order inside `App.tsx` |
| `src/components/fx/` | The effects: `ShaderReveal`, `CipherText`, `SpeedNumber`, `ConcaveCarousel`, `Globe`, `LineGraph`, `PassageGallery`, `ScrollMask`, `OrbitReel`, `RotatingCards`, `ChromaCard`, `CelebrationCursor`, `CustomCursor`, `Marquee` |
| `src/styles/` | `base.css` (tokens, type, buttons), `fx.css` (effects), `sections.css` (section layouts), `content.css` (cards, dialogs, project art), `scene.css` (the desk illustration) |
| `public/resumes/` | The three downloadable PDFs |
| `public/photos/`, `public/certificates/` | Compressed WebP images the site loads (generated, see below) |

Fonts: Syne (display), Instrument Serif italic (accents), Hanken Grotesk (body and numbers), JetBrains Mono (labels), all self-hosted through Fontsource.

Every effect has a reduced-motion fallback, and the heavy ones (3D tunnel, scroll mask) switch to simple layouts on phones.

## Editing content

- **Project links:** find the project in `content.ts` and fill in the `href` of a link. An empty `href` hides the button.
- **Project order:** the `ORDER` list at the top of `src/components/Work.tsx`.
- **Awards:** each entry in `awards` is one trophy on the shelf. `image` points to a file in `public/certificates/`; `link` is for external certificates (PDFs).
- **Journey:** the `journey` list; items with an `image` show the photo, the rest show a coloured tile.
- **Résumés:** replace the PDFs in `public/resumes/` (keep the file names), or edit the `resumes` list to change titles and highlights.

## Adding images

1. Put the original PNG/JPG in `assets-src/certificates/` or `assets-src/photos/`.
2. Run `npm run images`. Certificates get a `.webp` plus a `-thumb.webp`; photos get a `.webp` plus a `-sm.webp` for small cards.
3. Reference them as `/certificates/<name>.webp` or `/photos/<name>.webp`.

## Globe land data

The dotted globe reads `src/data/landmask.ts`, generated from Natural Earth (via `world-atlas`) by `npm run landmask`. It only needs re-running if you change the resolution in `scripts/build-landmask.mjs`.

## Deploy on Vercel

1. Push this folder to a GitHub repository (it should be the repository root).
2. On vercel.com: **Add New → Project → Import** the repository.
3. Vercel detects Vite automatically (build `npm run build`, output `dist`). Click **Deploy**.

Every later `git push` redeploys automatically.
