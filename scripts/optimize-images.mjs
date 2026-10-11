// Converts the original images in assets-src/ into compressed WebP files in public/
// (what the site loads).
//   assets-src/certificates/*  ->  public/certificates/<name>.webp + <name>-thumb.webp
//   assets-src/photos/*        ->  public/photos/<name>.webp (+ <name>-sm.webp for small cards)
// Run with: npm run images
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const isImage = (f) => /\.(png|jpe?g)$/i.test(f);
const baseName = (f) => f.replace(/\.(png|jpe?g)$/i, "");

async function certificates() {
  const srcDir = path.join(root, "assets-src", "certificates");
  const outDir = path.join(root, "public", "certificates");
  await mkdir(outDir, { recursive: true });
  for (const file of (await readdir(srcDir)).filter(isImage)) {
    const base = baseName(file);
    const input = path.join(srcDir, file);
    await sharp(input).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(outDir, `${base}.webp`));
    await sharp(input).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(outDir, `${base}-thumb.webp`));
    console.log(`ok  certificates/${file}`);
  }
}

async function photos() {
  const srcDir = path.join(root, "assets-src", "photos");
  const outDir = path.join(root, "public", "photos");
  await mkdir(outDir, { recursive: true });
  for (const file of (await readdir(srcDir)).filter(isImage)) {
    const base = baseName(file);
    const input = path.join(srcDir, file);
    await sharp(input).resize({ width: 1000 }).webp({ quality: 80 }).toFile(path.join(outDir, `${base}.webp`));
    await sharp(input).resize({ width: 520 }).webp({ quality: 72 }).toFile(path.join(outDir, `${base}-sm.webp`));
    console.log(`ok  photos/${file}`);
  }
}

await certificates();
await photos();
