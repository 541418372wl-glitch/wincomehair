import { products } from './productCatalog.js';
import { selectedProducts, selectedProductInquiryCategory } from './selectedProductStyles.js';

// Only existing site products may supply form context. Query parameters never
// provide a title, link, MOQ policy or arbitrary message text.
const inquiryProducts = new Map([
  ...selectedProducts.map(product => [product.slug, product]),
  ...products.map(product => [product.id, {
    slug: product.id,
    title: product.name,
    category: product.category,
    customProduction: true,
  }]),
]);

export function findInquiryProduct(slug) {
  return inquiryProducts.get(slug);
}

export function inquiryProductCategory(product) {
  return product?.category === 'hair-clips-barrettes'
    ? 'pins'
    : selectedProductInquiryCategory(product);
}
