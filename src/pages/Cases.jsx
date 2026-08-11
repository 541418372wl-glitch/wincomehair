import { Link } from 'react-router-dom';

const cases = [
  {
    title: 'US Fashion Brand — Custom Acetate Claw Clip Line',
    client: 'Mid-size US accessories brand',
    challenge: 'The client needed a 12-color acetate claw clip collection with custom logo, retail-ready packaging, and a 45-day launch timeline.',
    solution: 'We matched their Pantone colors across 12 acetate variants, designed a custom gold-foil logo stamp, created branded individual cards with barcodes, and completed the first bulk order in 38 days.',
    results: ['12 SKUs delivered in 38 days', 'MOQ: 200 pcs per color', 'Gold foil logo + custom packaging', 'Reordered within 60 days'],
  },
  {
    title: 'European Boutique Chain — Private Label Scrunchies',
    client: 'Multi-store boutique chain (Netherlands)',
    challenge: 'The client wanted OEKO-TEX certified silk scrunchies in 8 custom colors, with their brand label and gift-ready packaging for in-store retail display.',
    solution: 'We sourced OEKO-TEX certified mulberry silk, produced woven brand labels, designed hang-tag packaging with Euro hook, and delivered 5,000 units across 8 colors.',
    results: ['OEKO-TEX certified materials', '5,000 units / 8 colors', 'Custom woven label + hang tag', 'Now a quarterly repeat client'],
  },
  {
    title: 'Australian Wedding Brand — Bridal Headband Collection',
    client: 'Australian bridal accessories brand',
    challenge: 'The client needed a premium bridal headband collection with pearl embellishments, gold-plated frames, and luxury velvet gift box packaging.',
    solution: 'We developed 6 exclusive designs with faux-pearl detailing, gold-plated flexible frames, and custom velvet presentation boxes with satin lining. Physical samples approved in 10 days.',
    results: ['6 exclusive bridal designs', 'Gold-plated frames + faux pearls', 'Custom velvet gift box packaging', 'Samples approved in 10 days'],
  },
  {
    title: 'UK Subscription Box Brand — Seasonal Hair Bow Sets',
    client: 'UK-based beauty subscription company',
    challenge: 'The client needed quarterly seasonal hair bow collections (4 releases per year), each with 3 designs, custom-printed ribbon, and eco-friendly packaging.',
    solution: 'We set up a seasonal production schedule, designed custom-printed grosgrain ribbons for each collection, used FSC-certified packaging, and maintain a 14-day production cycle per collection.',
    results: ['4 seasonal collections per year', 'FSC-certified packaging', 'Custom-printed ribbon designs', 'Long-term partnership since 2023'],
  },
];

export default function Cases() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <p className="section-label">Case Studies</p>
        <h1 className="text-display-lg text-navy mb-4">Projects We&apos;ve <span className="text-gold">Delivered</span></h1>
        <p className="text-tan text-lg max-w-2xl mb-16 leading-relaxed">
          Real projects, real clients, real results. Here&apos;s how we&apos;ve helped brands bring their hair accessories to market — from concept to delivery.
        </p>

        {/* Case Studies List */}
        <div className="space-y-20 mb-24">
          {cases.map((c, i) => (
            <div key={c.title} className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <div className="text-sm font-medium text-tan mb-1">{`Case ${`0${i + 1}`}`}</div>
                <p className="text-xs text-tan">{c.client}</p>
              </div>
              <div className="md:col-span-5">
                <h2 className="text-xl font-display text-navy mb-4">{c.title}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] tracking-wider uppercase text-tan mb-1">Challenge</p>
                    <p className="text-sm text-bronze/80 leading-relaxed">{c.challenge}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-wider uppercase text-tan mb-1">Our Solution</p>
                    <p className="text-sm text-bronze/80 leading-relaxed">{c.solution}</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="bg-sand/50 p-6 border border-bronze/10">
                  <p className="text-[10px] tracking-wider uppercase text-tan mb-4">Key Results</p>
                  <ul className="space-y-3">
                    {c.results.map((r, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-navy">
                        <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {i < cases.length - 1 && (
                <div className="md:col-span-12">
                  <div className="divider" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Capability Summary */}
        <div className="bg-white p-12 md:p-16 border border-bronze/10 mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-label">What We Can Do For You</p>
            <h2 className="text-display-sm text-navy mb-8">Your Project, <span className="text-gold">Our Expertise</span></h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                { title: 'New Brand Launch', desc: 'From first sample to first bulk order — we guide new brands through the entire manufacturing process with low MOQ and fast sampling.' },
                { title: 'Existing Line Expansion', desc: 'Add new categories, colors, or seasonal collections to your existing product line with consistent quality and on-time delivery.' },
                { title: 'Private Label Partnership', desc: 'Full private label manufacturing with your branding on product, packaging, and marketing materials. We become your production partner.' },
              ].map(item => (
                <div key={item.title}>
                  <h3 className="text-sm font-medium text-navy mb-2">{item.title}</h3>
                  <p className="text-xs text-tan leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-display-sm text-navy mb-4">Ready to Be Our <span className="text-gold">Next Case Study?</span></h2>
          <p className="text-tan text-lg mb-8">Tell us about your project. Free design mockup and quote within 24 hours.</p>
          <Link to="/contact" className="btn-primary text-base px-12 py-5">
            Start Your Project <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
