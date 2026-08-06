#!/usr/bin/env node
// Render the process-ceremony source SVG into its exported PNG.
// Keeps assets/process-ceremony-overview-ltr.png in sync with the SVG source.
//
// Usage:
//   node scripts/render-assets.mjs            # write the PNG next to the SVG
//   node scripts/render-assets.mjs --check    # render to a temp file and validate only

import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// The "-ltr" export is a 2x raster of the 1600x720 source for crisp sharing.
// librsvg rasterizes at a 72dpi baseline, so density = 72 * SCALE yields the
// target pixel dimensions (SCALE=2 -> 3200x1440).
const SCALE = 2;
const BASE_DPI = 72;

const targets = [
  {
    source: "assets/process-ceremony-overview.svg",
    output: "assets/process-ceremony-overview-ltr.png",
  },
];

const checkOnly = process.argv.includes("--check");

async function render({ source, output }) {
  const srcPath = resolve(repoRoot, source);
  const svg = await readFile(srcPath);

  const png = await sharp(svg, { density: BASE_DPI * SCALE })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const meta = await sharp(png).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Rendered PNG for ${source} has no dimensions`);
  }

  if (checkOnly) {
    const tmpDir = resolve(repoRoot, ".render-tmp");
    await mkdir(tmpDir, { recursive: true });
    const tmpPath = resolve(tmpDir, output.replace(/[\\/]/g, "_"));
    await writeFile(tmpPath, png);
    console.log(
      `check ok: ${source} -> ${meta.width}x${meta.height} PNG (${png.length} bytes)`
    );
    return;
  }

  const outPath = resolve(repoRoot, output);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, png);
  const written = await stat(outPath);
  console.log(
    `wrote ${output}: ${meta.width}x${meta.height} PNG (${written.size} bytes)`
  );
}

for (const target of targets) {
  await render(target);
}
