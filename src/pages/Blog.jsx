import { Link } from 'react-router-dom';
import { articles } from 'virtual:article-summaries';

const buyingTopics = [
  {
    title: 'Styles & Materials',
    description: 'Compare materials before choosing your product range.',
    links: [
      { label: 'Claw clip materials', to: '/blog/acetate-vs-plastic-claw-clips' },
      { label: 'Silk vs satin scrunchies', to: '/blog/silk-vs-satin-scrunchies' },
    ],
  },
  {
    title: 'Size & Fit',
    description: 'Know what to measure and what to check with samples.',
    links: [
      { label: 'Claw clip size guide', to: '/blog/claw-clip-size-guide' },
      { label: 'Scrunchie fit guide', to: '/blog/scrunchie-too-loose-too-tight' },
    ],
  },
  {
    title: 'MOQ & Quotes',
    description: 'Plan quantities and prepare a clear quotation brief.',
    links: [
      { label: 'MOQ planning guide', to: '/blog/hair-accessories-moq-guide' },
      { label: 'Compare three claw clips', to: '/products/category/hair-claw-clips#selected-styles' },
    ],
  },
  {
    title: 'Packaging',
    description: 'Match the packaging brief to the selected accessory.',
    links: [
      { label: 'Packaging guide', to: '/blog/hair-accessory-packaging-guide' },
      { label: 'Customization options', to: '/customization' },
    ],
  },
  {
    title: 'Sourcing & Samples',
    description: 'Prepare supplier checks, sample approvals and order details.',
    links: [
      { label: 'China sourcing checklist', to: '/blog/how-to-source-hair-accessories-from-china' },
      { label: 'Quality review', to: '/quality' },
    ],
  },
];

export default function Blog() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <p className="section-label">Insights</p>
        <h1 className="text-display-lg text-navy mb-4">Hair Accessories <span className="text-gold">Resources</span></h1>
        <p className="text-tan text-lg max-w-2xl mb-12 leading-relaxed">
          Sourcing guides, material deep-dives, and market insights written from the factory floor —
          for brands, wholesalers, and sellers building their own hair accessories lines.
        </p>

        <nav className="blog-buying-nav" aria-labelledby="buying-guides-heading">
          <div className="blog-buying-heading">
            <div>
              <p className="section-label">Plan Your Purchase</p>
              <h2 id="buying-guides-heading">Find a Guide for Your Next Decision</h2>
            </div>
            <a href="#all-articles" className="blog-all-articles-link">Browse all articles <span aria-hidden="true">↓</span></a>
          </div>
          <ul className="blog-buying-topics">
            {buyingTopics.map((topic, index) => (
              <li key={topic.title}>
                <span className="blog-topic-number" aria-hidden="true">0{index + 1}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <ul className="blog-topic-links">
                  {topic.links.map(link => (
                    <li key={link.to}>
                      <Link to={link.to} reloadDocument={link.to.includes('#')}>{link.label} <span aria-hidden="true">→</span></Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <h2 id="all-articles" className="blog-all-articles-heading">All Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(post => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.slug}
              className="group bg-white overflow-hidden border border-bronze/10 hover:border-bronze/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden bg-sand">
                <img
                  src={post.image}
                  alt={post.title}
                  width="1535"
                  height="864"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] tracking-wider uppercase bg-gold/10 text-bronze px-2 py-1">{post.category}</span>
                  <span className="text-[10px] tracking-wider uppercase text-tan">{post.date} · {post.readTime}</span>
                </div>
                <h3 className="text-base font-display text-navy leading-relaxed mb-3 group-hover:text-gold transition-colors">{post.title}</h3>
                <p className="text-sm text-tan leading-relaxed mb-4">{post.excerpt}</p>
                <span className="text-xs font-medium tracking-wider uppercase text-navy inline-flex items-center gap-1 group-hover:text-gold transition-colors">
                  Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-navy text-white p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-display-md mb-3">Have a Project in Mind?</h2>
            <p className="text-white/60 text-lg max-w-xl">
              Get a free design mockup and factory-direct quote within 24 hours. Production MOQs are listed by category.
            </p>
          </div>
          <Link to="/contact" className="btn-gold shrink-0">
            Request a Free Quote <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
