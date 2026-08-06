import { useParams, Link } from 'react-router-dom';

const products = {
  'claw-acetate': {
    name: 'Acetate Hair Claw Clips', image: '/assets/images/product-claw-acetate.webp', category: 'Hair Claws & Clips',
    moq: '100 pcs', leadTime: '12-15 days', material: 'Cellulose Acetate', style: 'Classic / Modern / Luxury',
    sizes: 'Small (6cm) / Medium (8cm) / Large (11cm)', finish: 'Matte / Gloss / Tortoiseshell Pattern',
    logo: 'Laser engraving, gold foil stamping, metal plate', packaging: 'Individual polybag, custom card, gift box',
    description: 'Premium cellulose acetate hair claw clips with spring-loaded mechanism. Available in 20+ custom colors and 3 sizes. Ideal for fashion brands, boutique retailers, and beauty subscription boxes.',
    details: ['Spring-loaded claw mechanism', 'Teeth grip for secure hold', 'Lightweight & durable', 'Custom Pantone color matching', 'Eco-friendly cellulose acetate option'],
  },
  'claw-butterfly': {
    name: 'Butterfly Hair Claw Clips', image: '/assets/images/product-claw-butterfly.webp', category: 'Hair Claws & Clips',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Metal Frame + Resin', style: 'Elegant / Vintage / Bridal',
    sizes: 'Standard (7cm width)', finish: 'Gloss resin wings / Gold-tone frame',
    logo: 'Laser engraving, metal charm tag', packaging: 'Individual polybag, display card, gift box',
    description: 'Decorative butterfly claw clips with gold-tone metal frames and translucent resin wings. Optional pearl, rhinestone, and gold-bead embellishments. A standout for bridal, gift, and boutique collections.',
    details: ['Gold-tone metal frame & spring', 'Translucent resin wings', 'Pearl / rhinestone embellishment options', 'Secure claw grip', 'Custom colors & finishes'],
  },
  'headband-pearl': {
    name: 'Pearl Embellished Headbands', image: '/assets/images/product-headband-pearl.webp', category: 'Headbands',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Metal Frame + Faux Pearl', style: 'Bridal / Evening / Casual Chic',
    sizes: 'Standard (38cm circumference)', finish: 'Gold / Silver / Rose Gold plating',
    logo: 'Engraved logo plate, custom packaging card', packaging: 'Velvet pouch, gift box, display card',
    description: 'Elegant pearl-embellished headbands on a flexible metal frame. Perfect for bridal collections, evening wear brands, and luxury accessory lines.',
    details: ['Flexible metal band', 'Hand-placed faux pearls', 'Comfort-fit design', 'Tarnish-resistant plating', 'Custom pearl size & spacing'],
  },
  'bow-satin': {
    name: 'Satin Hair Bows', image: '/assets/images/product-bow-satin.webp', category: 'Hair Bows & Ribbons',
    moq: '300 pcs', leadTime: '10-14 days', material: 'Premium Satin', style: 'Classic / Oversized / Mini',
    sizes: 'Small (8cm) / Medium (12cm) / Large (18cm)', finish: 'Matte satin / Shiny satin',
    logo: 'Custom printed ribbon, metal charm tag', packaging: 'Display card, polybag, gift box',
    description: 'Luxurious satin hair bows with reinforced stitching. Available on barrette, alligator clip, or elastic band. Popular for children\'s brands, gift sets, and boutique retail.',
    details: ['Double-layer construction', 'Reinforced stitching', 'Multiple backing options', 'Custom ribbon printing', 'Gift-ready packaging'],
  },
  'scrunchie-silk': {
    name: 'Silk Scrunchies', image: '/assets/images/product-scrunchie-silk.webp', category: 'Scrunchies & Hair Ties',
    moq: '200 pcs', leadTime: '10-12 days', material: 'Mulberry Silk', style: 'Classic / Slim / Extra Large',
    sizes: 'Standard (12cm diameter)', finish: 'Matte / Satin sheen',
    logo: 'Woven label, custom printed care tag', packaging: 'Individual card, set box, gift wrap',
    description: '100% mulberry silk scrunchies — gentle on hair, premium feel. OEKO-TEX certified dyes available. The perfect beauty brand accessory.',
    details: ['100% mulberry silk outer', 'Elastic inner', 'No-crease design', 'OEKO-TEX dyes available', 'Custom weight & size'],
  },
  'claw-metal': {
    name: 'Metal Hair Claw Clips', image: '/assets/images/product-claw-metal.webp', category: 'Hair Claws & Clips',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Zinc Alloy', style: 'Classic / Minimal / Luxury',
    sizes: 'Small (6cm) / Medium (8cm) / Large (11cm)', finish: 'Gold / Silver / Rose Gold / Gunmetal plating',
    logo: 'Laser engraving, metal plate, charm tag', packaging: 'Individual polybag, display card, velvet pouch',
    description: 'Durable zinc alloy hair claw clips with electroplated finishes and stainless steel springs. A premium metal option for fashion brands and boutiques that want lasting hold with a metallic look.',
    details: ['Die-cast zinc alloy body', 'Stainless steel spring', 'Tarnish-resistant two-layer plating', 'Custom plating colors', 'Polished, burr-free edges'],
  },
  'claw-plastic': {
    name: 'Plastic Hair Claws', image: '/assets/images/product-claw-plastic.webp', category: 'Hair Claws & Clips',
    moq: '300 pcs', leadTime: '10-14 days', material: 'ABS Plastic', style: 'Everyday / Classic / Minimal',
    sizes: 'Small (6cm) / Medium (8cm) / Large (11cm)', finish: 'Gloss / Matte / Custom Pantone colors',
    logo: 'Pad printing, laser engraving, sticker label', packaging: 'Bulk polybag, display card',
    description: 'Injection-molded ABS plastic hair claws at budget-friendly pricing. A reliable volume option for fast-fashion lines, party supplies, and promotional products.',
    details: ['Injection-molded ABS', 'Lightweight and impact-resistant', 'Wide color range', 'Stainless steel spring option', 'Cost-effective for volume orders'],
  },
  'headband-knotted': {
    name: 'Knotted Fabric Headbands', image: '/assets/images/product-headband-knotted.webp', category: 'Headbands',
    moq: '300 pcs', leadTime: '12-15 days', material: 'Cotton / Silk / Velvet', style: 'Turban / Knotted / Bohemian',
    sizes: 'Standard (38cm circumference)', finish: 'Velvet / Cotton / Silk fabric',
    logo: 'Woven label, custom hang tag', packaging: 'Individual polybag, display card, gift box',
    description: 'Knotted fabric headbands with a hand-tied center detail. Available in plush velvet, breathable cotton, and luxury silk — a bestseller for boho and everyday collections.',
    details: ['Hand-tied knot detail', 'Soft, stretchy base', 'Fabric options: velvet, cotton, silk', 'Comfort-fit for all-day wear', 'Custom colors and knot styles'],
  },
  'headband-padded': {
    name: 'Padded Cushion Headbands', image: '/assets/images/product-headband-padded.webp', category: 'Headbands',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Fabric + Foam', style: 'Classic / Wide / Puff',
    sizes: 'Standard (38cm circumference)', finish: 'Velvet / Satin fabric cover',
    logo: 'Woven label, custom packaging card', packaging: 'Polybag, display card, gift box',
    description: 'Padded cushion headbands with a plush foam core — volume, comfort, and a flattering silhouette. A staple for bridal, beauty, and boutique lines.',
    details: ['Cushioned foam core', 'Plush fabric cover', 'Grip-lined interior', 'Squash-proof structure', 'Custom fabric and padding options'],
  },
  'scrunchie-velvet': {
    name: 'Velvet Scrunchies', image: '/assets/images/product-scrunchie-velvet.webp', category: 'Scrunchies & Hair Ties',
    moq: '300 pcs', leadTime: '10-12 days', material: 'Premium Velvet', style: 'Classic / Ruffled / Bow-top',
    sizes: 'Standard (12cm diameter)', finish: 'Soft velvet pile',
    logo: 'Woven label, custom hang tag', packaging: 'Individual card, set box, gift wrap',
    description: 'Luxurious velvet scrunchies with a soft, matte pile and a gentle hold. Popular for fall/winter collections, gift sets, and premium beauty brands.',
    details: ['Soft velvet outer', 'No-slip elastic inner', 'Reinforced seam', 'Gentle on hair', 'Custom colors and sizes'],
  },
  'scrunchie-cotton': {
    name: 'Cotton Hair Ties', image: '/assets/images/product-scrunchie-cotton.webp', category: 'Scrunchies & Hair Ties',
    moq: '500 pcs', leadTime: '8-10 days', material: 'Organic Cotton', style: 'Classic / Slim / Multi-pack',
    sizes: 'Standard (10cm diameter)', finish: 'Knit cotton / Jersey',
    logo: 'Printed label, custom tag', packaging: 'Multi-pack, display card, bulk pack',
    description: 'Soft organic cotton hair ties for everyday essentials, kids\' lines, and subscription boxes. OEKO-TEX-certified dyes available for EU and US markets.',
    details: ['100% cotton / organic cotton option', 'Gentle on fine hair', 'Wide elastic core', 'OEKO-TEX dyes available', 'Bulk-friendly pricing'],
  },
  'bow-grosgrain': {
    name: 'Grosgrain Ribbon Bows', image: '/assets/images/product-bow-grosgrain.webp', category: 'Hair Bows & Ribbons',
    moq: '300 pcs', leadTime: '10-14 days', material: 'Grosgrain Ribbon', style: 'Classic / Double-layer / Long-tail',
    sizes: 'Small (8cm) / Medium (12cm) / Large (18cm)', finish: 'Ribbed grosgrain texture',
    logo: 'Custom printed ribbon, metal charm tag', packaging: 'Display card, polybag',
    description: 'Structured grosgrain ribbon bows with a crisp, tailored look. Wrinkle-resistant and long-lasting — ideal for school accessories, gift lines, and heritage styling.',
    details: ['Crisp ribbed texture', 'Structured double-layer loops', 'Barrette, clip, or elastic backs', 'Custom ribbon printing', 'Wrinkle-resistant'],
  },
  'bow-clip': {
    name: 'Bow Hair Clips', image: '/assets/images/product-bow-clip.webp', category: 'Hair Bows & Ribbons',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Fabric + Metal Clip', style: 'Classic / Oversized / Mini',
    sizes: 'Small (6cm) / Medium (10cm) / Large (14cm)', finish: 'Satin / Velvet / Grosgrain fabric',
    logo: 'Custom fabric, metal charm tag', packaging: 'Display card, polybag, gift box',
    description: 'Fabric bows mounted on secure metal alligator clips. Quick charm for any outfit — a fast-moving favorite for kids\' brands, boutique retail, and gift sets.',
    details: ['Metal alligator clip back', 'Soft fabric bow', 'Secure grip', 'Multiple fabric options', 'Kid-safe and adult sizes'],
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
            <img src={product.image} alt={product.name} fetchPriority="high" className="w-full h-full object-cover" />
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
