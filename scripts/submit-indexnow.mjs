import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = new URL(process.env.INDEXNOW_SITE || 'https://wincomehair.com');
const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const defaultKey = '6a6e859e7ea749c08bbe06518ce8c76e';
const key = process.env.INDEXNOW_KEY?.trim() || defaultKey;
const dryRun = process.argv.includes('--dry-run') || process.env.INDEXNOW_DRY_RUN === '1';

const sitemap = await readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);
const urlList = [...new Set(sitemapUrls)].filter((url) => new URL(url).hostname === site.hostname);

if (!urlList.length) throw new Error('No same-host URLs were found in public/sitemap.xml');
if (urlList.length > 10_000) throw new Error('IndexNow accepts no more than 10,000 URLs per request');

if (dryRun) {
  console.log(`IndexNow dry run: ${urlList.length} URLs ready for ${site.hostname}`);
  process.exit(0);
}

if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  throw new Error('Set INDEXNOW_KEY to a valid 8–128 character key, or use --dry-run to validate the sitemap payload');
}

const keyLocation = process.env.INDEXNOW_KEY_LOCATION?.trim() || `${site.origin}/${key}.txt`;
const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: site.hostname, key, keyLocation, urlList }),
});

if (![200, 202].includes(response.status)) {
  const body = (await response.text()).slice(0, 500);
  throw new Error(`IndexNow submission failed with HTTP ${response.status}${body ? `: ${body}` : ''}`);
}

console.log(`IndexNow accepted ${urlList.length} URLs for ${site.hostname} (HTTP ${response.status})`);
