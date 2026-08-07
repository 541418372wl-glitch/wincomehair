import { Link } from 'react-router-dom';

const stages = [
  {
    title: 'Raw Material Inspection',
    desc: 'All incoming materials — acetate sheets, metals, fabrics, pearls, and packaging — are inspected against our material specification sheets before entering production.',
    items: ['Material certification verification', 'Color and texture matching against Pantone standards', 'Surface defect screening for scratches, bubbles, unevenness', 'Metal plating thickness and adhesion testing'],
  },
  {
    title: 'In-Process Quality Control',
    desc: 'Dedicated QC inspectors monitor every production stage. We check 5-10 samples per batch at each workstation before the next stage begins.',
    items: ['Spring mechanism tension and durability testing', 'Edge finishing and burr inspection', 'Adhesive strength for embellished and multi-part products', 'Dimensional accuracy against approved sample specs'],
  },
  {
    title: 'Final Random Inspection',
    desc: 'Before shipment, every order undergoes AQL 2.5 random sampling inspection. A detailed inspection report is provided upon request.',
    items: ['AQL 2.5 Level II sampling standard', 'Visual appearance, color consistency, logo accuracy', 'Packaging integrity and labeling verification', 'Pull test, drop test, and functional checks as applicable'],
  },
  {
    title: 'Pre-Shipment Documentation',
    desc: 'We provide complete documentation for every order — inspection reports, compliance certificates, and shipping documents.',
    items: ['Third-party testing reports (available on request)', 'REACH, RoHS compliance documentation', 'OEKO-TEX certification for textile products', 'FSC-certified packaging documentation'],
  },
];

const testItems = [
  { category: 'Metal Clips', tests: 'Spring fatigue test (500+ cycles), plating adhesion, nickel release (EU compliant), edge sharpness' },
  { category: 'Acetate Claws', tests: 'Drop test (1m), color fastness, dimensional stability, surface scratch resistance' },
  { category: 'Fabric Accessories', tests: 'Color fastness to washing/rubbing, seam strength, dye safety (OEKO-TEX), shrinkage' },
  { category: 'Pearl & Rhinestone', tests: 'Adhesion strength, tarnish resistance, lead & heavy metal content, setting security' },
  { category: 'Packaging', tests: 'Print registration accuracy, glue adhesion, fold endurance, moisture resistance' },
];

export default function Quality() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <p className="section-label">Quality Assurance</p>
        <h1 className="text-display-lg text-navy mb-4">How We <span className="text-gold">Control Quality</span></h1>
        <p className="text-tan text-lg max-w-2xl mb-16 leading-relaxed">
          Every product shipped from our factory passes through a three-stage quality control system. From raw materials to final packaging — nothing leaves without inspection.
        </p>

        {/* QC Stages */}
        <div className="space-y-16 mb-24">
          {stages.map((stage, i) => (
            <div key={stage.title} className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-2">
                <div className="text-5xl font-display text-gold/30">{`0${i + 1}`}</div>
              </div>
              <div className="md:col-span-4">
                <h2 className="text-xl font-display text-navy mb-3">{stage.title}</h2>
                <p className="text-sm text-tan leading-relaxed">{stage.desc}</p>
              </div>
              <div className="md:col-span-6">
                <ul className="space-y-3">
                  {stage.items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-bronze/80">
                      <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Test Standards Table */}
        <div className="mb-24">
          <h2 className="text-display-sm text-navy mb-8">Testing <span className="text-gold">Standards</span> by Product Category</h2>
          <div className="border border-bronze/10">
            {testItems.map((item, i) => (
              <div key={item.category} className={`grid md:grid-cols-5 gap-4 p-6 ${i < testItems.length - 1 ? 'border-b border-bronze/10' : ''}`}>
                <div className="md:col-span-1">
                  <p className="text-sm font-medium text-navy">{item.category}</p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-sm text-tan leading-relaxed">{item.tests}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-navy text-white p-12 md:p-20 mb-24">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-champagne mb-4">Certifications</p>
          <h2 className="text-display-sm mb-8">Built to <span className="text-champagne italic font-light">Global Standards</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'BSCI', desc: 'Social compliance audited — ethical manufacturing' },
              { name: 'ISO 9001', desc: 'Quality management system certified' },
              { name: 'OEKO-TEX', desc: 'Textiles tested for harmful substances' },
              { name: 'REACH / RoHS', desc: 'EU chemical safety compliance' },
            ].map(cert => (
              <div key={cert.name} className="border border-white/10 p-6 text-center">
                <svg className="w-10 h-10 text-champagne mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <h3 className="text-sm font-medium text-white mb-2">{cert.name}</h3>
                <p className="text-xs text-white/50">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-display-sm text-navy mb-4">Request a <span className="text-gold">Sample Report</span></h2>
          <p className="text-tan text-lg mb-8">Want to see our QC reports or request a pre-production sample? Let us know.</p>
          <Link to="/contact" className="btn-primary text-base px-12 py-5">
            Request Sample <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
