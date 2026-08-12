// Build-time SSG for every public route. This imports the Vite SSR bundle,
// renders the React route in Node, and injects the result into the client HTML.
// It does not require Chrome/Puppeteer, so the same command runs locally and
// in a clean Vercel Git build.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { productMeta } from '../src/data/productMeta.js';
import { articles } from '../src/data/articles.js';
import { productCategories } from '../src/data/productCatalog.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const routes = [
  '/', '/products', '/customization', '/about', '/contact', '/faq', '/quality', '/cases', '/blog', '/privacy', '/terms',
  ...Object.keys(productMeta).map((id) => `/products/${id}`),
  ...productCategories.map((category) => `/products/category/${category.slug}`),
  ...articles.map((article) => `/blog/${article.slug}`),
];

function inject(template, appHtml, headHtml, route) {
  const routeTemplate = route === '/'
    ? template
    : template.replace(/\s*<link\s+rel=["']preload["']\s+as=["']image["'][^>]*>/gi, '');

  const withoutDefaultHead = routeTemplate
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name=["']description["'][^>]*>/i, '');

  return withoutDefaultHead
    .replace('</head>', `    ${headHtml}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const { render } = await import(pathToFileURL(serverEntry).href);

for (const route of routes) {
  const { appHtml, headHtml } = await render(route);
  if (!appHtml.includes('<h1')) {
    throw new Error(`Rendered route has no H1: ${route}`);
  }

  const output = inject(template, appHtml, headHtml, route);
  const outputPath = route === '/'
    ? path.join(dist, 'index.html')
    : path.join(dist, route.slice(1), 'index.html');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `<!doctype html>\n${output.replace(/^<!doctype html>\s*/i, '')}`);
  console.log(`[prerender] ${route} -> ${path.relative(root, outputPath)}`);
}

console.log(`[prerender] all ${routes.length} routes rendered successfully`);
