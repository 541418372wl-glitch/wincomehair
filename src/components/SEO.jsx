import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { articles } from '../data/articles';
import { productMeta } from '../data/productMeta';
import { productCategoryMeta } from '../data/productCategoryMeta';

export const SITE = 'https://wincomehair.com';
export const SITE_NAME = 'WINCOME Hair Accessories';
export const OG_IMAGE = `${SITE}/og-image.png`;
export const SEO_DESCRIPTION_MIN = 105;
export const SEO_DESCRIPTION_MAX = 155;
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE,
  logo: `${SITE}/logo-192.png`,
  description: 'Custom hair accessories manufacturer and OEM/ODM supplier for brands, wholesalers, retailers and importers.',
  foundingDate: '2010',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CN',
  },
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 200,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+86-189-8984-6141',
    email: 'info@wincomehair.com',
    contactType: 'sales',
    availableLanguage: ['English', 'Chinese'],
  },
};

const pageMeta = {
  '/': {
    title: 'WINCOME — Custom Hair Accessories Manufacturer',
    description: 'Custom hair clips, claw clips, headbands, scrunchies & hair bows manufacturer. OEM/ODM, MOQ from 100 pcs, free design service, global shipping.',
  },
  '/products': {
    title: 'Wholesale Hair Accessories Catalog | WINCOME',
    description: 'Browse 29 wholesale hair accessories with MOQ from 100 pieces. Custom materials, colors, logos and packaging for brands, retailers and importers.',
  },
  '/customization': {
    title: 'Custom Hair Accessories OEM & Private Label | WINCOME',
    description: 'Custom hair accessories OEM/ODM with Pantone colors, materials, logos, labels and retail packaging. MOQ from 100 pieces and samples in 5–7 days.',
  },
  '/sourcing': {
    title: 'Hair Accessories MOQ, Samples & Production | WINCOME',
    description: 'Plan a custom hair accessories order with clear MOQ, 5–7 day sampling, 8–18 day production, payment terms, quality checks and worldwide shipping.',
  },
  '/about': {
    title: 'About WINCOME Hair Accessories — Factory & Certifications',
    description: 'WINCOME Hair Accessories: 15+ years manufacturing experience, BSCI & ISO 9001 certified. 3,000m² factory, 200+ staff, serving 500+ global brands.',
  },
  '/contact': {
    title: 'Request a Quote — WINCOME Hair Accessories',
    description: 'Get a free design mockup and factory-direct quote within 24 hours. Custom hair accessories manufacturing — no commitment, no spam.',
  },
  '/faq': {
    title: 'FAQ — Custom Hair Accessories Manufacturing — WINCOME',
    description: 'Answers on custom hair accessories MOQ, lead times, OEM/ODM, materials, shipping, payment, sampling and factory quality control at WINCOME.',
  },
  '/quality': {
    title: 'Quality Control — WINCOME Hair Accessories Manufacturer',
    description: 'Review WINCOME hair accessories quality control: material checks, in-process QC, AQL 2.5 inspection, testing and compliance documentation.',
  },
  '/cases': {
    title: 'Case Studies — WINCOME Hair Accessories',
    description: 'Explore real custom hair accessory projects, from acetate claw clips and scrunchies to bridal headbands, with timelines, challenges and results.',
  },
  '/blog': {
    title: 'Hair Accessories Blog — Sourcing Guides — WINCOME',
    description: 'Expert hair accessories guides covering fit, materials, product selection, sourcing and private-label development for buyers, brands and consumers.',
  },
  '/privacy': {
    title: 'Privacy Policy — WINCOME Hair Accessories',
    description: 'Learn how WINCOME collects, uses, stores and protects personal data from quote requests, website analytics, cookies and direct contact.',
  },
  '/terms': {
    title: 'Terms of Service — WINCOME Hair Accessories',
    description: 'Review WINCOME terms for website use, custom product quotes, samples, tooling, orders, intellectual property, quality claims and liability.',
  },
};

