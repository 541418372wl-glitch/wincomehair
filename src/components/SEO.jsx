import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { articles } from '../data/articles';
import { productMeta } from '../data/productMeta';

const SITE = 'https://wincomehair.com';
const SITE_NAME = 'WINCOME Hair Accessories';
const OG_IMAGE = `${SITE}/assets/images/hero-clips.jpg`;

const pageMeta = {
  '/': {
    title: 'WINCOME Hair Accessories — Custom Hair Accessories Manufacturer & Supplier',
    description: 'Custom hair clips, claw clips, headbands, scrunchies & hair bows manufacturer. OEM/ODM, low MOQ from 100 pcs, free design service, global shipping.',
  },
  '/products': {
    title: 'Hair Accessories Product Catalog — WINCOME Hair Accessories',
    description: 'Browse our full catalog of custom hair accessories: hair claws, headbands, scrunchies, bows, and hair pins. OEM/ODM manufacturing for global brands.',
  },
  '/customization': {
    title: 'OEM & ODM Hair Accessories Customization — WINCOME',
    description: 'Full customization for hair accessories: custom logo, Pantone colors, material selection, packaging design. Low MOQ, free design mockup in 24h.',
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
    description: 'Frequently asked questions about MOQ, lead time, OEM/ODM, customization, materials, shipping, payment terms, and quality control for hair accessories manufacturing.',
  },
  '/quality': {
    title: 'Quality Control — WINCOME Hair Accessories Manufacturer',
    description: 'Three-stage quality control system: raw material inspection, in-process QC, and AQL 2.5 final random inspection. BSCI, ISO 9001, OEKO-TEX certified hair accessories manufacturer.',
  },
  '/cases': {
    title: 'Case Studies — WINCOME Hair Accessories Manufacturing Projects',
    description: 'Real client projects: custom acetate claw clips, private label scrunchies, bridal headbands, seasonal hair bow collections. See how WINCOME delivers for global brands.',
  },
  '/blog': {
    title: 'Hair Accessories Blog — Sourcing Guides & Industry Insights — WINCOME',
    description: 'Expert guides on sourcing custom hair accessories from China, materials (acetate, silk, satin), claw clip sizing, and building your own hair accessories brand.',
  },
};

export default function SEO() {
  const location = useLocation();
  let meta = pageMeta[location.pathname];

  // Dynamic meta for blog article pages
  if (!meta && location.pathname.startsWith('/blog/')) {
    const slug = location.pathname.split('/')[2];
    const article = articles.find(a => a.slug === slug);
    if (article) {
      meta = { title: `${article.title} — WINCOME Blog`, description: article.metaDescription };
    }
  }

  // Dynamic meta for product detail pages — unique title/description per product
  if (!meta && location.pathname.startsWith('/products/')) {
    const id = location.pathname.split('/')[2];
    const pm = productMeta[id];
    if (pm) {
      meta = {
        title: `${pm.name} — Wholesale & Custom OEM — WINCOME Hair Accessories`,
        description: `${pm.description.slice(0, 155)} MOQ ${pm.moq}, lead time ${pm.leadTime}.`,
      };
    }
  }

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
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', SITE_NAME, true);

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
  }, [meta, location.pathname]);

  return null;
}
