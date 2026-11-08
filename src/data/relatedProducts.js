import { products } from './productCatalog.js';
import { selectedProducts } from './selectedProductStyles.js';

const navigationProducts = [
  ...selectedProducts.map(product => ({
    id: product.slug,
    name: product.title,
    category: product.category,
    image: product.image,
    alt: product.alt,
    imageWidth: product.imageWidth,
    imageHeight: product.imageHeight,
  })),
  ...products.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    image: product.image,
    alt: product.name,
    imageWidth: 1024,
    imageHeight: 1024,
  })),
];

const productsById = new Map(navigationProducts.map(product => [product.id, product]));
const productsByCategory = new Map();
for (const product of navigationProducts) {
  const siblings = productsByCategory.get(product.category) || [];
  siblings.push(product);
  productsByCategory.set(product.category, siblings);
}

export function getRelatedProducts(productId) {
  const current = productsById.get(productId);
  if (!current) return [];
  const siblings = productsByCategory.get(current.category);
  const position = siblings.findIndex(product => product.id === productId);
  // Rotate within the category so every style receives links, including later
  // catalog additions; selected styles and custom directions share the same ring.
  return Array.from({ length: Math.min(3, siblings.length - 1) }, (_, offset) =>
    siblings[(position + offset + 1) % siblings.length]
  );
}
