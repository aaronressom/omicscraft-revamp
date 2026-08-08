/**
 * Measure the client JS actually shipped, per route.
 *
 * Reads the built HTML in `.next/server/app/*.html`, pulls every <script src>
 * and every JS the route preloads, and sums the real file sizes on disk. That
 * is closer to what a visitor downloads than totalling `.next/static/chunks`,
 * which counts chunks no route ever loads.
 *
 * Usage:  node scripts/measure-bundle.mjs [label]
 * Writes a JSON snapshot to .bundle-sizes/<label>.json so before/after runs can
 * be diffed. Pass two labels to compare:  node scripts/measure-bundle.mjs --diff before after
 */
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { statSync } from "node:fs";
import path from "node:path";

const OUT_DIR = ".bundle-sizes";

function sizeOf(file) {
  const candidates = [
    path.join(".next", file),
    path.join(".next", file.replace(/^\/_next\//, "")),
    path.join(".next", "static", file),
  ];
  for (const c of candidates) {
    try {
      return statSync(c).size;
    } catch {
      /* try next */
    }
  }
  return 0;
}

function collect() {
  const appDir = path.join(".next", "server", "app");
  if (!existsSync(appDir)) {
    console.error("No build found. Run `npm run build` first.");
    process.exit(1);
  }

  const routes = {};
  const walk = (dir, prefix = "") => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, `${prefix}/${entry.name}`);
      } else if (entry.name.endsWith(".html")) {
        const route =
          entry.name === "index.html"
            ? prefix || "/"
            : `${prefix}/${entry.name.replace(/\.html$/, "")}`;
        const html = readFileSync(full, "utf8");

        // Every script the document loads, plus modulepreloaded chunks.
        const srcs = new Set();
        for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)) srcs.add(m[1]);
        for (const m of html.matchAll(/<link[^>]+rel="preload"[^>]+href="([^"]+\.js)"/g))
          srcs.add(m[1]);
        for (const m of html.matchAll(/<link[^>]+href="([^"]+\.js)"[^>]+rel="preload"/g))
          srcs.add(m[1]);

        let total = 0;
        for (const src of srcs) {
          const rel = src.replace(/^\/_next\//, "");
          total += sizeOf(rel);
        }
        routes[route] = { bytes: total, chunks: srcs.size };
      }
    }
  };
  walk(appDir);
  return routes;
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const args = process.argv.slice(2);

if (args[0] === "--diff") {
  const [, a, b] = args;
  const before = JSON.parse(readFileSync(path.join(OUT_DIR, `${a}.json`), "utf8"));
  const after = JSON.parse(readFileSync(path.join(OUT_DIR, `${b}.json`), "utf8"));
  const all = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();

  console.log(
    `${"route".padEnd(18)}${a.padStart(12)}${b.padStart(12)}${"delta".padStart(14)}`,
  );
  console.log("-".repeat(56));
  let sumB = 0;
  let sumA = 0;
  for (const route of all) {
    const x = before[route]?.bytes ?? 0;
    const y = after[route]?.bytes ?? 0;
    sumB += x;
    sumA += y;
    const d = y - x;
    const pct = x ? ((d / x) * 100).toFixed(1) : "0.0";
    console.log(
      route.padEnd(18) +
        fmt(x).padStart(12) +
        fmt(y).padStart(12) +
        `${d <= 0 ? "" : "+"}${fmt(d)} (${pct}%)`.padStart(14),
    );
  }
  console.log("-".repeat(56));
  const d = sumA - sumB;
  console.log(
    "TOTAL".padEnd(18) +
      fmt(sumB).padStart(12) +
      fmt(sumA).padStart(12) +
      `${d <= 0 ? "" : "+"}${fmt(d)} (${((d / sumB) * 100).toFixed(1)}%)`.padStart(14),
  );
} else {
  const label = args[0] ?? "current";
  const routes = collect();
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(path.join(OUT_DIR, `${label}.json`), JSON.stringify(routes, null, 2));

  console.log(`Client JS per route  [${label}]`);
  console.log("-".repeat(40));
  let total = 0;
  for (const [route, { bytes, chunks }] of Object.entries(routes).sort()) {
    total += bytes;
    console.log(`${route.padEnd(18)}${fmt(bytes).padStart(12)}  (${chunks} chunks)`);
  }
  console.log("-".repeat(40));
  console.log(`${"TOTAL".padEnd(18)}${fmt(total).padStart(12)}`);
}
