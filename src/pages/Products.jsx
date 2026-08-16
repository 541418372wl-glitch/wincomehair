import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products as catalogProducts, productCategories } from '../data/productCatalog';

const categoryLabels = {
  'hair-claw-clips': 'Claws & Clips',
  headbands: 'Headbands',
  scrunchies: 'Scrunchies',
  'hair-bows': 'Bows & Ribbons',
  'hair-clips-barrettes': 'Hair Clips & Barrettes',
};

const allProducts = catalogProducts.map(product => ({
  ...product,
  category: categoryLabels[product.category],
}));

const categories = ['All', 'Claws & Clips', 'Headbands', 'Scrunchies', 'Bows & Ribbons', 'Hair Clips & Barrettes'];

export default function Products() {
  const [activeCat, setActiveCat] = useState('All');
  const filtered = activeCat === 'All' ? allProducts : allProducts.filter(p => p.category === activeCat);

  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <p className="section-label">Wholesale Product Catalog</p>
        <h1 className="max-w-4xl text-display-lg text-navy mb-4">Wholesale Hair Accessories for <span className="text-gold">Brands & Retailers</span></h1>
        <p className="text-tan text-lg max-w-3xl mb-10 leading-relaxed">
          Explore {allProducts.length} customizable hair clips, claw clips, headbands, scrunchies and bows. Choose an existing production direction, then specify the size, color, material, finish, logo and retail packaging for your market.
        </p>

        <div className="mb-12 grid grid-cols-2 border border-bronze/10 bg-white md:grid-cols-4" aria-label="Wholesale program facts">
          {[
            ['From 100 pcs', 'Starting MOQ'],
            ['5–7 days', 'Physical sampling'],
            ['8–18 days', 'Typical production'],
            ['50+ countries', 'Export experience'],
          ].map(([value, label], index) => (
            <div key={label} className={`p-5 md:p-6 ${index < 3 ? 'md:border-r md:border-bronze/10' : ''} ${index < 2 ? 'border-b border-bronze/10 md:border-b-0' : ''} ${index % 2 === 0 ? 'border-r border-bronze/10 md:border-r' : ''}`}>
              <p className="font-display text-xl text-navy">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-tan">{label}</p>
            </div>
          ))}
        </div>

        <nav aria-label="Product category pages" className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {productCategories.map(category => (
            <Link
              key={category.slug}
              to={`/products/category/${category.slug}`}
              className="border border-bronze/10 bg-white p-4 text-sm font-medium text-navy transition-colors hover:border-gold hover:text-gold"
            >
              {category.shortName} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>

        {/* Category filters (sticky on mobile for long lists) */}
        <div className="sticky top-16 md:top-20 z-30 bg-cream/95 backdrop-blur-sm -mx-4 px-4 py-3 mb-10 border-b border-bronze/10">
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
            {categories.map(cat => {
              const count = cat === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat).length;
              const isActive = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`shrink-0 px-4 py-2 text-xs font-medium tracking-wider uppercase border transition-colors duration-200 ${
                    isActive ? 'border-navy bg-navy text-white' : 'border-bronze/20 text-tan hover:border-navy hover:text-navy'
                  }`}
                >
                  {cat} <span className={isActive ? 'text-white/60' : 'text-tan/50'}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="group bg-white overflow-hidden border border-bronze/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="text-[10px] tracking-wider uppercase text-tan mb-2">{product.category}</p>
                <h3 className="text-base font-display text-navy mb-3 group-hover:text-gold transition-colors">{product.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] tracking-wider uppercase bg-sand/60 text-tan px-2 py-1">MOQ: {product.moq}</span>
                  <span className="text-[10px] tracking-wider uppercase bg-sand/60 text-tan px-2 py-1">{product.leadTime}</span>
                </div>
                <span className="text-xs font-medium tracking-wider uppercase text-navy group-hover:text-gold transition-colors inline-flex items-center gap-1">
                  View Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-20 border border-bronze/10 bg-sand/35 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="section-label">Planning a First Order?</p>
              <h2 className="text-display-sm text-navy">Compare MOQ, Samples and Production Before Requesting a Quote</h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-tan">Our buyer guide explains minimum quantities by product type, the 5–7 day sampling process, bulk-production milestones, payment terms and international shipping options.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link to="/sourcing" className="btn-primary justify-center">View Order Process</Link>
              <Link to="/customization" className="btn-outline justify-center">Explore OEM / ODM</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
