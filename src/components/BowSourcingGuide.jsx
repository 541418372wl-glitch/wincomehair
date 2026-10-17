import { Link } from 'react-router-dom';

const decisions = [
  {
    title: 'Ribbon & fabric',
    text: 'Compare a smooth satin appearance with a ribbed grosgrain texture. Specify the fiber composition separately: a satin finish does not identify the fiber. Include a color reference and the ribbon width in your brief.',
  },
  {
    title: 'Finished bow dimensions',
    text: 'Record the finished bow width and height, loop arrangement and tail length. Keep these separate from ribbon width and packaging dimensions so different product directions can be compared on the same basis.',
  },
  {
    title: 'Working clip or barrette',
    text: 'State whether the bow is decorative or needs to hold a section of hair. Identify the intended hairstyle, clip-base size and closure type, then ask for front and back views and sample checks for the proposed assembly.',
  },
];

export default function BowSourcingGuide() {
  return (
    <section className="border-b border-bronze/10 bg-white" aria-labelledby="bow-sourcing-title">
      <div className="container-site py-10 md:py-14">
        <p className="section-label">Ribbon Bow Sourcing</p>
        <h2 id="bow-sourcing-title" className="max-w-3xl text-display-md text-navy">Compare Ribbon Bows <span className="text-gold">& Bow Clips</span></h2>
        <p className="mt-5 max-w-3xl leading-relaxed text-tan">For a wholesale selection or a design brief, define the ribbon, bow shape and working base separately. Use the existing product directions below as starting points for comparison.</p>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {decisions.map((decision, index) => (
            <li key={decision.title} className="border border-bronze/10 bg-sand/30 p-6">
              <h3 className="font-display text-lg text-navy"><span className="mr-3 text-gold">0{index + 1}</span>{decision.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-tan">{decision.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-6 border-t border-bronze/10 pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="text-sm font-medium text-navy">Include these details in your inquiry</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-tan">Send the product name or reference, dimensions, preferred material, quantity by color, destination and required delivery date. Confirm availability, order minimums, sample terms and timing for the exact design before ordering.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a href="#bow-product-directions" className="btn-outline justify-center">Compare Product Directions</a>
            <Link to="/contact" className="btn-primary justify-center">Prepare a Bow Inquiry</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
