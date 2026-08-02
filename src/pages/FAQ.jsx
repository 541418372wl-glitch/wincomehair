import { useState } from 'react';

const faqData = [
  {
    q: 'What is the minimum order quantity (MOQ)?',
    a: 'Our standard MOQ starts at 100 pcs for hair claws and rigid accessories, and 200–300 pcs for scrunchies, bows, and fabric-based products. We can discuss smaller trial quantities for new partnerships — just mention it in your inquiry.'
  },
  {
    q: 'How long does production take?',
    a: 'Standard lead time is 12–18 days after sample approval, depending on product type, quantity, and customization complexity. Rush orders (7–10 days) are possible for certain products — please confirm availability when you inquire.'
  },
  {
    q: 'Do you provide physical samples before bulk production?',
    a: 'Yes, always. We produce a physical pre-production sample within 5–7 business days for your approval before any bulk production begins. Sample shipping is via DHL/FedEx (1–3 days). Sample cost is typically credited toward your first bulk order.'
  },
  {
    q: 'Can I use my own design / Pantone colors?',
    a: 'Absolutely. We work with your design files (AI, PDF, PSD) and physical Pantone swatches. Our in-house design team can also create your design from scratch at no charge. We match Pantone colors with precision across all materials.'
  },
  {
    q: 'What customization options are available?',
    a: 'We offer full customization: product size and shape, material selection (acetate, metal, silk, satin, velvet, cotton), custom Pantone colors, logo application (laser engraving, foil stamping, metal plate, woven label), and packaging design (individual card, gift box, display packaging).'
  },
  {
    q: 'What materials do you work with?',
    a: 'Our material library includes: cellulose acetate (eco-friendly, plant-based), zinc alloy (metal clips and frames), mulberry silk, premium satin, organic cotton (GOTS available), velvet, grosgrain ribbon, ABS plastic, and faux pearls. We source globally and can accommodate custom material requests.'
  },
  {
    q: 'What are your payment terms?',
    a: 'Standard terms are 30% deposit to start production + 70% balance before shipment. We accept T/T (bank transfer), PayPal, and Trade Assurance via Alibaba. Long-term clients may qualify for net-30 credit terms after 3 successful orders.'
  },
  {
    q: 'Do you ship worldwide? What about customs?',
    a: 'Yes — we ship to 50+ countries via sea freight (most cost-effective for large orders, 18–25 days) or air express (DHL/FedEx/UPS, 3–5 days) for smaller urgent shipments. We provide all necessary export documentation including commercial invoice, packing list, and certificates of origin. Amazon FBA direct shipment is supported.'
  },
  {
    q: 'Can you do eco-friendly or sustainable products?',
    a: 'Yes. We offer FSC-certified packaging materials, plant-based cellulose acetate, GOTS-certified organic cotton, OEKO-TEX certified dyes, and recycled material options. Sustainable options are available on all product types with no change to MOQ or lead time.'
  },
  {
    q: 'What is your quality control process?',
    a: 'We follow a three-stage QC protocol: (1) incoming raw material inspection, (2) in-process quality checks at each production stage, and (3) final AQL 2.5 random sampling inspection before shipment. Inspection reports are available upon request. Our facility is BSCI and ISO 9001 certified.'
  },
  {
    q: 'Do you offer private label services?',
    a: 'Yes. We provide full private label manufacturing — your brand name, logo, packaging design, and hang tags. We can also create custom branded packaging including individual cards, gift boxes, and display-ready packaging. Minimum private label order quantities vary by product type.'
  },
  {
    q: 'How do I place my first order?',
    a: 'Simply submit a quote request through our contact form with your product type, approximate quantity, and any reference images or design ideas. Our product specialist will respond within 24 hours with a free design mockup, material recommendations, and a detailed factory-direct quote. Once you approve the sample, we move to production.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <div className="max-w-3xl mx-auto">
          <p className="section-label text-center">Frequently Asked Questions</p>
          <h1 className="text-display-lg text-navy text-center mb-4">
            Everything You <span className="text-gold">Need to Know</span>
          </h1>
          <p className="text-tan text-lg text-center mb-16 max-w-xl mx-auto leading-relaxed">
            Common questions about our custom hair accessories manufacturing process, MOQ, shipping, and more.
          </p>

          <div className="divide-y divide-bronze/10">
            {faqData.map((item, index) => (
              <div key={index} className="py-6">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left flex items-start justify-between gap-4 group"
                >
                  <span className="text-base text-navy group-hover:text-gold transition-colors font-display leading-relaxed">
                    {item.q}
                  </span>
                  <span className={`text-gold transition-transform duration-200 mt-1 shrink-0 ${openIndex === index ? 'rotate-45' : ''}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-4 text-sm text-tan leading-relaxed pl-0 animate-[fadeIn_0.3s_ease-out]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20 pt-12 border-t border-bronze/10">
            <h3 className="text-display-sm text-navy mb-3">Still Have Questions?</h3>
            <p className="text-tan mb-8">Our product specialists are ready to help with any specific inquiries.</p>
            <a href="/contact" className="btn-primary text-base px-12 py-5">
              Contact Our Team <span className="ml-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
