import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { commercialLandingPages } from '../src/data/commercialLandingPages.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(projectRoot, 'dist');
const mappings = Object.values(commercialLandingPages);

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function textContent(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function routeFile(route) {
  return route === '/'
    ? path.join(distRoot, 'index.html')
    : path.join(distRoot, route.slice(1), 'index.html');
}

assert.equal(new Set(mappings.map(({ keyword }) => keyword.toLowerCase())).size, mappings.length, 'Commercial keywords must be unique');
assert.equal(new Set(mappings.map(({ route }) => route)).size, mappings.length, 'Commercial landing-page routes must be unique');

for (const mapping of mappings) {
  const html = await fs.readFile(routeFile(mapping.route), 'utf8');
  const title = textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = decodeHtml(html.match(/<meta name="description" content="([^"]*)">/i)?.[1] || '');
  const h1 = textContent(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const expectedHeading = mapping.heading || mapping.headingLines.join(' ');

  assert.equal(title, mapping.seoTitle, `SEO title mismatch: ${mapping.route}`);
  assert.equal(description, mapping.metaDescription, `Meta description mismatch: ${mapping.route}`);
  assert.equal(h1, expectedHeading, `H1 mismatch: ${mapping.route}`);
  assert.ok(title.toLowerCase().startsWith(mapping.keyword), `SEO title must lead with mapped keyword: ${mapping.route}`);
  assert.ok(h1.toLowerCase().includes(mapping.keyword), `H1 must contain mapped keyword: ${mapping.route}`);
}

const homeHtml = await fs.readFile(routeFile('/'), 'utf8');
assert.match(
  homeHtml,
  /href="\/products\/category\/hair-clips-barrettes"[^>]*>[\s\S]*?custom hair clip manufacturer page[\s\S]*?<\/a>/i,
  'Homepage must link the hair-clip keyword to its dedicated commercial landing page',
);

console.log(`[commercial-landing-pages] ${mappings.length} one-to-one keyword mappings verified`);
