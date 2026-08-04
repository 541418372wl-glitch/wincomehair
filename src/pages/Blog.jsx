import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

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
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] tracking-wider uppercase bg-gold/10 text-bronze px-2 py-1">{post.category}</span>
                  <span className="text-[10px] tracking-wider uppercase text-tan">{post.date} · {post.readTime}</span>
                </div>
                <h2 className="text-base font-display text-navy leading-relaxed mb-3 group-hover:text-gold transition-colors">{post.title}</h2>
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
              Get a free design mockup and factory-direct quote within 24 hours. MOQ from 100 pcs.
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
