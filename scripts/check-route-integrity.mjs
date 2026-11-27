import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { selectedProducts, selectedProductPath } from '../src/data/selectedProductStyles.js';
import { products as catalogProducts } from '../src/data/productCatalog.js';

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
const titles = new Set();
const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.vite/manifest.json'), 'utf8'));
let links = 0;
for (const route of routes) {
  const file = path.join(dist, route, 'index.html');
  const dom = new JSDOM(fs.readFileSync(file, 'utf8'), { url: origin + route });
  const doc = dom.window.document;
  const title = doc.title.trim();
  if (doc.head.querySelectorAll('title').length !== 1 || !title || titles.has(title)) failures.push(route + ': missing or duplicate title');
  titles.add(title);
  if (doc.head.querySelectorAll('meta[name="description"]').length !== 1 || doc.head.querySelectorAll('link[rel="canonical"]').length !== 1) failures.push(route + ': duplicate or missing metadata');
  if (doc.querySelector('#product-jsonld')) failures.push(route + ': unexpected product JSON-LD');
  if ([...doc.head.querySelectorAll('script[src]')].some(script => new URL(script.src).origin !== origin && !script.async && !script.defer && script.type !== 'module')) failures.push(route + ': blocking external script');
  if (doc.querySelectorAll('h1').length !== 1) failures.push(route + ': expected one H1');
  if (doc.querySelector('link[rel="canonical"]')?.href !== origin + route) failures.push(route + ': canonical mismatch');
  for (const node of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try { JSON.parse(node.textContent); } catch { failures.push(route + ': invalid JSON-LD'); }
  }
  for (const img of doc.querySelectorAll('img')) if (!img.hasAttribute('alt')) failures.push(route + ': image lacks alt');
  const inquiryProduct = [...selectedProducts.map(product => product.slug), ...catalogProducts.map(product => product.id)]
    .find(slug => route === `/products/${slug}`);
  const article = route.startsWith('/blog/');
  const routeModule = inquiryProduct ? 'ProductDetail' : article ? 'BlogPost' : route === '/contact' ? 'SelectedContactRoute' : null;
  if (routeModule) {
    const entry = manifest['src/pages/' + routeModule + '.jsx'];
    if (!entry || !doc.head.querySelector(`link[rel="modulepreload"][href="/${entry.file}"]`)) failures.push(route + ': route chunk missing from head');
  }
  const preloads = [...doc.head.querySelectorAll('link[rel="preload"][as="image"]')];
  if (inquiryProduct || article) {
    const hero = doc.querySelector('main picture img[fetchpriority="high"]');
    const source = hero?.parentElement.querySelector('source[type="image/avif"]');
    if (!source || preloads.length !== 1 || preloads[0].type !== 'image/avif' || hero.getAttribute('loading') !== 'eager'
      || preloads[0].getAttribute('imagesrcset') !== source.getAttribute('srcset')
      || preloads[0].getAttribute('imagesizes') !== source.getAttribute('sizes')) failures.push(route + ': hero and responsive preload must match');
  } else if (preloads.length !== (route === '/' ? 1 : 0)) failures.push(route + ': unexpected number of image preloads');
  if (inquiryProduct) {
    const allProducts = [...selectedProducts.map(product => ({ id: product.slug, category: product.category })), ...catalogProducts];
    const category = allProducts.find(product => product.id === inquiryProduct)?.category;
    const recommendations = doc.querySelector('#related-products');
    const productLinks = [...(recommendations?.querySelectorAll('a[href^="/products/"]') || [])]
      .map(link => link.getAttribute('href'))
      .filter(href => !href.startsWith('/products/category/'));
    if (productLinks.length !== 3 || new Set(productLinks).size !== 3) failures.push(route + ': expected three static related-product links');
    for (const href of productLinks) {
      const sibling = allProducts.find(product => href === `/products/${product.id}`);
      if (!sibling || sibling.id === inquiryProduct || sibling.category !== category) failures.push(route + ': invalid same-category recommendation ' + href);
    }
    if (!recommendations?.querySelector(`a[href="/products/category/${category}"]`)) failures.push(route + ': missing related-products category link');
    const wa = doc.querySelector('main a[data-analytics-location="selected_pdp_inquiry"], main a[data-analytics-location="product_primary"]');
    if (!wa || !new URL(wa.href).searchParams.get('text')?.includes('(' + inquiryProduct + ')')) failures.push(route + ': missing product-specific WhatsApp quote');
    const formLinks = [...doc.querySelectorAll('main a[href^="/contact"]')];
    if (formLinks.length !== 2 || formLinks.some(link => link.getAttribute('href') !== `/contact?product=${inquiryProduct}#stock-inquiry`)) {
      failures.push(route + ': product inquiry links must retain the product context');
    }
  }
  // Every selected style, including future additions, must have a real detail
  // route and consistent image, name and primary action links on its category.
  for (const product of selectedProducts.filter(item => route === `/products/category/${item.category}`)) {
    const target = selectedProductPath(product);
    const card = doc.getElementById(`selection-${product.id}`);
    if (!routes.includes(target)) failures.push(route + ': missing product detail route ' + target);
    for (const selector of ['.selected-style-photo', 'h3 a', '.selected-style-open']) {
      const link = card?.querySelector(selector);
      if (link?.tagName !== 'A' || link.getAttribute('href') !== target) failures.push(route + ': product detail entry mismatch ' + product.id + ' ' + selector);
    }
    if (product.category === 'hair-claw-clips' && !card?.querySelector(`a[href="/contact?product=${product.slug}#stock-inquiry"]`)) {
      failures.push(route + ': missing style-specific quote link for ' + product.slug);
    }
    if (card?.querySelector('dialog')) failures.push(route + ': selected style must open a detail page, not a dialog: ' + product.id);
  }
  if (route === '/products/category/hair-claw-clips' && !doc.querySelector('.selected-styles-brief a[href="/contact?category=hair-claw-clips#stock-inquiry"]')) {
    failures.push(route + ': comparison inquiry must retain the claw category');
  }
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
