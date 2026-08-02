import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    productType: '', quantity: '', material: '', logoPlacement: '',
    dimensions: '', message: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    if (supabase) {
      const { error } = await supabase.from('inquiries').insert({
        name: form.name,
        company: form.company || null,
        email: form.email,
        phone: form.phone || null,
        product_type: form.productType || null,
        quantity: form.quantity || null,
        material: form.material || null,
        logo_placement: form.logoPlacement || null,
        dimensions: form.dimensions || null,
        message: form.message || null,
      });

      if (error) {
        setSubmitError('Failed to submit. Please try again or contact us via WhatsApp.');
        setSubmitting(false);
        return;
      }
    }

    setStep(4);
    setSubmitting(false);
  };

  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <div className="max-w-3xl mx-auto">
          <p className="section-label text-center">Get a Quote</p>
          <h1 className="text-display-lg text-navy text-center mb-4">
            Request Your <span className="text-gold">Free Quote</span>
          </h1>
          <p className="text-tan text-lg text-center mb-16 max-w-xl mx-auto leading-relaxed">
            Free design mockup and factory-direct pricing in 24 hours. No commitment required.
          </p>

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
                    <label className="block text-xs tracking-wider uppercase text-tan mb-1">Product Type *</label>
                    <select
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
                    <label className="block text-xs tracking-wider uppercase text-tan mb-1">Estimated Quantity *</label>
                    <select
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
                    <label className="block text-xs tracking-wider uppercase text-tan mb-1">Material Preference</label>
                    <select value={form.material} onChange={e => update('material', e.target.value)} className="input-field">
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
                    <label className="block text-xs tracking-wider uppercase text-tan mb-1">Logo Placement</label>
                    <select value={form.logoPlacement} onChange={e => update('logoPlacement', e.target.value)} className="input-field">
                      <option value="">Select placement...</option>
                      <option value="center">Product Center</option>
                      <option value="side">Side / Edge</option>
                      <option value="all-over">All-Over Print</option>
                      <option value="packaging-only">Packaging Only</option>
                      <option value="no-logo">No Logo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-tan mb-1">Approx. Dimensions (L×W×H cm)</label>
                    <input type="text" value={form.dimensions} onChange={e => update('dimensions', e.target.value)} placeholder="e.g. 10×5×3 cm" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-tan mb-1">Additional Message</label>
                    <textarea rows="3" value={form.message} onChange={e => update('message', e.target.value)} placeholder="Tell us about your project, reference images, or specific requirements..." className="input-field" />
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
                      <label className="block text-xs tracking-wider uppercase text-tan mb-1">Your Name *</label>
                      <input required type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Full name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-tan mb-1">Company Name</label>
                      <input type="text" value={form.company} onChange={e => update('company', e.target.value)} placeholder="Your company" className="input-field" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-tan mb-1">Email Address *</label>
                      <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@company.com" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-tan mb-1">WhatsApp / Phone</label>
                      <input type="text" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 8900" className="input-field" />
                    </div>
                  </div>
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
