import { Link } from 'react-router-dom';

const certs = [
  { name: 'BSCI', desc: 'Business Social Compliance Initiative — ethical manufacturing audited' },
  { name: 'ISO 9001', desc: 'Quality management system certified' },
  { name: 'OEKO-TEX', desc: 'Textiles tested for harmful substances' },
  { name: 'FSC Packaging', desc: 'Sustainable packaging materials available' },
];

export default function About() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <p className="section-label">About WINCOME</p>
            <h1 className="text-[36px] leading-[1.1] sm:text-display-lg text-navy mb-4">The Partner Behind <span className="text-gold">Elegant Hair Accessories</span></h1>
            <p className="text-tan text-lg leading-relaxed mb-6">
              WINCOME Hair Accessories is the dedicated hair accessories division of WINCOME — a trusted name in global apparel manufacturing. We bring the same commitment to quality, reliability, and partnership to every hair accessory we produce.
            </p>
            <p className="text-tan leading-relaxed mb-6">
              Our 3,000m² integrated facility houses design, prototyping, production, and quality control under one roof. With 15+ years of manufacturing expertise and a team of 200+ skilled professionals, we deliver consistent quality at factory-direct pricing.
            </p>
            <Link to="/manufacturer-profile" className="text-sm font-medium text-navy underline underline-offset-4 hover:text-gold transition-colors">
              Review manufacturer facts and buyer fit →
            </Link>
          </div>
          <div className="aspect-[4/3] bg-sand flex items-center justify-center border border-bronze/10">
            <img src="/assets/images/hero-clips.webp" alt="WINCOME Factory" loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-12 border-y border-bronze/10 mb-24">
          {[
            ['15+', 'Years Experience'],
            ['200+', 'Skilled Staff'],
            ['3,000m²', 'Factory Floor'],
            ['50+', 'Export Countries'],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="text-display-sm text-navy font-display mb-1">{value}</div>
              <div className="text-xs tracking-[0.15em] uppercase text-tan">{label}</div>
            </div>
          ))}
        </div>

        {/* Sister Brand */}
        <div className="bg-white p-12 md:p-20 border border-bronze/10 mb-24">
          <div className="max-w-3xl">
            <p className="section-label">The WINCOME Family</p>
            <h2 className="text-display-sm text-navy mb-6">A Legacy of <span className="text-gold">Manufacturing Excellence</span></h2>
            <p className="text-tan leading-relaxed mb-8">
              WINCOME Hair Accessories operates as a specialized division within the WINCOME manufacturing group. Our sister division, WINCOME Apparel, has served global brands in custom clothing manufacturing for over a decade. This shared infrastructure means our hair accessories clients benefit from established supply chains, quality systems, and international logistics networks.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] border border-bronze/10 p-6">
                <p className="text-xs tracking-wider uppercase text-tan mb-1">WINCOME Apparel</p>
                <p className="text-sm text-navy">Custom clothing manufacturing — hoodies, t-shirts, activewear</p>
              </div>
              <div className="flex-1 min-w-[200px] border border-bronze/10 p-6 border-navy">
                <p className="text-xs tracking-wider uppercase text-gold mb-1">WINCOME Hair Accessories</p>
                <p className="text-sm text-navy">Custom hair accessories — clips, headbands, scrunchies, bows</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-24">
          <h2 className="text-display-sm text-navy mb-8">Certifications & <span className="text-gold">Compliance</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            {certs.map(cert => (
              <div key={cert.name} className="bg-white p-8 border border-bronze/10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-sand/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 className="text-sm font-medium text-navy mb-2">{cert.name}</h3>
                <p className="text-xs text-tan leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-display-sm text-navy mb-4">Let&apos;s Build <span className="text-gold">Something Great</span></h2>
          <p className="text-tan text-lg mb-8">Partner with WINCOME for your next hair accessories collection.</p>
          <Link to="/contact" className="btn-primary text-base px-12 py-5">
            Get in Touch <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
