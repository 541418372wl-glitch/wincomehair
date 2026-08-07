import { Link } from 'react-router-dom';

const productCategories = [
  { name: 'Hair Claws & Clips', image: '/assets/images/product-claw-butterfly.webp', desc: 'Acetate, metal, butterfly & more' },
  { name: 'Headbands', image: '/assets/images/product-headband-braided.webp', desc: 'Padded, knotted, braided & embellished' },
  { name: 'Scrunchies & Hair Ties', image: '/assets/images/product-scrunchie-velvet.webp', desc: 'Silk, velvet, satin & cotton' },
  { name: 'Hair Bows & Ribbons', image: '/assets/images/product-bow-clip.webp', desc: 'Satin, grosgrain & custom print' },
];

const featuredProducts = [
  { id: 'claw-butterfly', name: 'Butterfly Hair Claw Clips', image: '/assets/images/product-claw-butterfly.webp', moq: '200 pcs', leadTime: '15-18 days', material: 'Metal Frame + Resin' },
  { id: 'headband-braided', name: 'Braided Velvet Headbands', image: '/assets/images/product-headband-braided.webp', moq: '300 pcs', leadTime: '12-15 days', material: 'Premium Velvet' },
  { id: 'scrunchie-velvet', name: 'Velvet Scrunchies', image: '/assets/images/product-scrunchie-velvet.webp', moq: '300 pcs', leadTime: '10-12 days', material: 'Premium Velvet' },
  { id: 'bow-clip', name: 'Bow Hair Clips', image: '/assets/images/product-bow-clip.webp', moq: '200 pcs', leadTime: '12-15 days', material: 'Fabric + Metal Clip' },
];

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Global Brands' },
  { value: '50+', label: 'Export Countries' },
  { value: '3,000m²', label: 'Factory Floor' },
];

const processSteps = [
  { step: '01', title: 'Send Requirements', desc: 'Share your product idea, reference image, or design brief. No design files needed to start.', details: ['Approx. dimensions', 'Product type & quantity', 'Target material & color'] },
  { step: '02', title: 'Design & Quote in 24h', desc: 'Our team creates structural specs and a detailed quotation within one business day.', details: ['3D rendered mockup', 'Material & finish options', 'Itemized factory-direct price'] },
  { step: '03', title: 'Approve Sample', desc: 'Review a physical pre-production sample before committing to bulk production.', details: ['Sample ready in 5-7 days', 'Shipped via DHL/FedEx', 'Unlimited revisions'] },
  { step: '04', title: 'Production & Delivery', desc: 'We manufacture, you track. Every production milestone is documented with photo updates.', details: ['10-18 days production', 'Sea freight or air shipping', 'Amazon FBA direct supported'] },
];

