import { useState } from 'react';
import { waLink } from '../lib/whatsapp';

export default function Contact() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    productType: '', quantity: '', material: '', logoPlacement: '',
    dimensions: '', message: '', targetMarket: '', timeline: '', website: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Honeypot: silently drop bot submissions
    if (form.website) return;
    setSubmitting(true);
    setSubmitError(null);

    const record = {
      name: form.name,
      company: form.company || null,
      email: form.email,
      phone: form.phone || null,
      product_type: form.productType || null,
      quantity: form.quantity || null,
      material: form.material || null,
      logo_placement: form.logoPlacement || null,
      target_market: form.targetMarket || null,
      timeline: form.timeline || null,
      dimensions: form.dimensions || null,
      message: form.message || null,
    };

    try {
      const res = await fetch('/api/notify-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || result.saved !== true) {
        throw new Error(result.error || 'Failed to save inquiry');
      }

      if (result.notified === false) {
        console.warn('Inquiry saved, but email notification was not sent.');
      }
      setStep(4);
    } catch (error) {
      console.error('Inquiry submission failed:', error);
      setSubmitError('Failed to submit. Please try again or contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <div className="max-w-3xl mx-auto">
          <p className="section-label text-center">Get a Quote</p>
                <h1 className="text-[38px] leading-[1.1] sm:text-display-lg text-navy text-center mb-4">
            Request Your <span className="text-gold">Free Quote</span>
          </h1>
          <p className="text-tan text-lg text-center mb-16 max-w-xl mx-auto leading-relaxed">
            Free design mockup and factory-direct pricing in 24 hours. No commitment required.
          </p>

          {/* WhatsApp primary CTA */}
          <div className="bg-[#25D366]/5 border border-[#25D366]/30 p-8 md:p-10 mb-16 text-center">
            <p className="text-[10px] tracking-wider uppercase text-[#128C7E] mb-3">Fastest Response — Chat Directly</p>
            <h2 className="text-display-sm text-navy mb-4">
              Prefer WhatsApp? <span className="text-[#25D366]">Talk to a Specialist Now</span>
            </h2>
            <p className="text-tan text-base max-w-xl mx-auto mb-6 leading-relaxed">
              Average reply within 1–2 hours on WhatsApp — much faster than email. Send your product idea, quantity and reference photos and get an instant first response.
            </p>
            <a
              href={waLink('Hello WINCOME, I would like to discuss a custom hair accessories project. Can we chat?')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-base px-12 py-5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp <span className="ml-1">→</span>
            </a>
            <p className="text-xs text-tan mt-4">
              Or continue with the quote form below — we reply within 24 hours.
            </p>
          </div>

          {/* Step indicators */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-4 mb-16">
              {['Product', 'Details', 'Contact'].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-8 h-8 flex items-center justify-center text-xs font-medium border ${
                    step > i + 1 ? 'bg-navy text-white border-navy' : step === i + 1 ? 'border-navy text-navy' : 'border-bronze/20 text-tan'
                  }`}>{i + 1}</span>
                  <span className={`text-xs tracking-wider uppercase ${step === i + 1 ? 'text-navy font-medium' : 'text-tan'}`}>{label}</span>
                  {i < 2 && <span className="w-8 h-px bg-bronze/20 hidden sm:block" />}
                </div>
              ))}
            </div>
          )}

          {/* Form */}
          {step === 4 ? (
            <div className="text-center bg-white p-16 border border-bronze/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-navy flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h2 className="text-display-sm text-navy mb-4">Thank You for Your Inquiry</h2>
              <p className="text-tan text-lg max-w-md mx-auto leading-relaxed">
                Our product specialist will review your requirements and respond within 24 hours with a free design mockup and factory-direct quote.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-16 border border-bronze/10">
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <label htmlFor="productType" className="block text-xs tracking-wider uppercase text-tan mb-1">Product Type *</label>
                    <select
                      id="productType"
                      name="productType"
                      required
                      value={form.productType}
                      onChange={e => update('productType', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select product type...</option>
                      <option value="claw-clips">Hair Claws & Clips</option>
                      <option value="headbands">Headbands</option>
                      <option value="scrunchies">Scrunchies & Hair Ties</option>
                      <option value="bows">Hair Bows & Ribbons</option>
                      <option value="pins">Hair Pins & Barrettes</option>
                      <option value="other">Multiple Types / Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-xs tracking-wider uppercase text-tan mb-1">Estimated Quantity *</label>
                    <select
                      id="quantity"
                      name="quantity"
                      required
                      value={form.quantity}
                      onChange={e => update('quantity', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select quantity range...</option>
                      <option value="100-300">100–300 pcs (Low MOQ)</option>
                      <option value="300-1000">300–1,000 pcs</option>
                      <option value="1000-5000">1,000–5,000 pcs</option>
                      <option value="5000+">5,000+ pcs (High Volume)</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!form.productType || !form.quantity}
                      className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next: Details →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <label htmlFor="material" className="block text-xs tracking-wider uppercase text-tan mb-1">Material Preference</label>
                    <select id="material" name="material" value={form.material} onChange={e => update('material', e.target.value)} className="input-field">
                      <option value="">Select material...</option>
                      <option value="acetate">Cellulose Acetate</option>
                      <option value="metal">Zinc Alloy / Metal</option>
                      <option value="silk">Mulberry Silk</option>
                      <option value="satin">Premium Satin</option>
                      <option value="cotton">Organic Cotton</option>
                      <option value="velvet">Velvet</option>
                      <option value="not-sure">Not Sure — Need Recommendation</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="logoPlacement" className="block text-xs tracking-wider uppercase text-tan mb-1">Logo Placement</label>
                    <select id="logoPlacement" name="logoPlacement" value={form.logoPlacement} onChange={e => update('logoPlacement', e.target.value)} className="input-field">
                      <option value="">Select placement...</option>
                      <option value="center">Product Center</option>
                      <option value="side">Side / Edge</option>
                      <option value="all-over">All-Over Print</option>
                      <option value="packaging-only">Packaging Only</option>
                      <option value="no-logo">No Logo</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="targetMarket" className="block text-xs tracking-wider uppercase text-tan mb-1">Target Market</label>
                    <select id="targetMarket" name="targetMarket" value={form.targetMarket} onChange={e => update('targetMarket', e.target.value)} className="input-field">
                      <option value="">Select market...</option>
                      <option>North America</option>
                      <option>Europe / UK</option>
                      <option>Australia / NZ</option>
                      <option>Middle East</option>
                      <option>Southeast Asia</option>
                      <option>Latin America</option>
                      <option>Other / Global</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-xs tracking-wider uppercase text-tan mb-1">Expected Lead Time</label>
                    <select id="timeline" name="timeline" value={form.timeline} onChange={e => update('timeline', e.target.value)} className="input-field">
                      <option value="">Select timeline...</option>
                      <option>ASAP (within 2 weeks)</option>
                      <option>1 month</option>
                      <option>2-3 months</option>
                      <option>Just planning / researching</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dimensions" className="block text-xs tracking-wider uppercase text-tan mb-1">Approx. Dimensions (L×W×H cm)</label>
                    <input id="dimensions" name="dimensions" type="text" value={form.dimensions} onChange={e => update('dimensions', e.target.value)} placeholder="e.g. 10×5×3 cm" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs tracking-wider uppercase text-tan mb-1">Additional Message</label>
                    <textarea id="message" name="message" rows="3" value={form.message} onChange={e => update('message', e.target.value)} placeholder="Tell us about your project, reference images, or specific requirements..." className="input-field" />
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline">← Back</button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary">Next: Contact →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs tracking-wider uppercase text-tan mb-1">Your Name *</label>
                      <input id="name" name="name" required type="text" autoComplete="name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Full name" className="input-field" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs tracking-wider uppercase text-tan mb-1">Company Name</label>
                      <input id="company" name="company" type="text" autoComplete="organization" value={form.company} onChange={e => update('company', e.target.value)} placeholder="Your company" className="input-field" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-xs tracking-wider uppercase text-tan mb-1">Email Address *</label>
                      <input id="email" name="email" required type="email" autoComplete="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@company.com" className="input-field" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs tracking-wider uppercase text-tan mb-1">WhatsApp / Phone</label>
                      <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 8900" className="input-field" />
                    </div>
                  </div>
                  {/* Honeypot — hidden from humans */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" value={form.website} onChange={e => update('website', e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <p className="text-xs text-tan leading-relaxed">
                    By submitting this form you agree to our <a href="/privacy" className="text-gold underline">Privacy Policy</a>. We use your details only to respond to your inquiry and never share them with third parties.
                  </p>
                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setStep(2)} className="btn-outline">← Back</button>
                    {submitError && <p className="text-red-500 text-xs mb-4">{submitError}</p>}
                    <button type="submit" disabled={submitting} className="btn-primary text-base px-12 py-5 disabled:opacity-50">
                      {submitting ? 'Submitting...' : <>Send My Request <span className="ml-1">→</span></>}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-tan">
            {['Free Design Mockup', 'No Hidden Fees', 'Sample Before Bulk', 'Reply in 24 Hours'].map(badge => (
              <span key={badge} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
