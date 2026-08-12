import { Link, useParams } from 'react-router-dom';
import { categoryMap, categoryProducts, productCategories } from '../data/productCatalog';

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden border border-bronze/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-sand">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="1024"
          height="1024"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-tan">{product.material}</p>
        <h2 className="mb-3 text-base font-display text-navy transition-colors group-hover:text-gold">{product.name}</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="bg-sand/60 px-2 py-1 text-[10px] uppercase tracking-wider text-tan">MOQ: {product.moq}</span>
          <span className="bg-sand/60 px-2 py-1 text-[10px] uppercase tracking-wider text-tan">{product.leadTime}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-navy transition-colors group-hover:text-gold">
          View Specifications <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function ProductCategory() {
  const { category } = useParams();
  const data = categoryMap[category];

  if (!data) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-display-md text-navy">Product category not found</h1>
        <Link to="/products" className="mt-5 inline-block text-gold underline">Browse all products</Link>
      </div>
    );
  }

  const items = categoryProducts(category);
  const url = `https://wincomehair.com/products/category/${category}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: data.title,
        description: data.description,
        url,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: `https://wincomehair.com/products/${product.id}`,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-site pb-14 pt-12 md:pb-20 md:pt-20">
        <p className="section-label">Factory-Direct Product Category</p>
        <h1 className="max-w-4xl text-display-lg leading-tight text-navy">{data.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-tan">{data.intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary justify-center">Request a Category Quote</Link>
          <Link to="/customization" className="btn-outline justify-center">Explore OEM / ODM</Link>
        </div>
      </section>

      <section className="border-y border-bronze/10 bg-sand/40">
        <div className="container-site py-10 md:py-14">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.15em] text-tan">Compare All Categories</p>
          <nav aria-label="Product categories" className="flex gap-2 overflow-x-auto pb-2">
            {productCategories.map(item => (
              <Link
                key={item.slug}
                to={`/products/category/${item.slug}`}
                aria-current={item.slug === category ? 'page' : undefined}
                className={`shrink-0 border px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                  item.slug === category ? 'border-navy bg-navy text-white' : 'border-bronze/20 bg-white text-tan hover:border-navy hover:text-navy'
                }`}
              >
                {item.shortName}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="container-site section-gap">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="section-label">Customizable Collection</p>
            <h2 className="text-display-md text-navy">Explore {items.length} <span className="text-gold">Product Directions</span></h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-navy underline underline-offset-4 hover:text-gold">View the full product catalog</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="container-site section-gap">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <div>
              <p className="section-label !text-champagne">Buyer Checklist</p>
              <h2 className="text-display-md">What to Define Before Sampling</h2>
            </div>
            <div className="space-y-4">
              {data.buyerNotes.map((note, index) => (
                <div key={note} className="flex gap-4 border-b border-white/10 pb-4 text-white/70">
                  <span className="text-champagne">0{index + 1}</span>
                  <p className="leading-relaxed">{note}</p>
                </div>
              ))}
              <p className="pt-3 leading-relaxed text-white/60">
                Confirm target customer, retail price, dimensions, materials, color references, branding and packaging before requesting a sample. WINCOME can then compare construction options and provide a production-ready quotation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site section-gap">
        <p className="section-label">Category FAQ</p>
        <h2 className="mb-8 text-display-md text-navy">Questions Buyers Ask</h2>
        <div className="max-w-3xl space-y-3">
          {data.faq.map(item => (
            <details key={item.q} className="group border border-bronze/10 bg-white open:border-bronze/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                <span className="text-sm font-medium text-navy">{item.q}</span>
                <span aria-hidden="true" className="shrink-0 text-lg leading-none text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-tan">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
