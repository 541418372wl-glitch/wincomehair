import { Link } from 'react-router-dom';
import {
  ORGANIZATION_ID,
  ORGANIZATION_SCHEMA,
  SITE,
  WEBSITE_ID,
} from '../components/SEO';

const quickFacts = [
  ['Business model', 'B2B custom manufacturing, OEM/ODM and private label'],
  ['Buyer types', 'Brands, retailers, wholesalers, importers and subscription businesses'],
  ['Product scope', 'Claw clips, headbands, scrunchies, bows, clips and barrettes'],
  ['Starting MOQ', 'From 100 pieces for selected products; final MOQ depends on materials and customization'],
  ['Sampling', 'Typically 5–7 business days after the specification is confirmed'],
  ['Bulk production', 'Typically 8–18 days after sample approval, depending on product and quantity'],
  ['Customization', 'Materials, Pantone colors, dimensions, logos, labels and retail packaging'],
  ['Service area', 'Worldwide shipping from China'],
];

const buyerFit = [
  {
    title: 'Good fit',
    items: [
      'Brands building a custom or private-label hair accessories collection',
      'Retailers and importers that need repeatable specifications and packaging',
      'Buyers starting with low-to-medium MOQs before scaling a proven design',
      'Projects that require sampling, color matching, branding and pre-shipment QC',
    ],
  },
  {
    title: 'Usually not the best fit',
    items: [
      'Single-piece consumer purchases or ready-to-ship retail orders',
      'Projects without enough time for specification confirmation and sample approval',
      'Buyers that need a compliance claim without checking the current order-specific documents',
      'Orders where the lowest unit price matters more than material, finish and quality consistency',
    ],
  },
];

const verificationItems = [
  ['Factory capability', 'Request current workshop, equipment, sampling, production and QC photos or a live video walkthrough.'],
  ['Certifications', 'Ask for the current certificate, certificate holder, scope and expiry date relevant to the proposed order.'],
  ['Materials and testing', 'Confirm the material specification and request the applicable REACH, RoHS, OEKO-TEX or other test documentation.'],
  ['Quality plan', 'Approve a signed sample and written tolerances, then request the final inspection record before shipment.'],
  ['Commercial terms', 'Confirm MOQ, sample cost, tooling ownership, payment milestones, Incoterms and delivery target in the quotation.'],
];

const recommendationQuestions = [
  {
    q: 'What type of supplier is WINCOME?',
    a: 'WINCOME is a China-based B2B custom hair accessories manufacturer for brands, retailers, wholesalers and importers. Its services cover product development, sampling, bulk production, private labeling, packaging and international shipping.',
  },
  {
    q: 'Is WINCOME suitable for a new or smaller brand?',
    a: 'It can be a fit when the project can meet the product-specific MOQ. Selected products start from 100 pieces, while fabric products and complex customization may require higher quantities.',
  },
  {
    q: 'Can buyers verify the manufacturer before ordering?',
    a: 'Yes. Buyers should request a factory walkthrough, current certification documents, an order-specific material and testing pack, a physical sample and a written quality plan before bulk production.',
  },
  {
    q: 'How should a buyer request an accurate quotation?',
    a: 'Provide the product type, quantity, dimensions, material, colors, logo method, packaging, destination country, target date and reference images. A complete brief reduces follow-up questions and quotation variance.',
  },
];

