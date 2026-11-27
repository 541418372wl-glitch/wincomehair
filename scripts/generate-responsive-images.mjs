import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'public');
const manifestPath = path.join(root, 'src/generated/imageManifest.json');
const widths = [320, 480, 640, 800, 1024];
const recipe = 'v1-320-480-640-800-1024-avif54e6-webp78';
const manifest = {};
let generated = 0;

async function previousManifest() {
  try { return JSON.parse(await fs.readFile(manifestPath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; return {}; }
}

async function writeAtomic(file, contents) {
  const staging = file + '.' + randomUUID() + '.tmp';
  try {
    await fs.writeFile(staging, contents);
    await fs.rename(staging, file);
  } finally {
    await fs.rm(staging, { force: true });
  }
}

async function encode(source, width, format, budget) {
  let quality = format === 'avif' ? 54 : 78;
  while (quality >= 30) {
    const resize = sharp(source).resize({ width, withoutEnlargement: true });
    const bytes = await (format === 'avif' ? resize.avif({ quality, effort: 6 }) : resize.webp({ quality })).toBuffer();
    if (!budget || bytes.length <= budget) return bytes;
    quality -= 4;
  }
  throw new Error('Cannot meet ' + format + ' image budget at width ' + width);
}

async function generate(src, previous) {
  const inputFile = path.join(publicDir, src);
  const source = await fs.readFile(inputFile);
  const fingerprint = createHash('sha256').update(recipe).update(source).digest('hex');
  const { width, height } = await sharp(source).metadata();
  if (!width || !height) throw new Error('Missing image dimensions for ' + src);
  const sizes = [...new Set(widths.map(size => Math.min(width, size)))];
  const variants = { avif: [], webp: [] };
  for (const size of sizes) {
    for (const format of Object.keys(variants)) {
      // The native WebP remains the fallback and is never re-encoded in place.
      const output = size === width && src.endsWith('.' + format) ? src
        : src.replace(/\.[^.]+$/, '-' + size + 'w.' + format);
      const file = path.join(publicDir, output);
      if (output !== src && (previous?.fingerprint !== fingerprint || !(await fs.stat(file).catch(() => null))?.size)) {
        const budget = size === 640 && path.basename(src).startsWith('product-') ? (format === 'avif' ? 50 : 60) * 1024 : 0;
        await writeAtomic(file, await encode(source, size, format, budget));
        generated++;
      }
      variants[format].push(output + ' ' + size + 'w');
    }
  }
  return { width, height, avifSrcSet: variants.avif.join(', '), webpSrcSet: variants.webp.join(', '), fingerprint };
}

const previous = await previousManifest();
const sources = [];
for (const directory of ['assets/images', 'images/blog']) {
  for (const file of await fs.readdir(path.join(publicDir, directory))) {
    if (!/\.(webp|jpe?g|png)$/i.test(file) || /-\d+w?\.[^.]+$/i.test(file)) continue;
    if (directory === 'assets/images' && !/^(product|selected|blog|claw|clip|bow|scrunchie|headband)-/i.test(file)) continue;
    sources.push('/' + directory + '/' + file);
  }
}
sources.sort();
// Bound encoder memory and keep manifest order stable on all platforms.
const pending = sources.values();
async function worker() {
  for (const src of pending) manifest[src] = await generate(src, previous[src]);
}
await Promise.all([worker(), worker(), worker()]);
const sorted = Object.fromEntries(sources.map(src => [src, manifest[src]]));
await fs.mkdir(path.dirname(manifestPath), { recursive: true });
if (JSON.stringify(sorted) !== JSON.stringify(previous)) {
  await writeAtomic(manifestPath, JSON.stringify(sorted, null, 2) + '\n');
}
console.log('[images] ' + sources.length + ' source images, ' + generated + ' derivatives written');
