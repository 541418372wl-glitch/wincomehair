import { Link, useParams, useLocation } from 'react-router-dom';
import { articles } from '../data/articles';
import { waLink } from '../lib/whatsapp';
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from '../components/SEO';

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
        : <a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{m[1]}</a>
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
    case 'ol':
      return (
        <ol key={i} className="space-y-3 mb-6 list-decimal pl-6">
          {s.items.map((item, j) => (
            <li key={j} className="text-bronze/80 leading-relaxed pl-2">{parseLinks(item)}</li>
          ))}
        </ol>
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
  const url = SITE + location.pathname;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.date,
        dateModified: post.updatedDate || post.date,
        image: SITE + post.image,
        author: { '@id': ORGANIZATION_ID },
        publisher: { '@id': ORGANIZATION_ID },
        isPartOf: { '@id': WEBSITE_ID },
        mainEntityOfPage: url,
        inLanguage: 'en',
        ...(post.sources?.length ? { citation: post.sources.map(source => source.url) } : {}),
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
    <div>
      <div className="container-site section-gap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link to="/blog" className="text-xs tracking-wider uppercase text-tan hover:text-navy transition-colors inline-flex items-center gap-2 mb-8">
          ← Back to Blog
        </Link>

        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-wider uppercase bg-gold/10 text-bronze px-2 py-1">{post.category}</span>
            <span className="text-[10px] tracking-wider uppercase text-tan">{post.updatedDate ? `Updated ${post.updatedDate}` : post.date} · {post.readTime} · By WINCOME Team</span>
          </div>
          <h1 className="text-display-lg text-navy leading-tight mb-8">{post.title}</h1>
        </div>

        <div className="aspect-[16/6] overflow-hidden mb-12 bg-sand">
          <img src={post.image} alt={post.title} width="1535" height="864" fetchpriority="high" decoding="async" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-3xl">
          {post.sections.map((s, i) => renderSection(s, i))}
          {post.sources?.length > 0 && (
            <aside className="mt-12 border border-bronze/10 bg-sand/40 p-6">
              <h2 className="text-lg font-display text-navy mb-3">Research Sources</h2>
              <p className="text-sm text-tan leading-relaxed mb-4">
                Community discussions identify recurring buyer questions; medical and safety statements rely on the cited authoritative sources. Community reports are not controlled product tests.
              </p>
              <ul className="space-y-2">
                {post.sources.map(source => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
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
          <p className="section-label !text-champagne">Start Your Project</p>
          <h2 className="text-display-md mb-4">Ready to Talk to a <span className="text-champagne italic font-light">Factory Directly?</span></h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Free design mockup and factory-direct quote within 24 hours. MOQ from 100 pcs, samples in 5–7 days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waLink(`Hello WINCOME, I just read your article "${post.title}" and would like to discuss my project. Can we chat?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp <span className="ml-1">→</span>
            </a>
            <Link to="/contact" className="btn-gold">
              Request a Free Quote <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