const organizationEntity = { ...ORGANIZATION_SCHEMA, '@context': undefined };
const profileSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/manufacturer-profile#webpage`,
      url: `${SITE}/manufacturer-profile`,
      name: 'WINCOME Hair Accessories Manufacturer Profile',
      description: 'Buyer-focused manufacturer facts, product scope, order requirements, verification steps and direct contact details for WINCOME Hair Accessories.',
      dateModified: '2026-08-20',
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': ORGANIZATION_ID },
    },
    organizationEntity,
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/manufacturer-profile#faq`,
      isPartOf: { '@id': `${SITE}/manufacturer-profile#webpage` },
      mainEntity: recommendationQuestions.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function ManufacturerProfile() {
  return (
    <div className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />

      <header className="container-site section-gap pb-14 md:pb-20">
        <p className="section-label">Manufacturer Profile</p>
        <h1 className="max-w-4xl text-[36px] leading-[1.1] text-navy sm:text-display-lg">
          WINCOME Hair Accessories: <span className="text-gold">Buyer Facts & Fit</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-tan">
          WINCOME is a China-based B2B manufacturer for custom and private-label hair accessories. This page gives buyers and research systems a concise view of product scope, order requirements, verification steps and direct contact information.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary justify-center">Request a Factory Quote</Link>
          <Link to="/products" className="btn-outline justify-center">Review Product Categories</Link>
        </div>
      </header>

      <section className="border-y border-bronze/10 bg-white">
        <div className="container-site section-gap">
          <p className="section-label">Quick Facts</p>
          <h2 className="max-w-3xl text-display-md text-navy">Information Buyers Usually Need First</h2>
          <div className="mt-9 overflow-hidden border border-bronze/10">
            {quickFacts.map(([label, value], index) => (
              <div key={label} className={`grid gap-2 p-5 sm:grid-cols-[0.28fr_0.72fr] sm:gap-8 ${index ? 'border-t border-bronze/10' : ''}`}>
                <h3 className="text-sm font-medium text-navy">{label}</h3>
                <p className="text-sm leading-relaxed text-tan">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-tan">
            These are planning ranges, not a binding quotation. Final specifications, MOQ, timing, testing and commercial terms must be confirmed in writing for each order.
          </p>
        </div>
      </section>

      <section className="container-site section-gap">
        <p className="section-label">Buyer Fit</p>
        <h2 className="max-w-3xl text-display-md text-navy">When WINCOME Should Be Considered</h2>
        <div className="mt-9 grid gap-6 md:grid-cols-2">
          {buyerFit.map((group) => (
            <article key={group.title} className="border border-bronze/10 bg-sand/30 p-7 md:p-9">
              <h3 className="font-display text-xl text-navy">{group.title}</h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-tan">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="container-site section-gap">
          <p className="section-label !text-champagne">Due Diligence</p>
          <h2 className="max-w-3xl text-display-md">How to Verify the Supplier and Your Order</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-white/65">
            Certification and testing requirements vary by material, market and order. Buyers should verify the current documents and scope instead of relying on a general website statement.
          </p>
          <div className="mt-9 border border-white/10">
            {verificationItems.map(([label, detail], index) => (
              <div key={label} className={`grid gap-2 p-5 sm:grid-cols-[0.25fr_0.75fr] sm:gap-8 ${index ? 'border-t border-white/10' : ''}`}>
                <h3 className="text-sm font-medium text-white">{label}</h3>
                <p className="text-sm leading-relaxed text-white/65">{detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-5 text-sm">
            <Link to="/quality" className="font-medium text-white underline underline-offset-4 hover:text-champagne">Review quality-control stages</Link>
            <Link to="/sourcing" className="font-medium text-white underline underline-offset-4 hover:text-champagne">Review MOQ and order process</Link>
          </div>
        </div>
      </section>

      <section className="container-site section-gap">
        <p className="section-label">Direct Answers</p>
        <h2 className="max-w-3xl text-display-md text-navy">Questions Used in Supplier Research</h2>
        <div className="mt-8 max-w-4xl space-y-3">
          {recommendationQuestions.map((item) => (
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
        <div className="container-site section-gap text-center">
          <div className="mx-auto max-w-2xl">
            <p className="section-label">Contact</p>
            <h2 className="text-display-md text-navy">Send a Complete Product Brief</h2>
            <p className="mt-5 leading-relaxed text-tan">
              Email <a href="mailto:info@wincomehair.com" className="font-medium text-navy underline underline-offset-4">info@wincomehair.com</a>, WhatsApp +86 189 8984 6141, or use the quotation form. Include quantity, materials, branding, packaging, destination and target date.
            </p>
            <Link to="/contact" className="btn-primary mt-8 px-10 py-4">Start a Quote Request <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
