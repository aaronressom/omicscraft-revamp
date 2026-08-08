/**
 * One-off: bring the source images in public/ down to sane dimensions.
 *
 * WHY. Several originals are far larger than anything the site can display.
 * `team/ressom.jpg` is 3487x3984 (1.7MB) for an avatar that renders at most a
 * few hundred pixels. Next's optimizer downscales at request time, so visitors
 * were never served the full file — but the repo carries it, and the server has
 * to decode a 14-megapixel JPEG the first time each size is requested.
 *
 * RULES THIS SCRIPT FOLLOWS:
 *  - Never upscale. `withoutEnlargement` keeps the 200x200 sources untouched.
 *  - Never change a path. lib/assets.ts resolves by path and the components
 *    hard-code them; a renamed file silently degrades to a wordmark.
 *  - Never change an aspect ratio. motto-band.tsx hard-codes 537/310 for
 *    img/lab-bench.png, and logo.tsx assumes 1095/269 (= 4.07) for the lockup.
 *    Every target below is the original ratio or a plain `fit: inside` cap.
 *
 * ── QUALITY IS DELIBERATELY HIGH ───────────────────────────────────────────
 * These are SOURCE files. Next re-encodes them per request (to WebP/AVIF at the
 * quality set in next.config.ts), so whatever is written here gets compressed a
 * second time before anyone sees it. Squeezing hard here would stack two lossy
 * passes and show up as artefacts in the delivered image.
 *
 * So the saving comes almost entirely from RESIZING — dropping a 3487px
 * original that is only ever displayed at a few hundred pixels — and the
 * quality settings stay high enough that the second pass has clean input.
 *
 * Run with no flags to preview. Run with --apply to write.
 */
import { existsSync, statSync, readdirSync, renameSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const APPLY = process.argv.includes("--apply");

/**
 * Target longest edge per directory, chosen as ~2x the largest box each image
 * can occupy on screen (retina), not as an arbitrary cap.
 */
const TARGETS = [
  {
    dir: "public/team",
    // Cards render up to ~310 CSS px on a phone; the dialog avatar is 112.
    // 640 covers the largest at 2x with headroom.
    max: 640,
    format: "jpeg",
    // 92, not 80: these are faces, and they feed a second encode pass.
    options: { quality: 92, mozjpeg: true },
  },
  {
    dir: "public/slides",
    // Full-bleed hero at 100vw. 1920 covers a desktop at 1x and a phone at 3x;
    // above that the scrim over them hides any further detail.
    max: 1920,
    format: "jpeg",
    options: { quality: 90, mozjpeg: true },
  },
  {
    dir: "public/logos",
    // Product logo cards are ~30vw; 800 is generous at 2x.
    max: 800,
    format: null, // keep each file's own format — mixed png/jpg here
    options: { quality: 92 },
  },
];

/** Files handled individually because something in the code depends on them. */
const SPECIFIC = [
  {
    file: "public/img/lab-bench.png",
    // 537x310 native and ALREADY UPSCALED ~1.3x in the layout, so it must not
    // be resized down — motto-band.tsx caps the card at max-w-3xl precisely
    // because this file has no more resolution to give.
    //
    // LOSSLESS ONLY. It is a photograph, and it is the one image on the site
    // rendered at quality={100} specifically because it "cannot afford to lose
    // anything else to re-compression" (see motto-band.tsx and the qualities
    // allowlist in next.config.ts). `palette: true` would quantise it to 256
    // colours and band the gradients; it is deliberately not set.
    max: null,
    format: "png",
    options: { compressionLevel: 9, palette: false, effort: 10 },
  },
  {
    file: "public/brand/omicscraft-logo.png",
    // Rendered at 358x88 (h-11 at 2x). Keep 2x of that plus headroom; the
    // 4.07 ratio is load-bearing in logo.tsx.
    max: 800,
    format: "png",
    options: { compressionLevel: 9 },
  },
  {
    file: "public/brand/omicscraft-mark.png",
    max: 608,
    format: "png",
    options: { compressionLevel: 9 },
  },
];

function kb(n) {
  return `${(n / 1024).toFixed(0)}KB`;
}

async function optimize(file, { max, format, options }) {
  if (!existsSync(file)) return null;

  const before = statSync(file).size;
  const image = sharp(file);
  const meta = await image.metadata();

  let pipeline = image;
  if (max && (meta.width > max || meta.height > max)) {
    // `inside` preserves aspect ratio; `withoutEnlargement` guarantees a small
    // source is never blown up.
    pipeline = pipeline.resize({
      width: max,
      height: max,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const outFormat = format ?? meta.format;
  pipeline = pipeline.toFormat(outFormat, options);

  const output = await pipeline.toBuffer();
  const outMeta = await sharp(output).metadata();

  // Never write a file that got BIGGER — recompressing an already-optimised
  // asset can do that, and it would be a pure loss.
  const wrote = APPLY && output.length < before;
  if (wrote) {
    // Write to a temp path then rename: sharp cannot write to the file it is
    // currently reading from.
    await sharp(output).toFile(file + ".tmp");
    renameSync(file + ".tmp", file);
  }

  return {
    file,
    before,
    after: output.length,
    dims: `${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}`,
    wrote,
    skipped: output.length >= before,
  };
}

const jobs = [];
for (const target of TARGETS) {
  if (!existsSync(target.dir)) continue;
  for (const name of readdirSync(target.dir)) {
    jobs.push([path.join(target.dir, name).replace(/\\/g, "/"), target]);
  }
}
for (const s of SPECIFIC) jobs.push([s.file, s]);

let totalBefore = 0;
let totalAfter = 0;

console.log(APPLY ? "APPLYING\n" : "DRY RUN (pass --apply to write)\n");
for (const [file, config] of jobs) {
  const r = await optimize(file, config);
  if (!r) continue;
  totalBefore += r.before;
  totalAfter += Math.min(r.after, r.before);
  const note = r.skipped ? "  (skipped: no gain)" : "";
  console.log(
    `${r.file.padEnd(42)} ${kb(r.before).padStart(8)} -> ${kb(r.after).padStart(8)}  ${r.dims}${note}`,
  );
}

console.log(
  `\nTOTAL ${kb(totalBefore)} -> ${kb(totalAfter)}  (saved ${kb(totalBefore - totalAfter)})`,
);
