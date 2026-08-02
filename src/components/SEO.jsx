import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
};

export default function SEO() {
  const location = useLocation();
  const meta = pageMeta[location.pathname];

  useEffect(() => {
    if (meta) {
      document.title = meta.title;
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', meta.description);
    }
  }, [meta]);

  return null;
}
