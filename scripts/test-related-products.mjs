import assert from 'node:assert/strict';
import { products, productCategories } from '../src/data/productCatalog.js';
import { selectedProducts } from '../src/data/selectedProductStyles.js';
import { getRelatedProducts } from '../src/data/relatedProducts.js';

const all = [...products, ...selectedProducts.map(product => ({ id: product.slug, category: product.category }))];
const existing = new Set(all.map(product => product.id));
const incoming = new Map(all.map(product => [product.id, 0]));

for (const product of all) {
  const related = getRelatedProducts(product.id);
  assert.equal(related.length, Math.min(3, all.filter(item => item.category === product.category).length - 1));
  assert.equal(new Set(related.map(item => item.id)).size, related.length, `Duplicate links: ${product.id}`);
  for (const recommendation of related) {
    assert.ok(existing.has(recommendation.id), `Unknown product: ${recommendation.id}`);
    assert.notEqual(recommendation.id, product.id, `Self link: ${product.id}`);
    assert.equal(recommendation.category, product.category, `Unrelated category: ${product.id}`);
    assert.ok(recommendation.image && recommendation.alt && recommendation.imageWidth && recommendation.imageHeight);
    incoming.set(recommendation.id, incoming.get(recommendation.id) + 1);
  }
}

for (const product of all) assert.ok(incoming.get(product.id) > 0, `No incoming product recommendation: ${product.id}`);

// A recommendation path must connect the full category, not separate selected
// styles from the legacy catalog or repeatedly promote only the first few items.
for (const category of productCategories) {
  const siblings = all.filter(product => product.category === category.slug);
  for (const start of siblings) {
    const visited = new Set();
    const pending = [start.id];
    while (pending.length) {
      const id = pending.pop();
      if (visited.has(id)) continue;
      visited.add(id);
      pending.push(...getRelatedProducts(id).map(product => product.id));
    }
    assert.equal(visited.size, siblings.length, `Disconnected recommendation group: ${category.slug}/${start.id}`);
  }
}
assert.deepEqual(getRelatedProducts('missing-product'), []);
console.log(`[related-products] ${all.length} products: valid same-category links, incoming coverage and complete category connectivity verified`);