const testimonials = [
  { quote: 'WINCOME exceeded every expectation. The acetate clips arrived perfectly finished and on schedule. Our buyers specifically commented on the quality.', author: 'Sarah Mitchell', role: 'Founder, Bloom Accessories', country: 'US' },
  { quote: 'After trying 3 other manufacturers, WINCOME is in a different league. Consistent quality, excellent communication, and they handled our custom colors perfectly.', author: 'James Chen', role: 'Procurement Manager, StyleHouse EU', country: 'UK' },
  { quote: 'We order quarterly and WINCOME has never missed a deadline. Their design team is fast and professional. The price-quality ratio is unmatched.', author: 'Amina Rashid', role: 'Supply Chain Director, LuxeBeauty ME', country: 'UAE' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src="/assets/images/hero-clips-mobile.webp" srcSet="/assets/images/hero-clips-mobile.webp 1024w, /assets/images/hero-clips.webp 1536w" sizes="100vw" alt="" fetchPriority="high" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />

        <div className="container-site relative z-10 pt-32 pb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-blush" />
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-champagne">Custom Hair Accessories Manufacturer</p>
          </div>
          <h1 className="text-white text-display-xl md:text-[88px] max-w-3xl leading-[1.02] mb-8">
            Premium Hair Accessories.<br />
            <span className="text-champagne italic font-light">Factory-Direct.</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-12 leading-relaxed">
            OEM & ODM hair clips, claw clips, headbands, scrunchies, and hair bows for global brands, wholesalers, and retailers. Low MOQ, free design service, worldwide shipping.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            {['MOQ: 100 pcs', 'Lead Time: 12 Days', 'Free Design Service', 'Global Shipping'].map(badge => (
              <span key={badge} className="badge !border-white/20 !bg-white/12 !text-white/90">
                <svg className="badge-icon !text-champagne" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 border border-champagne bg-transparent text-champagne px-10 py-5 text-base font-medium tracking-wider uppercase transition-all duration-200 hover:bg-champagne hover:text-navy">
              Request a Quote <span className="ml-1">→</span>
            </Link>
            <Link to="/products" className="btn-outline !border-white/20 !text-white hover:!border-white/40 hover:!bg-white/5 text-base px-10 py-5">
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-bronze/10">
        <div className="container-site py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="text-display-sm text-navy font-display mb-1">{stat.value}</div>
                <div className="text-xs tracking-[0.15em] uppercase text-tan">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-gap">
        <div className="container-site">
          <p className="section-label">Product Categories</p>
          <h2 className="text-display-lg text-navy mb-4">What We <span className="text-gold">Manufacture</span></h2>
          <p className="text-tan text-lg max-w-xl mb-12">Full-category hair accessories manufacturing with complete customization — from material to finish, logo to packaging.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {productCategories.map(cat => (
              <Link to="/products" key={cat.name} className="group relative overflow-hidden h-72 md:h-80 block">
                <img src={cat.image} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-2xl font-display mb-1">{cat.name}</h3>
                  <p className="text-white/60 text-sm">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-gap bg-sand/50">
        <div className="container-site">
          <p className="section-label">Featured Products</p>
          <h2 className="text-display-lg text-navy mb-4">Best-Selling <span className="text-gold">Collections</span></h2>
          <p className="text-tan text-lg max-w-xl mb-12">Proven designs trusted by brands worldwide. Every product is fully customizable — size, color, material, finish, logo, and packaging.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="group bg-white overflow-hidden border border-bronze/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-medium text-navy mb-3 group-hover:text-gold transition-colors">{product.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] tracking-wider uppercase bg-sand/60 text-tan px-2 py-1">MOQ: {product.moq}</span>
                    <span className="text-[10px] tracking-wider uppercase bg-sand/60 text-tan px-2 py-1">{product.leadTime}</span>
                    <span className="text-[10px] tracking-wider uppercase bg-sand/60 text-tan px-2 py-1">{product.material}</span>
                  </div>
                  <span className="text-xs font-medium tracking-wider uppercase text-navy group-hover:text-gold transition-colors inline-flex items-center gap-1">
                    Quote This Product <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-outline">
              View Full Catalog <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="section-gap bg-navy text-white">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-champagne mb-4">Why WINCOME</p>
              <h2 className="text-display-lg mb-6">Factory-Direct.<br /><span className="text-champagne italic font-light">Zero Middlemen.</span></h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                When you work with WINCOME, you work directly with the people making your products — no agents, no markups, no surprises.
              </p>
              <ul className="space-y-6">
                {[
                  { title: 'In-House Design Service', desc: 'Professional design team creates specs and artwork at no charge.' },
                  { title: 'Certified Manufacturing', desc: 'BSCI, ISO 9001 compliant. EU & US safety standards.' },
                  { title: 'Real-Time Updates', desc: 'Photo and video proof at every production milestone.' },
                  { title: 'Low MOQ, Fast Turnaround', desc: 'Start at 100 pcs with delivery in as fast as 10 days.' },
                ].map(item => (
                  <li key={item.title} className="flex gap-4">
                    <svg className="w-5 h-5 text-champagne mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    <div>
                      <h4 className="text-sm font-medium mb-1">{item.title}</h4>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 p-8">
              <h3 className="text-lg font-display mb-8 text-white">WINCOME vs. Generic Platforms</h3>
              <div className="space-y-4">
                {[
                  { win: 'Wholesale Factory Pricing', lose: '30-50% platform markup' },
                  { win: 'Bespoke Customization — any size, any material', lose: 'Limited template designs' },
                  { win: '1-on-1 Design Expert Support', lose: 'Bot or generic customer service' },
                  { win: 'Factory-direct logistics at trade rates', lose: 'Standard carrier rates, no negotiation' },
                  { win: 'Physical samples in 5-7 days', lose: 'No sample or 2+ week wait' },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-white/10">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                        <span className="text-sm text-white/90">{row.win}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-white/20 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        <span className="text-sm text-white/40">{row.lose}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Process Flow */}
          <div>
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-champagne mb-4">How It Works</p>
            <h2 className="text-display-lg mb-12">From Brief to <span className="text-champagne italic font-light">Doorstep</span></h2>
            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <div key={step.step} className="relative">
                  {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-2rem)] h-px bg-white/10" />}
                  <div className="text-5xl font-display text-champagne/30 mb-4">{step.step}</div>
                  <h3 className="text-lg font-display text-white mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{step.desc}</p>
                  <ul className="space-y-1">
                    {step.details.map(d => (
                      <li key={d} className="text-xs text-white/40 flex items-center gap-2">
                        <span className="w-1 h-1 bg-gold/50" />{d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap bg-sand/50">
        <div className="container-site">
          <p className="section-label">Client Reviews</p>
          <h2 className="text-display-lg text-navy mb-4">What Our <span className="text-gold">Clients Say</span></h2>
          <p className="text-tan text-lg max-w-xl mb-12">Real feedback from brands who trust WINCOME for their hair accessories manufacturing.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 border border-bronze/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-bronze/70 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-bronze/10 pt-4">
                  <p className="text-sm font-medium text-navy">{t.author}</p>
                  <p className="text-xs text-tan">{t.role} <span className="ml-1">({t.country})</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-gap bg-white">
        <div className="container-site text-center max-w-3xl">
          <p className="section-label">Start Your Project</p>
          <h2 className="text-display-lg text-navy mb-4">Ready to Discuss <span className="text-gold">Your Requirements?</span></h2>
          <p className="text-tan text-lg mb-10 leading-relaxed">
            Free design mockup and factory-direct quote in 24 hours. No commitment, no spam — just a conversation with our product specialist.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary text-base px-12 py-5">
              Request a Free Quote <span className="ml-1">→</span>
            </Link>
            <Link to="/customization" className="btn-outline text-base px-12 py-5">
              Explore OEM / ODM
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="section-gap bg-sand/50">
        <div className="container-site">
          <p className="section-label">Insights</p>
          <h2 className="text-display-lg text-navy mb-4">Hair Accessories <span className="text-gold">Resources</span></h2>
          <p className="text-tan text-lg max-w-xl mb-12">Expert guides on sourcing, customization, and trends in the hair accessories industry.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Metal Hair Clips Material Guide: Zinc Alloy vs Stainless Steel vs Aluminum', date: 'Aug 2026', slug: 'metal-hair-clip-material-guide' },
              { title: 'Private Label Hair Accessories: A Step-by-Step Guide for Etsy & Amazon Sellers', date: 'Aug 2026', slug: 'private-label-hair-accessories-guide' },
              { title: 'Silk vs Satin Scrunchies: Which Fabric Is Better for Hair — and for Your Business?', date: 'Aug 2026', slug: 'silk-vs-satin-scrunchies' },
            ].map(post => (
              <Link to={`/blog/${post.slug}`} key={post.title} className="group bg-white p-8 border border-bronze/10 hover:border-bronze/20 transition-all duration-300">
                <p className="text-[10px] tracking-wider uppercase text-tan mb-3">{post.date}</p>
                <h3 className="text-base font-display text-navy group-hover:text-gold transition-colors leading-relaxed">{post.title}</h3>
                <span className="text-xs font-medium tracking-wider uppercase text-navy mt-4 inline-flex items-center gap-1 group-hover:text-gold transition-colors">
                  Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
