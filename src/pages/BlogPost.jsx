import { Link, useParams, useLocation } from 'react-router-dom';
import { articles } from '../data/articles';

function parseLinks(text) {
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const internal = m[2].startsWith('/');
    parts.push(
      internal
        ? <Link key={m.index} to={m[2]} className="text-gold hover:underline">{m[1]}</Link>
        : <a key={m.index} href={m[2]} className="text-gold hover:underline">{m[1]}</a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function FAQBlock({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={i} className="group bg-white border border-bronze/10 open:border-bronze/25">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5">
            <span className="text-sm font-medium text-navy">{item.q}</span>
            <span className="text-gold text-lg leading-none group-open:rotate-45 transition-transform shrink-0">+</span>
          </summary>
          <p className="px-6 pb-6 text-sm text-tan leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

function renderSection(s, i) {
  switch (s.t) {
    case 'h2':
      return <h2 key={i} className="text-display-md text-navy mt-12 mb-4 first:mt-0">{s.x}</h2>;
    case 'h3':
      return <h3 key={i} className="text-lg font-display text-navy mt-8 mb-3">{s.x}</h3>;
    case 'p':
      return <p key={i} className="text-bronze/80 leading-relaxed mb-5">{parseLinks(s.x)}</p>;
    case 'ul':
      return (
        <ul key={i} className="space-y-3 mb-6">
          {s.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-bronze/80 leading-relaxed">
              <svg className="w-4 h-4 text-gold mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              <span>{parseLinks(item)}</span>
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div key={i} className="overflow-x-auto mb-8 border border-bronze/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-white">
                {s.head.map((h, j) => <th key={j} className="text-left font-medium px-5 py-4 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row, j) => (
                <tr key={j} className={j % 2 ? 'bg-sand/40' : 'bg-white'}>
                  {row.map((cell, k) => (
                    <td key={k} className={`px-5 py-4 align-top ${k === 0 ? 'font-medium text-navy' : 'text-bronze/80'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'faq':
      return (
        <div key={i} className="mt-12">
          <h2 className="text-display-md text-navy mb-6">Frequently Asked Questions</h2>
          <FAQBlock items={s.items} />
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const location = useLocation();
  const post = articles.find(a => a.slug === slug);

  if (!post) {
    return (
      <div className="pt-32 text-center">
        <p className="text-tan">Article not found.</p>
        <Link to="/blog" className="text-navy underline mt-4 inline-block">Back to Blog</Link>
      </div>
    );
  }

  const faqItems = post.sections.filter(s => s.t === 'faq').flatMap(s => s.items);
  const url = `https://wincomehair.com${location.pathname}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.date,
        dateModified: post.date,
        image: `https://wincomehair.com${post.image}`,
        author: { '@type': 'Organization', name: 'WINCOME Hair Accessories', url: 'https://wincomehair.com' },
        publisher: { '@type': 'Organization', name: 'WINCOME Hair Accessories', url: 'https://wincomehair.com' },
        mainEntityOfPage: url,
      },
      ...(faqItems.length ? [{
        '@type': 'FAQPage',
        mainEntity: faqItems.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }] : []),
    ],
  };

  const related = articles.filter(a => a.slug !== post.slug).slice(0, 3);

  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link to="/blog" className="text-xs tracking-wider uppercase text-tan hover:text-navy transition-colors inline-flex items-center gap-2 mb-8">
          ← Back to Blog
        </Link>

        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-wider uppercase bg-gold/10 text-bronze px-2 py-1">{post.category}</span>
            <span className="text-[10px] tracking-wider uppercase text-tan">{post.date} · {post.readTime}</span>
          </div>
          <h1 className="text-display-lg text-navy leading-tight mb-8">{post.title}</h1>
        </div>

        <div className="aspect-[16/6] overflow-hidden mb-12 bg-sand">
          <img src={post.image} alt={post.title} fetchPriority="high" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-3xl">
          {post.sections.map((s, i) => renderSection(s, i))}
        </div>

        {/* Related articles */}
        <div className="mt-20 border-t border-bronze/10 pt-12">
          <p className="section-label">Keep Reading</p>
          <h2 className="text-display-md text-navy mb-8">Related <span className="text-gold">Articles</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group bg-white p-6 border border-bronze/10 hover:border-bronze/25 transition-all duration-300">
                <p className="text-[10px] tracking-wider uppercase text-tan mb-3">{p.date}</p>
                <h3 className="text-sm font-display text-navy group-hover:text-gold transition-colors leading-relaxed mb-3">{p.title}</h3>
                <span className="text-xs font-medium tracking-wider uppercase text-navy inline-flex items-center gap-1 group-hover:text-gold transition-colors">
                  Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-navy text-white p-10 md:p-14 text-center">
          <p className="section-label !text-gold">Start Your Project</p>
          <h2 className="text-display-md mb-4">Ready to Talk to a <span className="text-gold">Factory Directly?</span></h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Free design mockup and factory-direct quote within 24 hours. MOQ from 100 pcs, samples in 5–7 days.
          </p>
          <Link to="/contact" className="btn-gold">
            Request a Free Quote <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
