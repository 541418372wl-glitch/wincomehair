import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const origin = 'https://wincomehair.com';
const dist = path.resolve('dist');
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
const failures = [];
const redirects = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).redirects || [];
const redirectSources = new Set();
for (const redirect of redirects) {
  const { source, destination, permanent } = redirect;
  // Retired article URLs must resolve directly to a current canonical page.
  // Excluding canonical sources also prevents redirect chains and loops.
  if (!/^\/blog\/[a-z0-9-]+$/.test(source) || routes.includes(source)) failures.push('Invalid retired article source: ' + source);
  if (redirectSources.has(source)) failures.push('Duplicate redirect source: ' + source);
  if (!routes.includes(destination)) failures.push('Redirect target is not a canonical route: ' + destination);
  if (permanent !== true) failures.push('Article redirect must be permanent: ' + source);
  redirectSources.add(source);
}
let links = 0;
for (const route of routes) {
  const file = path.join(dist, route, 'index.html');
  const dom = new JSDOM(fs.readFileSync(file, 'utf8'), { url: origin + route });
  const doc = dom.window.document;
  if (doc.querySelectorAll('h1').length !== 1) failures.push(route + ': expected one H1');
  if (doc.querySelector('link[rel="canonical"]')?.href !== origin + route) failures.push(route + ': canonical mismatch');
  for (const node of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try { JSON.parse(node.textContent); } catch { failures.push(route + ': invalid JSON-LD'); }
  }
  for (const img of doc.querySelectorAll('img')) if (!img.hasAttribute('alt')) failures.push(route + ': image lacks alt');
  for (const link of doc.querySelectorAll('a[href]')) {
    const url = new URL(link.href);
    if (url.origin !== origin) continue;
    links++;
    const target = path.join(dist, decodeURIComponent(url.pathname));
    if (!fs.existsSync(target) || (fs.statSync(target).isDirectory() && !fs.existsSync(path.join(target, 'index.html')))) failures.push(route + ': broken link ' + url.pathname);
    if (url.pathname === route && url.hash && !doc.getElementById(decodeURIComponent(url.hash.slice(1)))) failures.push(route + ': missing anchor ' + url.hash);
  }
  dom.window.close();
}
assert.equal(failures.length, 0, [...new Set(failures)].join('\n'));
console.log('Route integrity passed: ' + routes.length + ' pages, ' + links + ' internal links, ' + redirects.length + ' permanent article redirects, H1, canonical, JSON-LD, image alt and same-page anchors');
