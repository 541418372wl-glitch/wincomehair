import { Link, useParams } from 'react-router-dom';
import { categoryMap, categoryProducts, productCategories } from '../data/productCatalog';
import { productCategoryContent } from '../data/productCategoryContent';
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from '../components/SEO';

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
  const content = productCategoryContent[category];
  const url = SITE + '/products/category/' + category;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: data.title,
        description: data.description,
        url,
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORGANIZATION_ID },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: SITE + '/products/' + product.id,
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
        <p className="mt-4 max-w-3xl leading-relaxed text-bronze/80">{content.positioning}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary justify-center">Request a Category Quote</Link>
          <Link to="/customization" className="btn-outline justify-center">Explore OEM / ODM</Link>
        </div>
      </section>

      <section className="container-site pb-14 md:pb-20" aria-label={`${data.shortName} order facts`}>
        <div className="grid grid-cols-2 border border-bronze/10 bg-white md:grid-cols-4">
          {content.facts.map((fact, index) => (
            <div
              key={fact.label}
              className={`p-5 md:p-6 ${index % 2 === 0 ? 'border-r border-bronze/10' : ''} ${index < 2 ? 'border-b border-bronze/10 md:border-b-0' : ''} ${index > 0 ? 'md:border-l md:border-bronze/10' : ''}`}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-tan">{fact.label}</p>
              <p className="mt-2 font-display text-xl text-navy">{fact.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-tan">{fact.note}</p>
            </div>
          ))}
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

      <section className="border-y border-bronze/10 bg-white">
        <div className="container-site section-gap">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="section-label">OEM / ODM Specification</p>
              <h2 className="text-display-md text-navy">What Buyers Can Customize</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-tan">
                A useful quotation starts with the product construction, target customer and retail positioning. These are the main variables we confirm before sampling {data.shortName.toLowerCase()}.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
                <Link to="/customization" className="btn-outline justify-center">View OEM / ODM Capabilities</Link>
                <Link to="/sourcing" className="text-sm font-medium text-navy underline underline-offset-4 hover:text-gold">Review MOQ, samples and production</Link>
              </div>
            </div>
            <div className="border border-bronze/10">
              {content.customization.map((item, index) => (
                <div key={item.area} className={`grid gap-2 p-5 sm:grid-cols-[0.32fr_0.68fr] sm:gap-6 ${index < content.customization.length - 1 ? 'border-b border-bronze/10' : ''}`}>
                  <h3 className="text-sm font-medium text-navy">{item.area}</h3>
                  <p className="text-sm leading-relaxed text-tan">{item.options}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-site section-gap">
        <p className="section-label">Wholesale & Private Label</p>
        <h2 className="max-w-3xl text-display-md text-navy">Programs This Category Supports</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {content.buyers.map((buyer) => (
            <article key={buyer.title} className="border border-bronze/10 bg-sand/30 p-6">
              <h3 className="font-display text-lg text-navy">{buyer.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-tan">{buyer.text}</p>
            </article>
          ))}
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

      <section className="border-t border-bronze/10 bg-sand/35">
        <div className="container-site section-gap">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-label">Buyer Resources</p>
              <h2 className="text-display-md text-navy">Research Before You Sample</h2>
            </div>
            <Link to="/blog" className="text-sm font-medium text-navy underline underline-offset-4 hover:text-gold">Browse all sourcing guides</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {content.relatedGuides.map((guide) => (
              <Link key={guide.slug} to={`/blog/${guide.slug}`} className="group border border-bronze/10 bg-white p-6 transition-colors hover:border-gold">
                <h3 className="font-display text-lg text-navy transition-colors group-hover:text-gold">{guide.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-tan">{guide.text}</p>
                <span className="mt-5 inline-flex text-xs font-medium uppercase tracking-wider text-navy group-hover:text-gold">Read guide <span aria-hidden="true" className="ml-1">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
