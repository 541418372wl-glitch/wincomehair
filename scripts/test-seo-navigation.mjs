import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { articles } from '../src/data/articles.js';

const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', { url: 'https://wincomehair.com/', pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const bundle = await build({
  stdin: { contents: 'import { h, render } from "preact"; import { MemoryRouter, useNavigate } from "react-router-dom"; import SEO, { getSeoMeta } from "./src/components/SEO.jsx"; export { getSeoMeta }; export let navigate; function Page() { navigate = useNavigate(); return h(SEO); } export const mount = () => render(h(MemoryRouter, null, h(Page)), document.getElementById("root")); export const unmount = () => render(null, document.getElementById("root"));', resolveDir: process.cwd(), loader: 'jsx' },
  bundle: true, write: false, format: 'esm', platform: 'browser', jsx: 'automatic',
  alias: { react: 'preact/compat', 'react-dom': 'preact/compat' },
  plugins: [{ name: 'summaries', setup(builder) {
    builder.onResolve({ filter: /^virtual:article-summaries$/ }, () => ({ path: 'summaries', namespace: 'test' }));
    builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const articles = ' + JSON.stringify(articles.map(({ content, ...summary }) => summary)) }));
  } }],
});
const app = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const flush = () => new Promise(resolve => setTimeout(resolve, 50));
const meta = name => document.querySelector('meta[name="' + name + '"]')?.content;
const canonical = () => document.querySelector('link[rel="canonical"]')?.href;
try {
  app.mount(); await flush();
  assert.match(meta('robots'), /^index/);
  assert.equal(canonical(), 'https://wincomehair.com/');
  app.navigate('/blog/' + articles[0].slug); await flush();
  assert.ok(document.querySelector('meta[property="article:published_time"]'));
  app.navigate('/blog/' + articles[0].slug + '/invalid'); await flush();
  assert.equal(meta('robots'), 'noindex');
  assert.equal(canonical(), undefined);
  assert.equal(document.querySelector('meta[property="article:published_time"]'), null);
  assert.equal(meta('description'), undefined);
  app.navigate('/products'); await flush();
  assert.match(meta('robots'), /^index/);
  assert.equal(canonical(), 'https://wincomehair.com/products');
  assert.ok(meta('description'));
  for (const route of ['/products/claw-acetate/invalid', '/products/category/hair-claw-clips/invalid', '/blog/unknown']) assert.equal(app.getSeoMeta(route), undefined);
} finally { app.unmount(); dom.window.close(); }
console.log('SEO article → 404 → indexed page metadata navigation tests passed');
