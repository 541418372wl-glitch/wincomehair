import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { articles } from '../src/data/articles.js';

const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', { url: 'https://wincomehair.com/', pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const scrollCalls = [];
window.scrollTo = options => scrollCalls.push(options);
const bundle = await build({
  stdin: { contents: 'import { h, render } from "preact"; import { MemoryRouter, useNavigate } from "react-router-dom"; import SEO, { getSeoMeta } from "./src/components/SEO.jsx"; import NavigationScroll from "./src/components/NavigationScroll.jsx"; export { getSeoMeta }; export let navigate; function Page() { navigate = useNavigate(); return [h(SEO), h(NavigationScroll)]; } export const mount = () => render(h(MemoryRouter, null, h(Page)), document.getElementById("root")); export const unmount = () => render(null, document.getElementById("root"));', resolveDir: process.cwd(), loader: 'jsx' },
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
  assert.equal(scrollCalls.length, 0, 'initial history load does not reset scrolling');
  assert.match(meta('robots'), /^index/);
  assert.equal(canonical(), 'https://wincomehair.com/');
  app.navigate('/blog/' + articles[0].slug); await flush();
  assert.deepEqual(scrollCalls.at(-1), { top: 0, left: 0, behavior: 'instant' });
  assert.equal(scrollCalls.length, 1);
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
  assert.equal(scrollCalls.length, 3);
  app.navigate('/products#catalog'); await flush();
  assert.equal(scrollCalls.length, 3, 'hash navigation retains anchor scrolling');
  app.navigate('/contact', { replace: true }); await flush();
  assert.equal(scrollCalls.length, 4, 'replacement navigation starts at the top');
  app.navigate(-1); await flush();
  assert.equal(scrollCalls.length, 4, 'back navigation is left to browser restoration');
  for (const route of ['/products/claw-acetate/invalid', '/products/category/hair-claw-clips/invalid', '/blog/unknown']) assert.equal(app.getSeoMeta(route), undefined);
} finally { app.unmount(); dom.window.close(); }
console.log('SEO metadata and route scroll navigation tests passed');
