// Converts the original certificate images in assets-src/certificates
// into compressed WebP files in public/certificates (what the site loads).
// Run with: npm run images
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "assets-src", "certificates");
const outDir = path.join(root, "public", "certificates");

await mkdir(outDir, { recursive: true });

for (const file of await readdir(srcDir)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const base = file.replace(/\.(png|jpe?g)$/i, "");
  const input = path.join(srcDir, file);

  const full = path.join(outDir, `${base}.webp`);
  await sharp(input).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(full);

  const thumb = path.join(outDir, `${base}-thumb.webp`);
  await sharp(input).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 70 }).toFile(thumb);

  console.log(`ok  ${file} -> ${base}.webp, ${base}-thumb.webp`);
}
