import { Link, useLocation } from 'react-router-dom';
import { productMeta } from '../data/productMeta';
import { articles } from '../data/articles';
import { productCategoryMeta } from '../data/productCategoryMeta';

const labels = {
  '/': 'Home',
  '/products': 'Products',
  '/customization': 'OEM / ODM',
  '/sourcing': 'MOQ & Order Process',
  '/about': 'About',
  '/cases': 'Case Studies',
  '/quality': 'Quality Control',
  '/faq': 'FAQ',
  '/contact': 'Contact',
  '/blog': 'Blog',
};

export default function Breadcrumb() {
  const location = useLocation();
  if (location.pathname === '/') return null;

  const crumbs = [];
  crumbs.push({ label: 'Home', path: '/' });

  const segments = location.pathname.split('/').filter(Boolean);
  if (segments[0] === 'products' && segments[1] === 'category') {
    const category = productCategoryMeta[segments[2]];
    crumbs.push({ label: 'Products', path: '/products' });
    crumbs.push({ label: category?.shortName || segments[2], path: null });
  }

  let current = '';
  for (const seg of segments[1] === 'category' ? [] : segments) {
    current += `/${seg}`;
    let label = labels[current] || seg;
    // Use real product names / article titles instead of URL slugs
    if (location.pathname.startsWith('/products/') && segments.length > 1) {
      const pm = productMeta[seg];
      if (pm) label = pm.name;
    }
    if (location.pathname.startsWith('/blog/') && segments.length > 1) {
      const article = articles.find(a => a.slug === seg);
      if (article) label = article.title;
    }
    crumbs.push({ label, path: current !== location.pathname ? current : null });
  }

  return (
    <nav aria-label="Breadcrumb" className="pt-28">
      <div className="container-site">
        <ol className="flex min-w-0 items-center gap-2 text-xs">
          {crumbs
            .filter((_, i, arr) => i === 0 || i === arr.length - 1)
            .map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={crumb.path || crumb.label} className={`flex min-w-0 items-center gap-2 ${isLast ? 'flex-1' : 'shrink-0'}`}>
                  {i > 0 && <span className="text-tan/50 mx-1">/</span>}
                  {isLast || !crumb.path ? (
                    <span className="block truncate text-navy font-medium">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="text-tan hover:text-navy transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
        </ol>
        {/* Structured data for search engines */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map((crumb, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: crumb.label,
              item: crumb.path ? `https://wincomehair.com${crumb.path}` : undefined,
            })),
          }),
        }} />
      </div>
    </nav>
  );
}
