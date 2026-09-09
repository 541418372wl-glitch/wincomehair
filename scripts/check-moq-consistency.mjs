import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products, categoryMap } from '../src/data/productCatalog.js';
import { productMeta } from '../src/data/productMeta.js';
import { productCategoryContent } from '../src/data/productCategoryContent.js';
import { productCategoryMeta } from '../src/data/productCategoryMeta.js';
import { commercialLandingPages } from '../src/data/commercialLandingPages.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const expectedCustomMoq = {
  'claw-acetate': '1,000 pcs',
  'claw-metal': '1,000 pcs',
  'claw-plastic': '1,000 pcs',
  'claw-butterfly': '1,000 pcs',
  'claw-rectangular': '1,000 pcs',
  'claw-butterfly-resin': '1,000 pcs',
  'clip-pearl': '2,000 pcs',
  'clip-acetate': '2,000 pcs',
  'clip-matte': '2,000 pcs',
  'clip-crystal': '2,000 pcs',
  'clip-flower': '2,000 pcs',
  'clip-pearl-barrette': '2,000 pcs',
  'clip-acetate-snap': '2,000 pcs',
};

const expectedUnchangedMoq = {
  'headband-pearl': '200 pcs',
  'headband-knotted': '300 pcs',
  'headband-padded': '200 pcs',
  'headband-braided': '300 pcs',
  'headband-satin': '200 pcs',
  'scrunchie-silk': '200 pcs',
  'scrunchie-velvet': '300 pcs',
  'scrunchie-cotton': '500 pcs',
  'scrunchie-ruffled': '300 pcs',
  'scrunchie-bow': '300 pcs',
  'bow-satin': '300 pcs',
  'bow-grosgrain': '300 pcs',
  'bow-clip': '200 pcs',
  'bow-multilayer': '200 pcs',
  'bow-oversized': '200 pcs',
  'bow-satin-barrette': '200 pcs',
};

const productById = new Map(products.map(product => [product.id, product]));

for (const [id, expected] of Object.entries({ ...expectedCustomMoq, ...expectedUnchangedMoq })) {
  assert.equal(productById.get(id)?.moq, expected, `Catalog MOQ mismatch for ${id}`);
  assert.equal(productMeta[id]?.moq, expected, `SEO product metadata MOQ mismatch for ${id}`);
}

assert.equal(products.filter(product => product.category === 'hair-claw-clips').length, 6, 'Expected six Hair Claw Clips products');
assert.equal(products.filter(product => product.category === 'hair-clips-barrettes').length, 7, 'Expected seven Hair Clips & Barrettes products');

const productDetailSource = fs.readFileSync(path.join(projectRoot, 'src/pages/ProductDetail.jsx'), 'utf8');

function productDetailEntry(id) {
  const marker = `  '${id}': {`;
  const start = productDetailSource.indexOf(marker);
  assert.notEqual(start, -1, `Missing ProductDetail entry for ${id}`);
  const next = productDetailSource.indexOf("\n  '", start + marker.length);
  return productDetailSource.slice(start, next === -1 ? productDetailSource.length : next);
}

for (const [id, expected] of Object.entries({ ...expectedCustomMoq, ...expectedUnchangedMoq })) {
  assert.match(productDetailEntry(id), new RegExp(`moq: '${expected}'`), `ProductDetail MOQ mismatch for ${id}`);
}

assert.deepEqual(
  productCategoryContent['hair-claw-clips'].facts[0],
  { label: 'Custom MOQ', value: '1,000 pcs', note: 'Per design per color' },
  'Hair claw category fact must state the approved MOQ basis',
);
assert.deepEqual(
  productCategoryContent['hair-clips-barrettes'].facts[0],
  { label: 'Custom MOQ', value: '2,000 pcs', note: 'Per design per color' },
  'Hair clip category fact must state the approved MOQ basis',
);
assert.match(categoryMap['hair-claw-clips'].faq[0].a, /1,000 pieces per design per color/i);
assert.match(categoryMap['hair-clips-barrettes'].faq[3].a, /2,000 pieces per design per color/i);
assert.match(productCategoryMeta['hair-claw-clips'].description, /1,000 pieces per design per color/i);
assert.match(commercialLandingPages.hairClips.metaDescription, /2,000 pieces per design per color/i);

const contactSource = fs.readFileSync(path.join(projectRoot, 'src/pages/Contact.jsx'), 'utf8');
for (const required of [
  'sample-stock-below-moq',
  'Custom production MOQ: 1,000 pcs per design per color.',
  'Custom production MOQ: 2,000 pcs per design per color.',
  "'1000-1999'",
  "'2000-4999'",
]) {
  assert.ok(contactSource.includes(required), `Contact form is missing MOQ policy text: ${required}`);
}
for (const obsolete of ['100-300', '300-1000', '1000-5000']) {
  assert.ok(!contactSource.includes(obsolete), `Contact form still exposes obsolete quantity value: ${obsolete}`);
}

const publicPolicySources = [
  'index.html',
  'public/llms.txt',
  'public/structured-data.json',
  'src/components/Footer.jsx',
  'src/components/SEO.jsx',
  'src/data/articles.js',
  'src/data/commercialLandingPages.js',
  'src/data/productCatalog.js',
  'src/data/productCategoryContent.js',
  'src/data/productCategoryMeta.js',
  'src/data/productMeta.js',
  'src/pages/Blog.jsx',
  'src/pages/BlogPost.jsx',
  'src/pages/Contact.jsx',
  'src/pages/Customization.jsx',
  'src/pages/FAQ.jsx',
  'src/pages/Home.jsx',
  'src/pages/ManufacturerProfile.jsx',
  'src/pages/ProductDetail.jsx',
  'src/pages/Products.jsx',
  'src/pages/Sourcing.jsx',
];
const obsoleteClaims = [
  /MOQ from 100/i,
  /MOQ starts (?:at|from) 100/i,
  /From 100 pcs/i,
  /starts? eligible designs at 100/i,
  /100[–-]500 pcs/i,
];

for (const relativePath of publicPolicySources) {
  const source = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
  for (const obsoleteClaim of obsoleteClaims) {
    assert.doesNotMatch(source, obsoleteClaim, `Obsolete MOQ claim in ${relativePath}`);
  }
}

const llmsSource = fs.readFileSync(path.join(projectRoot, 'public/llms.txt'), 'utf8');
assert.match(llmsSource, /Hair Claws & Clips production MOQ is 1,000 pieces per design per color/);
assert.match(llmsSource, /Hair Clips & Barrettes production MOQ is 2,000 pieces per design per color/);
assert.match(llmsSource, /Samples and in-stock items may be available below the custom production MOQ/);

console.log('[moq-consistency] 13 updated product MOQs, 16 unchanged product MOQs, form policy and public claims verified');
