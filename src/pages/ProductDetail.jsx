import { useParams, Link } from 'react-router-dom';

const products = {
  'claw-acetate': {
    name: 'Acetate Hair Claw Clips', image: '/assets/images/product-claw-colorful.jpg', category: 'Hair Claws & Clips',
    moq: '100 pcs', leadTime: '12-15 days', material: 'Cellulose Acetate', style: 'Classic / Modern / Luxury',
    sizes: 'Small (6cm) / Medium (8cm) / Large (11cm)', finish: 'Matte / Gloss / Tortoiseshell Pattern',
    logo: 'Laser engraving, gold foil stamping, metal plate', packaging: 'Individual polybag, custom card, gift box',
    description: 'Premium cellulose acetate hair claw clips with spring-loaded mechanism. Available in 20+ custom colors and 3 sizes. Ideal for fashion brands, boutique retailers, and beauty subscription boxes.',
    details: ['Spring-loaded claw mechanism', 'Teeth grip for secure hold', 'Lightweight & durable', 'Custom Pantone color matching', 'Eco-friendly cellulose acetate option'],
  },
  'headband-pearl': {
    name: 'Pearl Embellished Headbands', image: '/assets/images/product-headband-pearl.jpg', category: 'Headbands',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Metal Frame + Faux Pearl', style: 'Bridal / Evening / Casual Chic',
    sizes: 'Standard (38cm circumference)', finish: 'Gold / Silver / Rose Gold plating',
    logo: 'Engraved logo plate, custom packaging card', packaging: 'Velvet pouch, gift box, display card',
    description: 'Elegant pearl-embellished headbands on a flexible metal frame. Perfect for bridal collections, evening wear brands, and luxury accessory lines.',
    details: ['Flexible metal band', 'Hand-placed faux pearls', 'Comfort-fit design', 'Tarnish-resistant plating', 'Custom pearl size & spacing'],
  },
  'bow-satin': {
    name: 'Satin Hair Bows', image: '/assets/images/product-bow-satin.jpg', category: 'Hair Bows & Ribbons',
    moq: '300 pcs', leadTime: '10-14 days', material: 'Premium Satin', style: 'Classic / Oversized / Mini',
    sizes: 'Small (8cm) / Medium (12cm) / Large (18cm)', finish: 'Matte satin / Shiny satin',
    logo: 'Custom printed ribbon, metal charm tag', packaging: 'Display card, polybag, gift box',
    description: 'Luxurious satin hair bows with reinforced stitching. Available on barrette, alligator clip, or elastic band. Popular for children\'s brands, gift sets, and boutique retail.',
    details: ['Double-layer construction', 'Reinforced stitching', 'Multiple backing options', 'Custom ribbon printing', 'Gift-ready packaging'],
  },
  'scrunchie-silk': {
    name: 'Silk Scrunchies', image: '/assets/images/product-scrunchie-silk.jpg', category: 'Scrunchies & Hair Ties',
    moq: '200 pcs', leadTime: '10-12 days', material: 'Mulberry Silk', style: 'Classic / Slim / Extra Large',
    sizes: 'Standard (12cm diameter)', finish: 'Matte / Satin sheen',
    logo: 'Woven label, custom printed care tag', packaging: 'Individual card, set box, gift wrap',
    description: '100% mulberry silk scrunchies — gentle on hair, premium feel. OEKO-TEX certified dyes available. The perfect beauty brand accessory.',
    details: ['100% mulberry silk outer', 'Elastic inner', 'No-crease design', 'OEKO-TEX dyes available', 'Custom weight & size'],
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = products[id];

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="text-tan">Product not found.</p>
        <Link to="/products" className="text-navy underline mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <Link to="/products" className="text-xs tracking-wider uppercase text-tan hover:text-navy transition-colors inline-flex items-center gap-2 mb-8">
          ← Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="aspect-square overflow-hidden border border-bronze/10">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <p className="text-[10px] tracking-wider uppercase text-tan mb-2">{product.category}</p>
            <h1 className="text-display-md text-navy mb-4">{product.name}</h1>
            <p className="text-tan leading-relaxed mb-8">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-10">
              <span className="badge">MOQ: {product.moq}</span>
              <span className="badge">Lead Time: {product.leadTime}</span>
              <span className="badge">Material: {product.material}</span>
            </div>

            <Link to="/contact" className="btn-primary text-base px-12 py-5">
              Request a Quote for This Product <span className="ml-1">→</span>
            </Link>

            <div className="grid grid-cols-2 gap-6 mt-12 pt-10 border-t border-bronze/10">
              {[
                ['Material', product.material],
                ['Style', product.style],
                ['Sizes', product.sizes],
                ['Finish', product.finish],
                ['Logo Options', product.logo],
                ['Packaging', product.packaging],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] tracking-wider uppercase text-tan mb-1">{label}</p>
                  <p className="text-sm text-navy">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-bronze/10">
          <h2 className="text-display-sm text-navy mb-8">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.details.map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <svg className="w-4 h-4 text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-sm text-bronze/80">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
