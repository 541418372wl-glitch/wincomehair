import { Link } from 'react-router-dom';

const orderFacts = [
  { label: 'Quote response', value: 'Within 24 hours', note: 'Based on a complete product brief' },
  { label: 'Physical sample', value: '5–7 business days', note: 'Before bulk production' },
  { label: 'Bulk production', value: '8–18 days', note: 'After final sample approval' },
  { label: 'Starting MOQ', value: 'From 100 pcs', note: 'For selected acetate designs' },
];

const moqRows = [
  ['Cellulose acetate clips & claws', 'From 100 pcs', 'Cut-and-polish production; selected existing designs support lower entry quantities'],
  ['Metal, resin & decorated clips', 'Usually 200 pcs', 'Plating, assembly and decorative placement affect setup'],
  ['ABS plastic claw clips', 'Usually 300 pcs', 'Injection molding and color setup favor larger runs'],
  ['Headbands', 'Usually 200–300 pcs', 'Fabric, padding, decoration and construction determine the minimum'],
  ['Silk scrunchies', 'From 200 pcs', 'Fabric grade, size, stitching and labels affect the quotation'],
  ['Other fabric scrunchies', 'Usually 300–500 pcs', 'Material, fullness, color split and packaging affect the minimum'],
  ['Hair bows', 'Usually 200–300 pcs', 'Ribbon, layering, clip hardware and branding affect setup'],
];

const steps = [
  { number: '01', title: 'Send a production brief', text: 'Share the product type, target quantity, dimensions, materials, colors, logo, packaging, target market and required delivery date.' },
  { number: '02', title: 'Review options and quotation', text: 'We compare suitable constructions, confirm the MOQ, identify tooling or packaging costs and provide a factory-direct quotation.' },
  { number: '03', title: 'Approve the physical sample', text: 'A pre-production sample is made for fit, color, finish, branding and packaging approval before bulk work begins.' },
  { number: '04', title: 'Produce and inspect', text: 'Bulk production follows the approved sample. Incoming materials, in-process work and final units pass the defined QC stages.' },
  { number: '05', title: 'Pay balance and ship', text: 'After final inspection, the balance is completed and the order is dispatched by express, air or sea according to the agreed plan.' },
];

const quoteInputs = [
  ['Product', 'Category, reference image or catalog link, intended use and target customer'],
  ['Specification', 'Material, dimensions, color, finish, closure, decoration and performance requirements'],
  ['Branding', 'Logo method, label, printed insert, barcode and artwork files'],
  ['Packaging', 'Card, pouch, box, set configuration, retail display and shipping protection'],
  ['Commercial', 'Quantity by style and color, target price, target market and requested delivery date'],
  ['Compliance', 'Required testing, certificates, labeling and destination-market requirements'],
];

const shippingOptions = [
  { title: 'Express courier', time: 'Typically 3–5 days', fit: 'Samples and smaller urgent shipments via DHL, FedEx or UPS.' },
  { title: 'Air freight', time: 'Quoted by shipment', fit: 'Time-sensitive bulk orders that are too large for normal courier service.' },
  { title: 'Sea freight', time: 'Typically 18–25 days', fit: 'Larger orders where freight efficiency is more important than speed.' },
  { title: 'Amazon FBA', time: 'Route-specific', fit: 'Direct delivery supported when carton, label and appointment requirements are confirmed.' },
];

const faqs = [
  { q: 'Can I place a trial order below the standard MOQ?', a: 'Smaller paid trial quantities can be discussed for new partnerships. Feasibility and unit price depend on the style, available materials and level of customization.' },
  { q: 'What are the standard payment terms?', a: 'Standard terms are 30% deposit to begin production and 70% balance before shipment. T/T, PayPal and Alibaba Trade Assurance are supported. Qualified long-term clients may discuss credit terms after three successful orders.' },
  { q: 'When does the production lead time begin?', a: 'The quoted bulk-production period begins after the final physical sample and production details are approved and the required deposit is received.' },
  { q: 'Can colors be mixed within one order?', a: 'Color splits are often possible, but the minimum may apply by style or color depending on the material and process. The quotation will state the approved split clearly.' },
  { q: 'Which documents are supplied for shipping?', a: 'Commercial invoices, packing lists and the agreed export or compliance documents are provided. Requirements should be confirmed before sampling so they can be included in the production plan.' },
];

