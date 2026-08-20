import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(projectRoot, 'dist');
const site = 'https://wincomehair.com';

const readProjectFile = (relativePath) => readFile(path.join(projectRoot, relativePath), 'utf8');
const readBuiltRoute = (route) => readFile(
  route === '/'
    ? path.join(distRoot, 'index.html')
    : path.join(distRoot, route.replace(/^\//, ''), 'index.html'),
  'utf8',
);

const [robots, llms, sitemap] = await Promise.all([
  readProjectFile('public/robots.txt'),
  readProjectFile('public/llms.txt'),
  readProjectFile('public/sitemap.xml'),
]);

const requiredCrawlerTokens = [
  'Googlebot',
  'Google-Extended',
  'OAI-SearchBot',
  'GPTBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
];

for (const token of requiredCrawlerTokens) {
  assert.ok(robots.toLowerCase().includes('user-agent: ' + token.toLowerCase()), 'robots.txt must declare ' + token);
}

const llmsRoutes = [...llms.matchAll(/https:\/\/wincomehair\.com(\/[^\s)\]]*)?/g)]
  .map((match) => match[1] || '/')
  .map((route) => route.replace(/[.,;:]$/, ''));

assert.ok(llmsRoutes.length >= 20, 'llms.txt should expose primary company, product and buyer-guide URLs');

for (const route of new Set(llmsRoutes)) {
  const canonical = site + route;
  assert.ok(sitemap.includes('<loc>' + canonical + '</loc>'), 'llms.txt URL missing from sitemap: ' + canonical);
  await readBuiltRoute(route);
}

const [home, manufacturerProfile, sourcing, citedArticle] = await Promise.all([
  readBuiltRoute('/'),
  readBuiltRoute('/manufacturer-profile'),
  readBuiltRoute('/sourcing'),
  readBuiltRoute('/blog/best-claw-clips-fine-thin-hair'),
]);

assert.ok(home.includes(site + '/#organization'), 'Homepage must expose the stable Organization entity ID');
assert.ok(home.includes(site + '/#website'), 'Homepage must expose the stable WebSite entity ID');
assert.ok(llmsRoutes.includes('/manufacturer-profile'), 'llms.txt must link to the manufacturer profile');
assert.ok(manufacturerProfile.includes('ProfilePage'), 'Manufacturer profile must expose ProfilePage structured data');
assert.ok(manufacturerProfile.includes(site + '/#organization'), 'Manufacturer profile must reference the stable Organization entity');
assert.ok(manufacturerProfile.includes('Usually not the best fit'), 'Manufacturer profile must state both positive and negative buyer fit');
assert.ok(sourcing.includes('FAQPage'), 'Sourcing guide must expose its visible FAQ as structured data');
assert.ok(sourcing.includes(site + '/#organization'), 'Sourcing guide must reference the stable Organization entity');
assert.ok(citedArticle.includes('"citation"'), 'Research-backed article must expose source citations in structured data');
assert.ok(!/noindex/i.test(home + manufacturerProfile + sourcing + citedArticle), 'Core GEO routes must remain indexable');

console.log('AI discovery checks passed: ' + new Set(llmsRoutes).size + ' llms.txt URLs and ' + requiredCrawlerTokens.length + ' crawler directives verified');
