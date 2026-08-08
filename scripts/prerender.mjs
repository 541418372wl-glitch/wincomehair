// SSG prerender: render every route with headless Chrome and save static HTML.
// Runs after `vite build`. Each route gets dist/<route>/index.html containing
// the full rendered DOM (body + H1 + meta + JSON-LD) for crawlers and AI bots.
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { productMeta } from '../src/data/productMeta.js';
import { articles } from '../src/data/articles.js';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
const PORT = 8129;

const routes = [
  '/', '/products', '/customization', '/about', '/contact', '/faq', '/quality', '/cases', '/blog', '/privacy', '/terms',
  ...Object.keys(productMeta).map((id) => `/products/${id}`),
  ...articles.map((a) => `/blog/${a.slug}`),
];

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  let filePath = path.join(dist, urlPath);
  if (!filePath.startsWith(dist)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(dist, 'index.html');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`[prerender] server on ${PORT}, routes: ${routes.length}`);
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const failed = [];
    for (const route of routes) {
      const page = await browser.newPage();
      let pageError = null;
      page.on('pageerror', (e) => { pageError = String(e).slice(0, 150); });
      try {
        await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise((r) => setTimeout(r, 2500));
        const html = await page.evaluate(() => document.documentElement.outerHTML);
        const outPath = path.join(dist, route.slice(1), 'index.html');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, '<!doctype html>\n' + html);
        const ok = html.includes('<h1') || html.includes('root');
        console.log(`  ${ok ? 'OK  ' : 'WARN'} ${route} (${(html.length / 1024).toFixed(0)}KB)${pageError ? ' js:' + pageError : ''}`);
        if (!ok || pageError) failed.push(`${route} :: ${pageError || 'empty html'}`);
      } catch (e) {
        console.log(`  FAIL ${route} -> ${String(e).slice(0, 120)}`);
        failed.push(`${route} :: ${String(e).slice(0, 120)}`);
      }
      await page.close();
    }
    await browser.close();
    console.log(failed.length ? `[prerender] ${failed.length} failed:\n${failed.join('\n')}` : `[prerender] all ${routes.length} routes rendered OK`);
    server.close();
    process.exit(failed.length ? 1 : 0);
  } catch (e) {
    console.error('[prerender] FATAL:', e.message);
    server.close();
    process.exit(1);
  }
});
