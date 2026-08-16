import { Link } from 'react-router-dom';

const capabilities = [
  { title: 'Logo & Branding', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', desc: 'Laser engraving, foil stamping, metal plates, woven labels, custom printed ribbon — your brand identity applied with precision.' },
  { title: 'Color Customization', icon: 'M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z', desc: 'Pantone color matching across all materials. Custom colors for acetate, fabric, metal plating, and embellishments.' },
  { title: 'Material Selection', icon: 'M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7', desc: 'Choose from cellulose acetate, zinc alloy, mulberry silk, premium satin, organic cotton, velvet, and more.' },
  { title: 'Packaging Design', icon: 'M20 12H4m16 0l-4-4m4 4l-4 4', desc: 'Custom packaging from individual cards to luxury gift boxes. Complete unboxing experience design.' },
  { title: 'Size & Shape', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', desc: 'Custom dimensions and shapes — standard sizes or bespoke molds for unique designs. Minimum mold fee applies for new shapes.' },
  { title: 'Quality Assurance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', desc: 'Multi-stage QC inspection at raw material, in-process, and final stages. AQL 2.5 standard with final random inspection reports.' },
];

const materialsList = [
  { name: 'Cellulose Acetate', use: 'Claw clips, barrettes, hair pins', eco: 'Plant-based, biodegradable option' },
  { name: 'Zinc Alloy', use: 'Metal clips, headband frames', eco: 'Recyclable metal' },
  { name: 'Mulberry Silk', use: 'Scrunchies, hair ties, ribbons', eco: 'Natural protein fiber' },
  { name: 'Premium Satin', use: 'Bows, ribbons, headband wraps', eco: 'Polyester or silk blend' },
  { name: 'Organic Cotton', use: 'Scrunchies, fabric headbands', eco: 'GOTS certified available' },
  { name: 'Velvet', use: 'Scrunchies, headband covers', eco: 'OEKO-TEX certified available' },
];

const customSteps = [
  { step: '01', title: 'Share Your Vision', desc: 'Send us your design brief, reference images, or rough sketches. Our team will create initial specifications within 24 hours.' },
  { step: '02', title: 'Design & Prototype', desc: 'We produce digital 3D mockups and physical samples. Iterate until every detail matches your brand requirements.' },
  { step: '03', title: 'Bulk Production', desc: 'Once you approve the final sample, we move to full production with regular photo updates at every milestone.' },
  { step: '04', title: 'Quality & Shipping', desc: 'Final QC inspection, professional packaging, and global shipping via your preferred logistics method.' },
];

const serviceFacts = [
  { value: 'From 100 pcs', label: 'Starting MOQ' },
  { value: 'Within 24h', label: 'Initial response' },
  { value: '5–7 days', label: 'Physical sample' },
  { value: '8–18 days', label: 'Typical production' },
];

const privateLabelRows = [
  ['Product development', 'Existing catalog styles, modified constructions or new shapes with custom dimensions and performance requirements'],
  ['Color & finish', 'Pantone-matched materials, custom prints, metal plating, surface coating and coordinated seasonal color sets'],
  ['Product branding', 'Laser engraving, foil stamping, metal logo plates, woven labels and printed ribbon'],
  ['Retail packaging', 'Logo cards, hang tags, pouches, gift boxes, inserts, barcodes and display-ready packaging'],
  ['Compliance support', 'Material documentation, agreed testing, destination labels and pre-shipment inspection records'],
];

const quoteFactors = [
  { title: 'Existing vs new construction', text: 'Using an existing style avoids new tooling. Bespoke shapes, molds and hardware are quoted separately.' },
  { title: 'Material and finish', text: 'Acetate, metal, silk, decoration, plating and special color effects have different setup and unit costs.' },
  { title: 'Quantity and color split', text: 'MOQ may apply by style or color. Larger consolidated runs usually improve unit and freight efficiency.' },
  { title: 'Branding and packaging', text: 'Logo method, labels, inserts, cards, pouches and boxes add artwork, tooling and assembly steps.' },
];

export default function Customization() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <p className="section-label">OEM / ODM Capabilities</p>
        <h1 className="text-[38px] leading-[1.1] sm:text-display-lg text-navy mb-4">Custom Hair Accessories <span className="text-gold">OEM & Private Label</span></h1>
        <p className="text-tan text-lg max-w-3xl mb-10 leading-relaxed">
          Develop custom hair clips, claw clips, headbands, scrunchies and bows with controlled materials, Pantone colors, dimensions, logos, labels and retail packaging. WINCOME supports the process from product brief and physical sample to inspected bulk production and global shipping.
        </p>

        <div className="mb-20 grid grid-cols-2 border border-bronze/10 bg-white md:grid-cols-4" aria-label="Customization service facts">
          {serviceFacts.map((fact, index) => (
            <div key={fact.label} className={`p-5 md:p-6 ${index < 3 ? 'md:border-r md:border-bronze/10' : ''} ${index < 2 ? 'border-b border-bronze/10 md:border-b-0' : ''} ${index % 2 === 0 ? 'border-r border-bronze/10 md:border-r' : ''}`}>
              <p className="font-display text-xl text-navy">{fact.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-tan">{fact.label}</p>
            </div>
          ))}
        </div>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {capabilities.map(cap => (
            <div key={cap.title} className="bg-white p-8 border border-bronze/10">
              <svg className="w-10 h-10 text-gold mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d={cap.icon} />
              </svg>
              <h3 className="text-lg font-display text-navy mb-3">{cap.title}</h3>
              <p className="text-sm text-tan leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* Materials */}
        <div className="mb-24">
          <h2 className="text-display-sm text-navy mb-8">Material <span className="text-gold">Library</span></h2>
          <div className="grid md:grid-cols-3 gap-4">
            {materialsList.map(m => (
              <div key={m.name} className="border border-bronze/10 p-6 bg-white">
                <h3 className="text-sm font-medium text-navy mb-2">{m.name}</h3>
                <p className="text-xs text-tan mb-1">Best for: {m.use}</p>
                <p className="text-xs text-gold">{m.eco}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="section-label">Private-Label Scope</p>
            <h2 className="text-display-sm text-navy">What Your Brand Can Specify</h2>
            <p className="mt-5 leading-relaxed text-tan">Start with an existing production direction or send a complete design brief. Each quotation separates the product, branding, packaging and any tooling so buyers can compare options clearly.</p>
            <Link to="/sourcing" className="mt-6 inline-flex text-sm font-medium text-navy underline underline-offset-4 hover:text-gold">Review MOQ and order requirements</Link>
          </div>
          <div className="border border-bronze/10 bg-white">
            {privateLabelRows.map(([area, detail], index) => (
              <div key={area} className={`grid gap-2 p-5 sm:grid-cols-[0.28fr_0.72fr] sm:gap-6 ${index < privateLabelRows.length - 1 ? 'border-b border-bronze/10' : ''}`}>
                <h3 className="text-sm font-medium text-navy">{area}</h3>
                <p className="text-sm leading-relaxed text-tan">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <p className="section-label">Factory-Direct Quotation</p>
          <h2 className="text-display-sm text-navy">What Changes MOQ and Unit Cost</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {quoteFactors.map((factor) => (
              <article key={factor.title} className="border border-bronze/10 bg-sand/35 p-6">
                <h3 className="font-display text-lg text-navy">{factor.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-tan">{factor.text}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Custom Process */}
        <div className="bg-navy text-white p-12 md:p-20 mb-24">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-champagne mb-4">Custom Project Process</p>
          <h2 className="text-display-sm mb-12">From Concept to <span className="text-champagne italic font-light">Completion</span></h2>
          <div className="grid md:grid-cols-4 gap-8">
            {customSteps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-2rem)] h-px bg-white/10" />}
                <div className="text-5xl font-display text-champagne/30 mb-4">{s.step}</div>
                <h3 className="text-lg font-display text-white mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-display-sm text-navy mb-4">Start Your <span className="text-gold">Custom Project</span></h2>
          <p className="text-tan text-lg mb-8">Tell us your requirements and receive a free design mockup with factory-direct pricing within 24 hours.</p>
          <Link to="/contact" className="btn-primary text-base px-12 py-5">
            Request Custom Quote <span className="ml-1">→</span>
          </Link>
          <p className="mt-5 text-sm text-tan">Need QC or compliance details first? <Link to="/quality" className="font-medium text-navy underline underline-offset-4 hover:text-gold">Review our quality-control process</Link>.</p>
        </div>
      </div>
    </div>
  );
}
