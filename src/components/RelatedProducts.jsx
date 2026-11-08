import { Link } from 'react-router-dom';
import { categoryMap } from '../data/productCatalog';
import { getRelatedProducts } from '../data/relatedProducts';

export default function RelatedProducts({ productId, category }) {
  const related = getRelatedProducts(productId);
  const categoryPage = categoryMap[category];
  if (!categoryPage || !related.length) return null;

  return (
    <section id="related-products" aria-labelledby="related-products-title" className="scroll-mt-28 mt-16 border-t border-bronze/10 pt-10">
      <p className="section-label">Explore the Category</p>
      <h2 id="related-products-title" className="text-display-sm text-navy mb-4">Related Products</h2>
      <p className="text-sm text-tan leading-relaxed max-w-3xl mb-8">Compare other {categoryPage.shortName.toLowerCase()} styles. Review each product's own specifications, available options and order requirements before requesting samples.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="group block border border-bronze/10 bg-white p-5 hover:border-bronze/25">
            <img src={product.image} alt={product.alt} width={product.imageWidth} height={product.imageHeight} loading="lazy" decoding="async" className="w-full h-48 object-contain mb-4" />
            <h3 className="text-lg font-display text-navy group-hover:text-gold">{product.name}</h3>
            <span className="inline-block mt-3 text-sm text-gold">View product details →</span>
          </Link>
        ))}
      </div>
      <Link to={`/products/category/${category}`} className="inline-flex mt-6 text-sm font-medium text-navy underline underline-offset-4 hover:text-gold">Explore all {categoryPage.shortName} →</Link>
    </section>
  );
}
