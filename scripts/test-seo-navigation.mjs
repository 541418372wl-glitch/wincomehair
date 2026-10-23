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
  stdin: { contents: 'import { h, render } from "preact"; import { MemoryRouter, useNavigate, Routes, Route } from "react-router-dom"; import SEO, { getSeoMeta } from "./src/components/SEO.jsx"; import NavigationScroll from "./src/components/NavigationScroll.jsx"; import BlogPost from "./src/pages/BlogPost.jsx"; import ProductDetail from "./src/pages/ProductDetail.jsx"; import ProductCategory from "./src/pages/ProductCategory.jsx"; export { getSeoMeta }; export let navigate; function Page() { navigate = useNavigate(); return [h(SEO), h(NavigationScroll)]; } export const mount = () => render(h(MemoryRouter, null, h(Page)), document.getElementById("root")); export const mountProduct = url => render(h(MemoryRouter, { initialEntries: [url] }, [h(SEO), h(Routes, null, [h(Route, { path: "/products/category/:category", element: h(ProductCategory) }), h(Route, { path: "/products/:id", element: h(ProductDetail) })])]), document.getElementById("root")); export const mountBlog = url => render(h(MemoryRouter, { initialEntries: [url] }, [h(SEO), h(Routes, null, h(Route, { path: "/blog/:slug", element: h(BlogPost) }))]), document.getElementById("root")); export const unmount = () => render(null, document.getElementById("root"));', resolveDir: process.cwd(), loader: 'jsx' },
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

  // The host serves directory-style URLs too. Rendering a valid route with a
  // trailing slash must retain indexable metadata and its unsuffixed canonical.
  for (const route of ['/products', '/contact', '/products/claw-acetate', '/products/category/hair-claw-clips', '/blog/' + articles[0].slug]) {
    app.navigate(route + '/'); await flush();
    assert.match(meta('robots'), /^index/, 'Valid trailing-slash route must remain indexable: ' + route);
    assert.equal(canonical(), 'https://wincomehair.com' + route);
    assert.equal(document.querySelector('meta[property="og:url"]').content, canonical());
    assert.deepEqual(app.getSeoMeta(route + '/'), app.getSeoMeta(route));
  }
  app.navigate('/products/not-a-product/'); await flush();
  assert.equal(meta('robots'), 'noindex', 'Normalization must not make unknown routes indexable');
  assert.equal(canonical(), undefined);
  app.unmount();
  app.mountBlog('/blog/' + articles[0].slug + '/'); await flush();
  assert.match(meta('robots'), /^index/);
  const articleSchema = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap(node => JSON.parse(node.textContent)['@graph'] || [])
    .find(node => node['@type'] === 'Article');
  assert.equal(articleSchema.mainEntityOfPage, 'https://wincomehair.com/blog/' + articles[0].slug, 'Article JSON-LD must agree with the canonical on a trailing-slash URL');
  assert.equal(articleSchema.mainEntityOfPage, canonical());
  for (const slug of ['toString', '__proto__', 'constructor']) {
    for (const category of [false, true]) {
      const route = `/products/${category ? 'category/' : ''}${slug}/`;
      assert.equal(app.getSeoMeta(route), undefined, 'Object prototype properties are not site routes');
      app.unmount(); app.mountProduct(route); await flush();
      assert.match(document.body.textContent, category ? /Product category not found/ : /Product not found/);
      assert.equal(meta('robots'), 'noindex');
      assert.equal(canonical(), undefined);
    }
  }
} finally { app.unmount(); dom.window.close(); }
console.log('SEO metadata and route scroll navigation tests passed');
