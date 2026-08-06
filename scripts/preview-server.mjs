#!/usr/bin/env node
// Minimal static preview server for the docs + assets in this workspace.
// Renders an index that links the notes and shows the process-ceremony graphic.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const PORT = Number(process.env.PORT ?? 4173);
const HOST = process.env.HOST ?? "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const INDEX = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SBC Vocational Cooperative — Preview</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font: 16px/1.5 -apple-system, "Helvetica Neue", Arial, sans-serif; color: #0f172a; background: #f8fafc; }
    header { padding: 32px 40px 16px; }
    .eyebrow { letter-spacing: 3px; font-size: 13px; font-weight: 600; color: #64748b; }
    h1 { margin: 6px 0 0; font-size: 30px; }
    main { padding: 8px 40px 48px; max-width: 1200px; }
    section { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(15,23,42,0.06); margin-bottom: 24px; }
    h2 { margin-top: 0; font-size: 20px; }
    a { color: #2563eb; }
    ul { padding-left: 20px; }
    img { max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 12px; }
    footer { padding: 0 40px 40px; color: #94a3b8; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <div class="eyebrow">SBC VOCATIONAL COOPERATIVE</div>
    <h1>Docs &amp; Assets Preview</h1>
  </header>
  <main>
    <section>
      <h2>Process Ceremony Overview</h2>
      <p>Shareable graphic (rendered PNG export from the SVG source):</p>
      <img src="/assets/process-ceremony-overview-ltr.png" alt="Process ceremony overview graphic" />
    </section>
    <section>
      <h2>Working notes</h2>
      <ul>
        <li><a href="/README.md">README.md</a></li>
        <li><a href="/notes/README.md">notes/README.md</a></li>
        <li><a href="/notes/process-ceremony-overview.md">notes/process-ceremony-overview.md</a></li>
      </ul>
      <p>Source graphic: <a href="/assets/process-ceremony-overview.svg">assets/process-ceremony-overview.svg</a></p>
    </section>
  </main>
  <footer>Strasburg Baptist Church · Planning team · Local preview</footer>
</body>
</html>`;

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      res.writeHead(200, { "content-type": MIME[".html"] });
      res.end(INDEX);
      return;
    }

    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\\/])+/, "");
    const filePath = join(repoRoot, rel);
    if (!filePath.startsWith(repoRoot)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const info = await stat(filePath).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": MIME[extname(filePath)] ?? "application/octet-stream" });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end(`Server error: ${err?.message ?? err}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Preview server running at http://${HOST}:${PORT}`);
});