function truncate(text, max = SEO_DESCRIPTION_MAX) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max - 1);
  // Prefer breaking at a sentence boundary; fall back to word boundary.
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '), cut.lastIndexOf('! '), cut.lastIndexOf(': '));
  const usefulSentenceEnd = Math.min(SEO_DESCRIPTION_MIN, Math.floor(max * 0.75));
  const breakAt = sentenceEnd >= usefulSentenceEnd ? sentenceEnd + 1 : cut.lastIndexOf(' ');
  return cut.slice(0, breakAt > 40 ? breakAt : cut.length) + '…';
}

function buildArticleDescription(article) {
  const summary = article.metaDescription.replace(/\s+/g, ' ').trim();
  const enriched = summary.length < SEO_DESCRIPTION_MIN
    ? `${summary} Practical sourcing guidance for hair accessories brands, importers and private-label buyers.`
    : summary;
  return truncate(enriched);
}

function buildProductDescription(product) {
  const facts = `MOQ ${product.moq}; lead time ${product.leadTime}. Custom colors, logo and packaging available.`;
  const introMax = SEO_DESCRIPTION_MAX - facts.length - 1;
  return `${truncate(product.description, introMax)} ${facts}`;
}

export function getSeoMeta(pathname) {
  let meta = pageMeta[pathname];

  // Dynamic meta for blog article pages
  if (!meta && pathname.startsWith('/blog/')) {
    const slug = pathname.split('/')[2];
    const article = articles.find(a => a.slug === slug);
    if (article) {
      meta = {
        title: article.seoTitle || article.title,
        description: buildArticleDescription(article),
        image: `${SITE}${article.image}`,
        type: 'article',
        publishedTime: article.date,
        modifiedTime: article.updatedDate || article.date,
        section: article.category,
      };
    }
  }

  // Dynamic meta for product detail pages — unique title/description per product
  if (!meta && pathname.startsWith('/products/')) {
    const [, , segment, categorySlug] = pathname.split('/');
    if (segment === 'category') {
      const category = productCategoryMeta[categorySlug];
      if (category) meta = { title: category.seoTitle, description: category.description };
      return meta;
    }
    const id = segment;
    const pm = productMeta[id];
    if (pm) {
      meta = {
        title: `Custom ${pm.name} Manufacturer | WINCOME`,
        description: buildProductDescription(pm),
      };
    }
  }

  return meta;
}

export default function SEO() {
  const location = useLocation();
  const meta = getSeoMeta(location.pathname);

  function setMeta(name, content, isProperty = false) {
    const attr = isProperty ? 'property' : 'name';
    let tag = document.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  function upsertScript(id, json) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(json);
  }

  function clearScript(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  useEffect(() => {
    if (!meta) return;

    document.title = meta.title;
    setMeta('description', meta.description);

    const url = `${SITE}${location.pathname}`;
    const image = meta.image || OG_IMAGE;

    // Open Graph
    setMeta('og:title', meta.title, true);
    setMeta('og:description', meta.description, true);
    setMeta('og:url', url, true);
    setMeta('og:image', image, true);
    setMeta('og:type', meta.type || 'website', true);
    setMeta('og:site_name', SITE_NAME, true);

    if (meta.type === 'article') {
      setMeta('article:published_time', meta.publishedTime, true);
      setMeta('article:modified_time', meta.modifiedTime, true);
      setMeta('article:section', meta.section, true);
    } else {
      ['article:published_time', 'article:modified_time', 'article:section'].forEach(name => {
        document.querySelector(`meta[property="${name}"]`)?.remove();
      });
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', image);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Structured data
    if (location.pathname === '/') {
      upsertScript('org-jsonld', ORGANIZATION_SCHEMA);
      upsertScript('website-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE,
      });
    } else {
      clearScript('org-jsonld');
      clearScript('website-jsonld');
    }

    // Quote-only B2B products have no public price or verified reviews.
    // Do not emit Product rich-result JSON-LD until one of those is visible
    // on the page; an Offer without a numeric price is invalid for Google.
    clearScript('product-jsonld');
  }, [meta, location.pathname]);

  return null;
}