export default function Sourcing() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Hair Accessories MOQ, Sampling & Production Guide',
        url: 'https://wincomehair.com/sourcing',
        description: 'WINCOME buyer guide covering custom hair accessories MOQ, samples, production, payment, quality checks and international shipping.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="container-site pb-14 pt-12 md:pb-20 md:pt-20">
        <p className="section-label">B2B Order Process</p>
        <h1 className="max-w-4xl text-display-lg leading-tight text-navy">Hair Accessories MOQ, Sampling & Production Guide</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-tan">
          Plan a custom or private-label order with clear minimum quantities, sample timing, production milestones, payment terms and shipping options before committing to bulk production.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary justify-center">Request a Factory Quote</Link>
          <Link to="/products" className="btn-outline justify-center">Browse Wholesale Products</Link>
        </div>
      </section>

      <section className="container-site pb-16 md:pb-24" aria-label="Order timing summary">
        <div className="grid grid-cols-2 border border-bronze/10 bg-white md:grid-cols-4">
          {orderFacts.map((fact, index) => (
            <div key={fact.label} className={`p-5 md:p-6 ${index < orderFacts.length - 1 ? 'md:border-r md:border-bronze/10' : ''} ${index < 2 ? 'border-b border-bronze/10 md:border-b-0' : ''} ${index % 2 === 0 ? 'border-r border-bronze/10 md:border-r' : ''}`}>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-tan">{fact.label}</p>
              <p className="mt-2 font-display text-xl text-navy">{fact.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-tan">{fact.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-bronze/10 bg-white">
        <div className="container-site section-gap">
          <p className="section-label">Minimum Order Quantities</p>
          <h2 className="max-w-3xl text-display-md text-navy">Typical MOQ by Product Type</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-tan">
            MOQ is quoted per project because materials, color splits, molds, decoration and packaging change the production setup. These starting points help buyers prepare a realistic brief.
          </p>
          <div className="mt-8 overflow-x-auto border border-bronze/10">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-sand/50 text-xs uppercase tracking-wider text-tan">
                <tr>
                  <th className="p-4 font-medium">Product type</th>
                  <th className="p-4 font-medium">Typical MOQ</th>
                  <th className="p-4 font-medium">Main production consideration</th>
                </tr>
              </thead>
              <tbody>
                {moqRows.map((row) => (
                  <tr key={row[0]} className="border-t border-bronze/10 text-sm">
                    <th scope="row" className="p-4 font-medium text-navy">{row[0]}</th>
                    <td className="p-4 text-navy">{row[1]}</td>
                    <td className="p-4 leading-relaxed text-tan">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-tan">
            For a deeper explanation of tooling, materials and color splits, read the <Link to="/blog/hair-accessories-moq-guide" className="font-medium text-navy underline underline-offset-4 hover:text-gold">hair accessories MOQ guide</Link>.
          </p>
        </div>
      </section>

      <section className="container-site section-gap">
        <p className="section-label">From Brief to Shipment</p>
        <h2 className="text-display-md text-navy">How a Custom Order Moves Through Production</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-5">
          {steps.map((step) => (
            <article key={step.number} className="border border-bronze/10 bg-sand/30 p-6">
              <p className="font-display text-3xl text-gold/50">{step.number}</p>
              <h3 className="mt-4 font-display text-lg text-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-tan">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-5 text-sm">
          <Link to="/customization" className="font-medium text-navy underline underline-offset-4 hover:text-gold">Explore customization options</Link>
          <Link to="/quality" className="font-medium text-navy underline underline-offset-4 hover:text-gold">Review quality-control stages</Link>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="container-site section-gap">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="section-label !text-champagne">Quote Checklist</p>
              <h2 className="text-display-md">What to Include in Your Inquiry</h2>
              <p className="mt-5 leading-relaxed text-white/60">
                Complete specifications reduce follow-up questions, make quotations easier to compare and give the sampling team a clear approval target.
              </p>
            </div>
            <div className="border border-white/10">
              {quoteInputs.map(([label, detail], index) => (
                <div key={label} className={`grid gap-2 p-5 sm:grid-cols-[0.25fr_0.75fr] sm:gap-6 ${index < quoteInputs.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <h3 className="text-sm font-medium text-white">{label}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-site section-gap">
        <p className="section-label">Payment & Logistics</p>
        <h2 className="text-display-md text-navy">Plan the Commercial Terms Before Production</h2>
        <p className="mt-5 max-w-3xl leading-relaxed text-tan">
          Standard payment terms are 30% deposit and 70% balance before shipment. T/T, PayPal and Alibaba Trade Assurance are supported. Long-term clients may discuss net-30 terms after three successful orders.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {shippingOptions.map((option) => (
            <article key={option.title} className="border border-bronze/10 bg-white p-6">
              <h3 className="font-display text-lg text-navy">{option.title}</h3>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gold">{option.time}</p>
              <p className="mt-3 text-sm leading-relaxed text-tan">{option.fit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-bronze/10 bg-sand/35">
        <div className="container-site section-gap">
          <p className="section-label">Ordering FAQ</p>
          <h2 className="mb-8 text-display-md text-navy">Questions Before a First Order</h2>
          <div className="max-w-3xl space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group border border-bronze/10 bg-white open:border-bronze/25">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                  <span className="text-sm font-medium text-navy">{item.q}</span>
                  <span aria-hidden="true" className="shrink-0 text-lg leading-none text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-6 text-sm leading-relaxed text-tan">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site section-gap text-center">
        <div className="mx-auto max-w-2xl">
          <p className="section-label">Ready to Start?</p>
          <h2 className="text-display-md text-navy">Turn Your Product Brief Into a Quotation</h2>
          <p className="mt-5 text-lg leading-relaxed text-tan">Send the product, quantity, materials, branding and delivery target. Our team will respond with the recommended production route.</p>
          <Link to="/contact" className="btn-primary mt-8 px-10 py-4">Request a Quote <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
