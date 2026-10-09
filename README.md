# Rajveer Gupta · Portfolio

Personal portfolio site. Vite + React + TypeScript, plain CSS, no animation or 3D libraries (the hero is a hand-written animated SVG), so it stays fast on phones.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the built site
```

## Editing content

Every word, number and link on the site lives in **`src/data/content.ts`**.

- **Add a live link to a project:** find the project and fill in `href` of its `{ kind: "live", ... }` link. An empty `href` hides the button.
  ReturnGuard already has an empty live link waiting for its URL.
- **Show a résumé button:** set `profile.resumeUrl` to a public PDF link (a Google Drive "anyone with the link" URL works).
- **Reorder projects:** the four with `featured: true` appear as large cards in the order they are listed; the rest go into the filterable grid.
- **Awards:** each entry in `awards` is one trophy on the shelf. `image` points to a file in `public/certificates/`; `link` is for external certificates (PDFs).

## Adding a certificate image

1. Put the original PNG/JPG in `assets-src/certificates/`.
2. Run `npm run images`. It writes a compressed `.webp` and a `-thumb.webp` into `public/certificates/`.
3. Reference it in `content.ts` as `/certificates/<name>.webp`.

Both folders are committed, so the certificates ship with every deploy.

## Deploy on Vercel

1. Push this folder to a GitHub repository (it should be the repository root).
2. On vercel.com: **Add New → Project → Import** the repository.
3. Vercel detects Vite automatically (build `npm run build`, output `dist`). Click **Deploy**.

Every later `git push` redeploys automatically.
