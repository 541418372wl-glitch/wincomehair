import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const minDescription = 105;
const maxDescription = 155;

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function findIndexFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findIndexFiles(fullPath);
    return entry.isFile() && entry.name === 'index.html' ? [fullPath] : [];
  }));
  return nested.flat();
}

const files = await findIndexFiles(dist);
const descriptions = [];

for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  const match = html.match(/<meta name="description" content="([^"]*)">/i);
  if (!match) throw new Error(`Missing meta description: ${path.relative(dist, file)}`);
  const description = decodeHtml(match[1]);
  const routeDirectory = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
  const route = routeDirectory ? `/${routeDirectory}` : '/';
  if (description.length < minDescription || description.length > maxDescription) {
    throw new Error(`Meta description length ${description.length} outside ${minDescription}-${maxDescription}: ${route}`);
  }
  descriptions.push({ route, description });
}

const duplicates = descriptions.filter((item, index, items) => (
  items.findIndex((candidate) => candidate.description.toLowerCase() === item.description.toLowerCase()) !== index
));
if (duplicates.length) {
  throw new Error(`Duplicate meta descriptions: ${duplicates.map((item) => item.route).join(', ')}`);
}

const imageBudgets = [
  [/product-.*-640\.avif$/, 50],
  [/product-.*-640\.webp$/, 60],
  [/hero-clips(?:-mobile)?\.avif$/, 70],
];
const imageDirectory = path.join(dist, 'assets', 'images');
const imageNames = await fs.readdir(imageDirectory);

for (const [pattern, budgetKB] of imageBudgets) {
  const matches = imageNames.filter((name) => pattern.test(name));
  if (!matches.length) throw new Error(`No generated image matched ${pattern}`);
  for (const name of matches) {
    const stat = await fs.stat(path.join(imageDirectory, name));
    if (stat.size > budgetKB * 1024) {
      throw new Error(`${name} exceeds ${budgetKB} KB budget: ${(stat.size / 1024).toFixed(1)} KB`);
    }
  }
}

const homeHtml = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const inlineStyle = homeHtml.match(/<style>([\s\S]*?)<\/style>/i)?.[1];
if (!inlineStyle) throw new Error('Built home page has no inline style block');
const styleHash = `sha256-${createHash('sha256').update(inlineStyle).digest('base64')}`;
const vercelConfig = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'));
const globalHeaders = vercelConfig.headers.find(({ source }) => source === '/(.*)')?.headers || [];
const csp = globalHeaders.find(({ key }) => key.toLowerCase() === 'content-security-policy-report-only')?.value || '';
if (!csp.includes(`'${styleHash}'`)) {
  throw new Error(`CSP Report-Only is missing current inline style hash: ${styleHash}`);
}

const lengths = descriptions.map(({ description }) => description.length);
console.log(
  `[generated-assets] ${descriptions.length} unique descriptions; `
  + `length ${Math.min(...lengths)}-${Math.max(...lengths)}; responsive AVIF/WebP and CSP hash budgets passed`,
);
