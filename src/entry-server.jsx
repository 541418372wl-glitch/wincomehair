import { renderStream } from './lib/render-stream.js';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
import { getSeoMeta, OG_IMAGE, ORGANIZATION_SCHEMA, SITE, SITE_NAME, WEBSITE_SCHEMA } from './components/SEO';
import { products } from './data/productCatalog';
import { findSelectedProduct } from './data/selectedProductStyles';
import { articles } from 'virtual:article-summaries';
import { articleImageSizes, productImageSizes } from './lib/responsivePhotos';
import { canonicalPath } from './lib/canonicalPath';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildHead(pathname) {
  pathname = canonicalPath(pathname);
  const meta = getSeoMeta(pathname);
  if (!meta) throw new Error(`Missing SEO metadata for ${pathname}`);

  const url = `${SITE}${pathname}`;
  const image = meta.image || OG_IMAGE;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    `<meta property="og:type" content="${escapeHtml(meta.type || 'website')}">`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
  ];

  if (meta.type === 'article') {
    tags.push(
      `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}">`,
      `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}">`,
      `<meta property="article:section" content="${escapeHtml(meta.section)}">`,
    );
  }

  if (pathname === '/') {
    tags.push(
      `<script type="application/ld+json" id="org-jsonld">${jsonLd({
        ...ORGANIZATION_SCHEMA,
      })}</script>`,
      `<script type="application/ld+json" id="website-jsonld">${jsonLd(WEBSITE_SCHEMA)}</script>`,
    );
  }

  return tags.join('\n    ');
}

const fixedModules = {
  '/products': 'Products', '/customization': 'Customization', '/sourcing': 'Sourcing',
  '/about': 'About', '/manufacturer-profile': 'ManufacturerProfile', '/contact': 'SelectedContactRoute',
  '/faq': 'FAQ', '/quality': 'Quality', '/cases': 'Cases', '/blog': 'Blog', '/privacy': 'Privacy', '/terms': 'Terms',
};

function routeAssets(pathname) {
  let module = fixedModules[pathname];
  let lcpImage = null;
  if (pathname.startsWith('/products/category/')) {
    module = 'ProductCategory';
  } else if (pathname.startsWith('/products/')) {
    module = 'ProductDetail';
    const slug = pathname.slice('/products/'.length);
    const product = findSelectedProduct(slug) || products.find(item => item.id === slug);
    lcpImage = { src: product.image, sizes: productImageSizes };
  } else if (pathname.startsWith('/blog/')) {
    module = 'BlogPost';
    const article = articles.find(item => pathname === '/blog/' + item.slug);
    if (article?.image) lcpImage = { src: article.image, sizes: articleImageSizes };
  }
  // Home is eager and already has a responsive hero preload in index.html.
  return { routeEntryModule: module ? 'src/pages/' + module + '.jsx' : null, lcpImage };
}

export async function render(pathname) {
  const headHtml = buildHead(pathname);
  const appHtml = await renderStream(
    <StaticRouter location={pathname}>
      <AppContent />
    </StaticRouter>,
  );
  return { appHtml, headHtml, ...routeAssets(pathname) };
}
