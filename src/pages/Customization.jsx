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

export default function Customization() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <p className="section-label">OEM / ODM Capabilities</p>
        <h1 className="text-display-lg text-navy mb-4">Custom <span className="text-gold">Manufacturing</span></h1>
        <p className="text-tan text-lg max-w-2xl mb-16 leading-relaxed">
          Full-spectrum customization for global brands. From initial concept to final delivery — your product, your specifications, our manufacturing expertise.
        </p>

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

        {/* Custom Process */}
        <div className="bg-navy text-white p-12 md:p-20 mb-24">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-4">Custom Project Process</p>
          <h2 className="text-display-sm mb-12">From Concept to <span className="text-gold">Completion</span></h2>
          <div className="grid md:grid-cols-4 gap-8">
            {customSteps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-2rem)] h-px bg-white/10" />}
                <div className="text-5xl font-display text-gold/30 mb-4">{s.step}</div>
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
        </div>
      </div>
    </div>
  );
}
