import { Link } from 'react-router-dom';

const allProducts = [
  { id: 'claw-acetate', name: 'Acetate Hair Claw Clips', category: 'Claws & Clips', image: '/assets/images/product-claw-acetate.webp', moq: '100 pcs', leadTime: '12-15 days', material: 'Cellulose Acetate', colors: 'Custom Pantone' },
  { id: 'claw-metal', name: 'Metal Hair Claw Clips', category: 'Claws & Clips', image: '/assets/images/product-claw-metal.webp', moq: '200 pcs', leadTime: '15-18 days', material: 'Zinc Alloy', colors: 'Gold / Silver / Rose Gold' },
  { id: 'claw-plastic', name: 'Plastic Hair Claws', category: 'Claws & Clips', image: '/assets/images/product-claw-plastic.webp', moq: '300 pcs', leadTime: '10-14 days', material: 'ABS Plastic', colors: 'Custom Colors' },
  { id: 'claw-butterfly', name: 'Butterfly Hair Claw Clips', category: 'Claws & Clips', image: '/assets/images/product-claw-butterfly.webp', moq: '200 pcs', leadTime: '15-18 days', material: 'Metal Frame + Resin', colors: 'Amber / Pearl / Rose / Tortoise' },
  { id: 'headband-pearl', name: 'Pearl Embellished Headbands', category: 'Headbands', image: '/assets/images/product-headband-pearl.webp', moq: '200 pcs', leadTime: '15-18 days', material: 'Metal + Faux Pearl', colors: 'Gold / Silver' },
  { id: 'headband-knotted', name: 'Knotted Fabric Headbands', category: 'Headbands', image: '/assets/images/product-headband-knotted.webp', moq: '300 pcs', leadTime: '12-15 days', material: 'Cotton / Silk / Velvet', colors: 'Custom Colors' },
  { id: 'headband-padded', name: 'Padded Cushion Headbands', category: 'Headbands', image: '/assets/images/product-headband-padded.webp', moq: '200 pcs', leadTime: '12-15 days', material: 'Fabric + Foam', colors: 'Custom Colors' },
  { id: 'scrunchie-silk', name: 'Silk Scrunchies', category: 'Scrunchies', image: '/assets/images/product-scrunchie-silk.webp', moq: '200 pcs', leadTime: '10-12 days', material: 'Mulberry Silk', colors: 'Custom Colors' },
  { id: 'scrunchie-velvet', name: 'Velvet Scrunchies', category: 'Scrunchies', image: '/assets/images/product-scrunchie-velvet.webp', moq: '300 pcs', leadTime: '10-12 days', material: 'Premium Velvet', colors: 'Custom Colors' },
  { id: 'scrunchie-cotton', name: 'Cotton Hair Ties', category: 'Scrunchies', image: '/assets/images/product-scrunchie-cotton.webp', moq: '500 pcs', leadTime: '8-10 days', material: 'Organic Cotton', colors: 'Custom Colors' },
  { id: 'bow-satin', name: 'Satin Hair Bows', category: 'Bows & Ribbons', image: '/assets/images/product-bow-satin.webp', moq: '300 pcs', leadTime: '10-14 days', material: 'Premium Satin', colors: 'Custom Colors' },
  { id: 'bow-grosgrain', name: 'Grosgrain Ribbon Bows', category: 'Bows & Ribbons', image: '/assets/images/product-bow-grosgrain.webp', moq: '300 pcs', leadTime: '10-14 days', material: 'Grosgrain Ribbon', colors: 'Custom Colors' },
  { id: 'bow-clip', name: 'Bow Hair Clips', category: 'Bows & Ribbons', image: '/assets/images/product-bow-clip.webp', moq: '200 pcs', leadTime: '12-15 days', material: 'Fabric + Metal Clip', colors: 'Custom Colors' },
];

const categories = ['All', 'Claws & Clips', 'Headbands', 'Scrunchies', 'Bows & Ribbons'];

export default function Products() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap">
        <p className="section-label">Product Catalog</p>
        <h1 className="text-display-lg text-navy mb-4">Full <span className="text-gold">Collection</span></h1>
        <p className="text-tan text-lg max-w-2xl mb-12 leading-relaxed">
          Every product is fully customizable — size, color, material, finish, logo, and packaging. Click any item to request a quote.
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat} className="px-5 py-2 text-xs font-medium tracking-wider uppercase border border-bronze/20 text-tan hover:border-navy hover:text-navy transition-colors duration-200">
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map(product => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="group bg-white overflow-hidden border border-bronze/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="text-[10px] tracking-wider uppercase text-tan mb-2">{product.category}</p>
                <h3 className="text-base font-display text-navy mb-3 group-hover:text-gold transition-colors">{product.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] tracking-wider uppercase bg-sand/60 text-tan px-2 py-1">MOQ: {product.moq}</span>
                  <span className="text-[10px] tracking-wider uppercase bg-sand/60 text-tan px-2 py-1">{product.leadTime}</span>
                </div>
                <span className="text-xs font-medium tracking-wider uppercase text-navy group-hover:text-gold transition-colors inline-flex items-center gap-1">
                  View Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
