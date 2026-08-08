import { useParams, Link } from 'react-router-dom';
import { waLink } from '../lib/whatsapp';

const products = {
  'claw-acetate': {
    name: 'Acetate Hair Claw Clips', image: '/assets/images/product-claw-acetate.webp', category: 'Hair Claws & Clips',
    moq: '100 pcs', leadTime: '12-15 days', material: 'Cellulose Acetate', style: 'Classic / Modern / Luxury',
    sizes: 'Small (6cm) / Medium (8cm) / Large (11cm)', finish: 'Matte / Gloss / Tortoiseshell Pattern',
    logo: 'Laser engraving, gold foil stamping, metal plate', packaging: 'Individual polybag, custom card, gift box',
    description: [
      'Cellulose acetate claw clips are cut from plant-based acetate sheets — the same material used in premium eyewear frames — then heated and pressed into shape. The result is a clip that is visibly denser, smoother and more polished than injection-molded plastic, with a depth of color that cheap materials cannot reproduce.',
      'For brands, acetate is the material that sells itself at a $10+ retail price point: it resists cracking and bending for years, feels substantial in the hand, and carries a genuine sustainability story (plant-based and biodegradable under industrial composting). Every clip is fitted with a stainless steel spring tested to 500+ open-close cycles, and all edges are polished to be snag-free.',
      'We produce acetate claw clips in three sizes (6cm / 8cm / 11cm) with 20+ custom Pantone colors and signature tortoiseshell, marble, pearl and translucent effects. MOQ from 100 pcs, production in 12-15 days.',
    ],
    details: ['Plant-based cellulose acetate (premium eyewear-grade)', 'Cut, heated and polished — denser than molded plastic', 'Stainless steel spring, 500+ open-close cycle tested', 'Glossy, burr-free polished edges', 'Tortoiseshell, marble, pearl & translucent patterns', '3 sizes: 6cm / 8cm / 11cm', '20+ custom Pantone colors', 'Lightweight yet durable', 'Biodegradable under industrial composting', 'Matte, gloss or custom finish'],
    applications: ['Beauty & haircare brands', 'Boutique retailers', 'Beauty subscription boxes', 'Bridal & event collections', 'Eco-conscious product lines'],
    customization: ['Custom Pantone color matching', 'Tortoiseshell & marble pattern development', 'Laser engraving, foil stamping or metal plate logos', 'Custom packaging: polybag, display card, gift box', 'Mixed-size and mixed-color order ratios'],
  },
  'claw-metal': {
    name: 'Metal Hair Claw Clips', image: '/assets/images/product-claw-metal.webp', category: 'Hair Claws & Clips',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Zinc Alloy', style: 'Classic / Minimal / Luxury',
    sizes: 'Small (6cm) / Medium (8cm) / Large (11cm)', finish: 'Gold / Silver / Rose Gold / Gunmetal plating',
    logo: 'Laser engraving, metal plate, charm tag', packaging: 'Individual polybag, display card, velvet pouch',
    description: [
      'Metal hair claw clips are die-cast from zinc alloy — the standard metal for hair accessories because it reproduces complex shapes (teeth, cutouts, filigree) at a fraction of the cost of solid-metal machining. Each clip is then electroplated in gold, silver, rose gold or gunmetal.',
      'The plating is half the product: we use a two-layer process (base coat + top coat) so the color does not chip or fade to reveal the base metal, and the finish is tarnish-resistant for daily use. Springs are stainless steel, fatigue-tested to 500+ cycles, and every edge is polished to avoid snagging. Nickel-free plating is available and EU nickel directive compliant.',
      'Available in 6cm / 8cm / 11cm sizes with custom plating colors and logo options. MOQ from 200 pcs, production in 15-18 days.',
    ],
    details: ['Die-cast zinc alloy body — complex shapes at low cost', 'Two-layer electroplating (base + top coat)', 'Finishes: gold, silver, rose gold, gunmetal', 'Stainless steel spring, 500+ cycles tested', 'Tarnish-resistant and moisture-safe', 'Polished, burr-free edges', '3 sizes: 6cm / 8cm / 11cm', 'Nickel-free plating available (EU compliant)', 'Laser engraving, metal plate or charm tag', 'Velvet pouch or display card packaging'],
    applications: ['Fashion jewelry & accessory brands', 'Boutique retail', 'Premium gift lines', 'Bridal and evening wear', 'Durability-focused product lines'],
    customization: ['Custom plating colors & finishes', 'Laser engraving or metal plate logos', 'Charm tag & pendant branding', 'Custom packaging: polybag, card, velvet pouch', 'Mixed-size order ratios'],
  },
  'claw-plastic': {
    name: 'Plastic Hair Claws', image: '/assets/images/product-claw-plastic.webp', category: 'Hair Claws & Clips',
    moq: '300 pcs', leadTime: '10-14 days', material: 'ABS Plastic', style: 'Everyday / Classic / Minimal',
    sizes: 'Small (6cm) / Medium (8cm) / Large (11cm)', finish: 'Gloss / Matte / Custom Pantone colors',
    logo: 'Pad printing, laser engraving, sticker label', packaging: 'Bulk polybag, display card',
    description: [
      'ABS plastic hair claws are the workhorse of the budget segment: fast injection molding keeps costs low, and the material is lightweight, impact-resistant and available in any color. For fast-fashion lines, party supplies and promotional items, ABS delivers the right product at the right price.',
      'Budget pricing does not mean cutting corners on what breaks. We fit stainless steel springs and round the tooth tips so clips do not snag hair — the two failure points that generate the worst reviews on cheap clips. Expect solid everyday performance at a fraction of acetate or metal cost.',
      'Sizes 6cm / 8cm / 11cm in gloss, matte or any Pantone color. MOQ from 300 pcs, production in 10-14 days.',
    ],
    details: ['Injection-molded ABS — fast, low-cost production', 'Gloss or matte finish', 'Any Pantone color', 'Stainless steel spring option', 'Rounded tooth tips, snag-free', 'Lightweight & impact-resistant', '3 sizes: 6cm / 8cm / 11cm', 'Pad printing, laser engraving or sticker logos', 'Bulk-friendly pricing', 'Party, festival & promo ready'],
    applications: ['Fast-fashion & budget lines', 'Party and festival supplies', 'Promotional & branded giveaways', 'Kids\' accessories', 'High-volume retail'],
    customization: ['Custom Pantone colors', 'Pad printing & laser engraving', 'Sticker label branding', 'Bulk polybag or display card', 'Mixed color/size assortments'],
  },
  'claw-butterfly': {
    name: 'Butterfly Hair Claw Clips', image: '/assets/images/product-claw-butterfly.webp', category: 'Hair Claws & Clips',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Metal Frame + Resin', style: 'Elegant / Vintage / Bridal',
    sizes: 'Standard (7cm width)', finish: 'Gloss resin wings / Gold-tone frame',
    logo: 'Laser engraving, metal charm tag', packaging: 'Individual polybag, display card, gift box',
    description: [
      'Butterfly claw clips pair a gold-tone metal frame and spring with translucent resin wings — a statement accessory that photographs beautifully and sells on social channels. The resin carries real depth of color: amber, dusty rose, pearl, cream and tortoiseshell.',
      'Decoration is where these clips become special. Choose pearl, rhinestone or gold-bead embellishments along the wings and body — or keep them clean for an elegant minimal look. The metal frame is one-piece with the claw mechanism, so the clip holds securely without loosening.',
      'Approximately 7cm wide — a true statement size. MOQ from 200 pcs, production in 15-18 days, with custom colors, embellishments and gift-box packaging.',
    ],
    details: ['Gold-tone metal frame & spring mechanism', 'Translucent resin wings with depth of color', 'Pearl, rhinestone & gold-bead embellishment options', 'Secure claw grip for fine to medium hair', 'Hand-finished, no sharp edges', '~7cm width — statement size', 'Amber, pearl, dusty rose, tortoise & more', 'One-piece metal frame and claw', 'Gift-ready presentation', 'Bridal & event collections'],
    applications: ['Bridal and wedding collections', 'Gift sets & boutique retail', 'Social media-driven fashion brands', 'Evening & special occasion wear', 'Kids\' fancy dress'],
    customization: ['Custom wing colors & patterns', 'Pearl / rhinestone / bead placement', 'Laser engraving & charm tags', 'Gift box packaging', 'Mixed color assortments'],
  },
  'headband-pearl': {
    name: 'Pearl Embellished Headbands', image: '/assets/images/product-headband-pearl.webp', category: 'Headbands',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Metal Frame + Faux Pearl', style: 'Bridal / Evening / Casual Chic',
    sizes: 'Standard (38cm circumference)', finish: 'Gold / Silver / Rose Gold plating',
    logo: 'Engraved logo plate, custom packaging card', packaging: 'Velvet pouch, gift box, display card',
    description: [
      'Pearl-embellished headbands combine a flexible metal band with hand-placed faux pearls in gold, silver or rose gold plating. The flexible frame bends to fit each head shape comfortably — no pressure points, no slipping, all-day wear.',
      'Pearls can be arranged in a single row, multi-row, or full-coverage designs with custom size, color and spacing. This is a bridal and evening-wear staple that also moves well in gift sets and luxury accessory lines.',
      'Standard 38cm circumference in gold, silver or rose gold. MOQ from 200 pcs, production in 15-18 days.',
    ],
    details: ['Flexible metal band — adjusts to head shape', 'Hand-placed faux pearls', 'Gold, silver or rose gold plating', 'Tarnish-resistant finish', 'Custom pearl size, color & spacing', 'Single-row, multi-row or full-coverage', 'Standard 38cm circumference', 'Comfort-fit, all-day wear', 'Velvet pouch / gift box packaging', 'Bridal-grade quality'],
    applications: ['Bridal & bridesmaid collections', 'Evening wear brands', 'Luxury accessory lines', 'Photo studio & styling props', 'Gift sets'],
    customization: ['Pearl size, color & spacing', 'Plating color (gold/silver/rose gold)', 'Engraved logo plate', 'Velvet pouch & gift box', 'Custom band width'],
  },
  'headband-knotted': {
    name: 'Knotted Fabric Headbands', image: '/assets/images/product-headband-knotted.webp', category: 'Headbands',
    moq: '300 pcs', leadTime: '12-15 days', material: 'Cotton / Silk / Velvet', style: 'Turban / Knotted / Bohemian',
    sizes: 'Standard (38cm circumference)', finish: 'Velvet / Cotton / Silk fabric',
    logo: 'Woven label, custom hang tag', packaging: 'Individual polybag, display card, gift box',
    description: [
      'Knotted fabric headbands feature a hand-tied center knot on a soft, stretchy base — a boho staple that works as easily with a sundress as with a winter coat. Choose plush velvet for fall/winter depth, breathable cotton for everyday comfort, or silk for a luxury touch.',
      'The stretchy base fits most head sizes without pressure points, and the knot can be styled forward or to the side. Fabric, knot size and color are fully customizable, making this a strong seasonal color-drop product.',
      'Standard 38cm circumference. MOQ from 300 pcs, production in 12-15 days.',
    ],
    details: ['Hand-tied center knot detail', 'Plush velvet, breathable cotton or silk', 'Soft stretchy base — fits most head sizes', 'Comfort-fit, no pressure points', 'Wide color range per fabric', 'Woven label branding', 'Standard 38cm circumference', 'Custom knot styles & sizes', 'Display card / gift box options', 'Seasonal color drops'],
    applications: ['Boho & festival fashion', 'Everyday wear brands', 'Gift sets & boutique retail', 'Seasonal collections (fall/winter)', 'Kids\' lines'],
    customization: ['Fabric type & color', 'Knot style & size', 'Woven label & hang tag', 'Custom packaging', 'Multi-color assortments'],
  },
  'headband-padded': {
    name: 'Padded Cushion Headbands', image: '/assets/images/product-headband-padded.webp', category: 'Headbands',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Fabric + Foam', style: 'Classic / Wide / Puff',
    sizes: 'Standard (38cm circumference)', finish: 'Velvet / Satin fabric cover',
    logo: 'Woven label, custom packaging card', packaging: 'Polybag, display card, gift box',
    description: [
      'Padded cushion headbands are built around a foam core wrapped in plush velvet or satin — the voluminous silhouette that flatters the face and dominates social media styling feeds. The cushion keeps its shape through daily wear, no squashing or drooping.',
      'An anti-slip grip lining keeps the band in place on all hair types, and the deep, rich color palette (burgundy, forest, chocolate, dusty rose) makes these a hero item for fall/winter drops.',
      'Standard 38cm circumference in classic or wide widths. MOQ from 200 pcs, production in 12-15 days.',
    ],
    details: ['Cushioned foam core — voluminous silhouette', 'Plush velvet or satin cover', 'Anti-slip grip lining', 'Squash-proof, keeps shape', 'Wide & classic widths', 'Deep, rich color palette', 'Standard 38cm circumference', 'Woven label branding', 'Display card / gift box', 'Trend-driven bestseller'],
    applications: ['Trend-driven fashion brands', 'Bridal & party styling', 'Boutique retail', 'Social media aesthetics', 'Gift sets'],
    customization: ['Fabric & padding thickness', 'Width & shape', 'Woven label', 'Custom packaging', 'Color assortment'],
  },
  'scrunchie-silk': {
    name: 'Silk Scrunchies', image: '/assets/images/product-scrunchie-silk.webp', category: 'Scrunchies & Hair Ties',
    moq: '200 pcs', leadTime: '10-12 days', material: 'Mulberry Silk', style: 'Classic / Slim / Extra Large',
    sizes: 'Standard (12cm diameter)', finish: 'Matte / Satin sheen',
    logo: 'Woven label, custom printed care tag', packaging: 'Individual card, set box, gift wrap',
    description: [
      'Our silk scrunchies are made from 100% grade 6A mulberry silk — a natural protein fiber so smooth it slides over hair instead of gripping it, which is why silk is the material hair-care communities recommend for breakage prevention and overnight wear.',
      'Silk is also breathable, sleeping cooler than polyester alternatives. Seams are reinforced so the scrunchie survives repeated washing, and the covered elastic never twists inside the casing. This is a $15-25 retail product supported by a real, verifiable material story.',
      'Standard 12cm diameter in classic, slim or extra-large. MOQ from 200 pcs, production in 10-12 days, OEKO-TEX certified dyes available.',
    ],
    details: ['100% mulberry silk (grade 6A)', 'Ultra-smooth — reduces friction & breakage', 'Breathable natural fiber, sleeps cool', 'Reinforced seam — wash-safe', 'Covered elastic, no twisting', 'Standard 12cm diameter', 'Matte & satin sheen options', 'OEKO-TEX certified dyes', 'Woven silk label', 'Premium gift presentation'],
    applications: ['Luxury beauty brands', 'Sleep & silk-care lines', 'Gift sets & subscription boxes', 'Bridal & bridesmaid gifts', 'Premium boutique retail'],
    customization: ['Custom colors & dye matching', 'Slim / classic / XL sizes', 'Woven label & care tag', 'Gift box & wrap', 'Multi-pack sets'],
  },
  'scrunchie-velvet': {
    name: 'Velvet Scrunchies', image: '/assets/images/product-scrunchie-velvet.webp', category: 'Scrunchies & Hair Ties',
    moq: '300 pcs', leadTime: '10-12 days', material: 'Premium Velvet', style: 'Classic / Ruffled / Bow-top',
    sizes: 'Standard (12cm diameter)', finish: 'Soft velvet pile',
    logo: 'Woven label, custom hang tag', packaging: 'Individual card, set box, gift wrap',
    description: [
      'Velvet scrunchies bring a soft, matte plushness that satin cannot match — the texture that makes fall/winter color stories (burgundy, chocolate, dusty rose, sage) look rich and considered. The velvet pile is gentle on hair while the no-slip elastic keeps styles in place.',
      'Available in classic circular, ruffled, and bow-top silhouettes, with reinforced seams that survive washing. A dependable volume item for boutique retail and gift sets at a mid-range price point.',
      'Standard 12cm diameter. MOQ from 300 pcs, production in 10-12 days.',
    ],
    details: ['Soft plush velvet outer', 'No-slip elastic inner', 'Reinforced seam — wash-safe', 'Matte, muted finish', 'Classic, ruffled & bow-top styles', 'Standard 12cm diameter', 'Rich seasonal palette', 'Gentle on hair', 'Display card / set box', 'Bulk-friendly pricing'],
    applications: ['Fall/winter collections', 'Boutique retail', 'Gift sets', 'Kids\' lines', 'Beauty brands'],
    customization: ['Velvet color matching', 'Ruffled or bow-top styles', 'Woven label & hang tag', 'Set boxes & multi-packs', 'Custom sizing'],
  },
  'scrunchie-cotton': {
    name: 'Cotton Hair Ties', image: '/assets/images/product-scrunchie-cotton.webp', category: 'Scrunchies & Hair Ties',
    moq: '500 pcs', leadTime: '8-10 days', material: 'Organic Cotton', style: 'Classic / Slim / Multi-pack',
    sizes: 'Standard (10cm diameter)', finish: 'Knit cotton / Jersey',
    logo: 'Printed label, custom tag', packaging: 'Multi-pack, display card, bulk pack',
    description: [
      'Cotton hair ties are the everyday essential: soft knit cotton wrapped over a wide elastic core that holds without digging into fine or sensitive hair. Kids\' lines and subscription boxes run on these in bulk.',
      'Choose 100% cotton or organic cotton with OEKO-TEX certified dyes — a requirement for EU and US markets that also gives your packaging a verifiable claim. Production is fast (8-10 days) and multi-pack friendly.',
      'Standard 10cm diameter, slim or classic. MOQ from 500 pcs with bulk-friendly pricing.',
    ],
    details: ['100% cotton or organic cotton', 'Soft & gentle on fine hair', 'Wide elastic core — no digging', 'OEKO-TEX certified dyes', 'Knit & jersey options', 'Standard 10cm diameter', 'Multi-pack friendly', 'Custom printed labels', 'Fast 8-10 day production', 'Cost-effective for volume'],
    applications: ['Everyday essentials brands', 'Kids\' & baby lines', 'Subscription boxes', 'Budget-friendly retail', 'Promotional packs'],
    customization: ['Organic cotton option', 'Colors & multi-packs', 'Printed label & tag', 'Bulk packaging', 'Custom size'],
  },
  'bow-satin': {
    name: 'Satin Hair Bows', image: '/assets/images/product-bow-satin.webp', category: 'Hair Bows & Ribbons',
    moq: '300 pcs', leadTime: '10-14 days', material: 'Premium Satin', style: 'Classic / Oversized / Mini',
    sizes: 'Small (8cm) / Medium (12cm) / Large (18cm)', finish: 'Matte satin / Shiny satin',
    logo: 'Custom printed ribbon, metal charm tag', packaging: 'Display card, polybag, gift box',
    description: [
      'Satin hair bows are built with double-layer construction and reinforced stitching — the difference between a bow that flops and a bow that holds its shape on a shelf. High-sheen satin catches light beautifully in product photos and on camera.',
      'Available on barrette, alligator clip, or elastic band backing, in matte or shiny satin. A proven mover for children\'s brands, gift sets and boutique retail across classic, oversized and mini sizes.',
      'Sizes 8cm / 12cm / 18cm. MOQ from 300 pcs, production in 10-14 days.',
    ],
    details: ['Double-layer construction', 'Reinforced stitching — wash-safe', 'Barrette, alligator clip or elastic back', 'High-sheen premium satin', 'Matte & shiny options', 'Sizes: 8cm / 12cm / 18cm', 'Wide color range', 'Custom ribbon printing', 'Gift-ready packaging', 'Kid-safe construction'],
    applications: ['Children\'s brands', 'Gift sets & boutique retail', 'Photo shoots & styling', 'School accessories', 'Party & event lines'],
    customization: ['Fabric color & finish', 'Backing type (clip/elastic/barrette)', 'Printed ribbon & charm tags', 'Display card & gift box', 'Size mix'],
  },
  'bow-grosgrain': {
    name: 'Grosgrain Ribbon Bows', image: '/assets/images/product-bow-grosgrain.webp', category: 'Hair Bows & Ribbons',
    moq: '300 pcs', leadTime: '10-14 days', material: 'Grosgrain Ribbon', style: 'Classic / Double-layer / Long-tail',
    sizes: 'Small (8cm) / Medium (12cm) / Large (18cm)', finish: 'Ribbed grosgrain texture',
    logo: 'Custom printed ribbon, metal charm tag', packaging: 'Display card, polybag',
    description: [
      'Grosgrain ribbon bows have a crisp, ribbed texture that reads as tailored and classic — the look associated with school uniforms, heritage styling and structured gift presentation. The weave is wrinkle-resistant, so the bow keeps its shape in storage and transit.',
      'Double-layer construction gives the loops real body. Available on barrette, clip or elastic backs, with custom printed ribbon and charm tag options for branding.',
      'Sizes 8cm / 12cm / 18cm. MOQ from 300 pcs, production in 10-14 days.',
    ],
    details: ['Crisp ribbed grosgrain texture', 'Structured double-layer loops', 'Wrinkle-resistant & long-lasting', 'Barrette, clip or elastic backs', 'Sizes: 8cm / 12cm / 18cm', 'Rich color palette', 'Custom printed ribbon', 'Metal charm tag option', 'Display card packaging', 'School & heritage styling'],
    applications: ['School & uniform accessories', 'Gift & greeting lines', 'Vintage-style brands', 'Boutique retail', 'Event styling'],
    customization: ['Ribbon color & width', 'Printing on ribbon', 'Charm tags', 'Backing type', 'Packaging'],
  },
  'bow-clip': {
    name: 'Bow Hair Clips', image: '/assets/images/product-bow-clip.webp', category: 'Hair Bows & Ribbons',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Fabric + Metal Clip', style: 'Classic / Oversized / Mini',
    sizes: 'Small (6cm) / Medium (10cm) / Large (14cm)', finish: 'Satin / Velvet / Grosgrain fabric',
    logo: 'Custom fabric, metal charm tag', packaging: 'Display card, polybag, gift box',
    description: [
      'Bow hair clips pair a soft fabric bow with a secure metal alligator clip — instant charm clipped into any outfit. The alligator clip grips firmly without pulling hair, and the fabric is finished so edges never fray.',
      'Choose satin, velvet or grosgrain in any color, from mini sizes for kids to oversized statement bows for adults. This is one of the fastest-moving items in boutique retail and gift sets, with strong repeat-purchase behavior.',
      'Sizes 6cm / 10cm / 14cm in kid-safe and adult versions. MOQ from 200 pcs, production in 12-15 days.',
    ],
    details: ['Metal alligator clip back', 'Soft fabric bow on secure clip', 'Satin, velvet & grosgrain options', 'Secure grip, gentle release', 'Sizes: 6cm / 10cm / 14cm', 'Kid-safe & adult sizes', 'Wide color range', 'Metal charm tag option', 'Display card packaging', 'Fast-moving gift item'],
    applications: ['Kids\' brands & baby lines', 'Boutique retail', 'Gift sets', 'Party & event styling', 'Everyday charm accessories'],
    customization: ['Fabric type & color', 'Clip size & style', 'Charm tags', 'Display card & gift box', 'Mixed styles'],
  },
  'claw-rectangular': {
    name: 'Rectangular Hair Claw Clips', image: '/assets/images/product-claw-rectangular.webp', category: 'Hair Claws & Clips',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Cellulose Acetate / Resin', style: 'Modern / Minimal / Office',
    sizes: 'Medium (7cm) / Large (9cm)', finish: 'Gloss / Matte / Marble patterns',
    logo: 'Laser engraving, foil stamping', packaging: 'Individual polybag, display card, gift box',
    description: [
      'Rectangular claw clips bring a modern, architectural silhouette to the category: an open-frame design with a clean central cutout, made from cellulose acetate or resin in tortoiseshell, pearl, mint and matte black. The angular shape reads instantly contemporary in product photography.',
      'Under the minimal look is the same engineering as our curved clips: a stainless steel spring tested to 500+ cycles, polished edges, and interlocking teeth that hold fine and medium hair securely. This is a fast-growing shape in the trend-driven segment — office-chic and social media styling.',
      'Available in 7cm and 9cm sizes with custom Pantone colors, marble and tortoiseshell patterns. MOQ from 200 pcs, production in 12-15 days.',
    ],
    details: ['Modern open-frame rectangular design', 'Cellulose acetate or resin body', 'Stainless steel spring, 500+ cycles tested', 'Polished, burr-free edges', 'Tortoiseshell, marble, pearl, mint & black', '2 sizes: 7cm / 9cm', 'Secure interlocking teeth', 'Custom Pantone colors', 'Laser engraving / foil stamping logos', 'Display card & gift box packaging'],
    applications: ['Modern & minimalist brands', 'Office-chic styling', 'Social media-driven fashion', 'Boutique retail', 'Gift sets'],
    customization: ['Custom colors & marble patterns', 'Laser engraving or foil stamping', 'Sizing mix (7cm/9cm)', 'Display card & gift box', 'Mixed color assortments'],
  },
  'headband-braided': {
    name: 'Braided Velvet Headbands', image: '/assets/images/product-headband-braided.webp', category: 'Headbands',
    moq: '300 pcs', leadTime: '12-15 days', material: 'Premium Velvet', style: 'Braided / Vintage / Boho',
    sizes: 'Standard (38cm circumference)', finish: 'Braided velvet texture',
    logo: 'Woven label, custom hang tag', packaging: 'Individual polybag, display card, gift box',
    description: [
      'Braided velvet headbands are woven from plush velvet strands into a dimensional three-strand braid — a vintage-inspired texture that catches light differently from every angle. The hand-made look positions them as a step above standard padded styles.',
      'The braid construction adds grip without an extra lining, keeping the band in place while the velvet stays soft against the skin. Rich colors — chocolate, charcoal, burgundy, dusty rose, forest — make these a strong statement piece for fall and winter collections.',
      'Standard 38cm circumference. MOQ from 300 pcs, production in 12-15 days.',
    ],
    details: ['Three-strand braided velvet construction', 'Dimensional texture, light-catching', 'Grip without a separate lining', 'Soft plush velvet, gentle on skin', 'Rich seasonal color palette', 'Standard 38cm circumference', 'Woven label branding', 'Vintage & boho styling', 'Display card / gift box options', 'Hand-made look, premium feel'],
    applications: ['Vintage & boho brands', 'Fall/winter collections', 'Boutique retail', 'Gift sets', 'Editorial & styling work'],
    customization: ['Velvet color matching', 'Braid width & tightness', 'Woven label & hang tag', 'Custom packaging', 'Multi-color assortments'],
  },
  'scrunchie-ruffled': {
    name: 'Ruffled Satin Scrunchies', image: '/assets/images/product-scrunchie-ruffled.webp', category: 'Scrunchies & Hair Ties',
    moq: '300 pcs', leadTime: '10-12 days', material: 'Premium Satin', style: 'Ruffled / Flower / Full',
    sizes: 'Standard (12cm diameter)', finish: 'High-sheen satin',
    logo: 'Woven label, custom hang tag', packaging: 'Individual card, set box, gift wrap',
    description: [
      'Ruffled satin scrunchies stack multiple gathered layers into a full, flower-like silhouette — the volume style that reads beautifully in product photos and on camera. High-sheen satin makes the ruffle layers catch and bounce light.',
      'The layered construction is fully machine-sewn with reinforced seams, so the ruffles hold their shape through washing and repeated wear. The covered elastic stays hidden inside the casing, and the satin surface is gentle on hair.',
      'Standard 12cm diameter in a soft palette of white, blush, champagne, lavender and sage. MOQ from 300 pcs, production in 10-12 days.',
    ],
    details: ['Multi-layer ruffled silhouette', 'High-sheen premium satin', 'Fully machine-sewn, reinforced seams', 'Wash-safe, holds shape', 'Covered elastic, no twisting', 'Standard 12cm diameter', 'Soft pastel & neutral palette', 'Gentle on hair', 'Flower-like volume', 'Gift-ready presentation'],
    applications: ['Gift sets & boutique retail', 'Photo shoots & styling', 'Beauty & haircare brands', 'Bridal party favors', 'Subscription boxes'],
    customization: ['Custom colors & dye matching', 'Ruffle density & fullness', 'Woven label & hang tag', 'Set boxes & multi-packs', 'Custom sizing'],
  },
  'scrunchie-bow': {
    name: 'Satin Bow Scrunchies', image: '/assets/images/product-scrunchie-bow.webp', category: 'Scrunchies & Hair Ties',
    moq: '300 pcs', leadTime: '10-12 days', material: 'Premium Satin', style: 'Bow-top / Classic / Gift-ready',
    sizes: 'Standard (12cm diameter)', finish: 'High-sheen satin with matching bow',
    logo: 'Woven label, custom hang tag', packaging: 'Individual card, set box, gift wrap',
    description: [
      'Satin bow scrunchies pair a full-volume scrunchie with a large matching satin bow — one piece, one fabric, maximum charm. The bow is sewn into the construction, so it keeps its shape and position instead of flopping or rotating.',
      'High-sheen satin catches light beautifully in product photos, and the muted color palette (dusty rose, champagne, sage, lavender, black) makes these a strong gift-set and boutique item. Reinforced seams survive washing; the covered elastic never twists.',
      'Standard 12cm diameter with custom color, bow size and packaging options. MOQ from 300 pcs, production in 10-12 days.',
    ],
    details: ['Integrated matching satin bow', 'High-sheen premium satin', 'Full-volume scrunchie body', 'Bow sewn in place — no rotation', 'Reinforced seams, wash-safe', 'Covered elastic, no twisting', 'Standard 12cm diameter', 'Muted, gift-friendly palette', 'Gentle on hair', 'Gift-ready presentation'],
    applications: ['Gift sets & boutique retail', 'Children\'s brands', 'Party & event styling', 'Bridal party favors', 'Subscription boxes'],
    customization: ['Custom colors & dye matching', 'Bow size & style', 'Woven label & hang tag', 'Set boxes & multi-packs', 'Custom sizing'],
  },
  'bow-multilayer': {
    name: 'Multi-Layer Satin Bow Clips', image: '/assets/images/product-bow-multilayer.webp', category: 'Hair Bows & Ribbons',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Premium Satin', style: 'Puffy / Multi-layer / Classic',
    sizes: 'Small (7cm) / Medium (11cm) / Large (15cm)', finish: 'Stacked satin layers',
    logo: 'Custom printed ribbon, metal charm tag', packaging: 'Display card, polybag, gift box',
    description: [
      'Multi-layer satin bow clips stack several gathered satin layers into a full, puffy silhouette — the volume style that photographs like a wrapped gift. Each layer is sewn and finished separately, so the bow stays crisp and dimensional rather than collapsing flat.',
      'Mounted on a secure metal barrette or alligator clip, in classic, oversized and mini sizes. The palette of cream, champagne, blush, sage, lavender and chocolate makes these a versatile, high-perceived-value item for kids\' lines, gift sets and party styling.',
      'Sizes 7cm / 11cm / 15cm. MOQ from 200 pcs, production in 12-15 days.',
    ],
    details: ['Stacked multi-layer satin construction', 'Full, puffy silhouette', 'Each layer sewn & finished separately', 'Secure barrette or alligator clip back', 'Sizes: 7cm / 11cm / 15cm', 'Classic, oversized & mini', 'Cream, champagne, blush, sage & more', 'Reinforced stitching', 'Metal charm tag option', 'Gift-ready packaging'],
    applications: ['Children\'s brands', 'Gift sets & boutique retail', 'Party & event styling', 'Photo shoots & props', 'Everyday charm accessories'],
    customization: ['Layer count & fullness', 'Fabric color', 'Backing type (barrette/clip)', 'Charm tags', 'Display card & gift box'],
  },
  'clip-pearl': {
    name: 'Pearl Hair Barrettes', image: '/assets/images/product-clip-pearl.webp', category: 'Hair Clips & Barrettes',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Metal + Faux Pearl', style: 'Classic / Bridal / Layered',
    sizes: 'Small (6cm) / Medium (9cm) / Large (12cm)', finish: 'Gold / Silver metal base',
    logo: 'Engraved charm tag, custom card', packaging: 'Individual polybag, velvet pouch, gift box',
    description: [
      'Pearl hair barrettes pair a gold or silver metal base with hand-placed faux pearls in single-row, graduated and cluster arrangements — the classic accessory that never goes out of season. The alligator clip mechanism holds securely without pulling, and the metal frame is tarnish-resistant.',
      'For brands, pearl barrettes earn their retail price. They sit comfortably at $8–18, photograph beautifully for e-commerce, and move strongly in bridal, gifting and everyday elegance segments. Rhinestone accents and mixed-size pearl layouts are available for premium positioning.',
      'Available in 6cm / 9cm / 12cm with gold or silver finish. MOQ from 200 pcs, production in 12-15 days.',
    ],
    details: ['Hand-placed faux pearls', 'Gold or silver metal frame', 'Alligator clip mechanism', 'Tarnish-resistant finish', 'Single-row, graduated & cluster styles', 'Sizes: 6cm / 9cm / 12cm', 'Rhinestone accent option', 'Secure spring clip', 'Velvet pouch packaging option', 'Bridal-grade quality'],
    applications: ['Bridal & bridesmaid collections', 'Gift sets & boutique retail', 'Everyday elegance brands', 'Photo shoots & styling', 'Subscription boxes'],
    customization: ['Pearl size, color & arrangement', 'Metal finish (gold/silver/rose gold)', 'Rhinestone accents', 'Custom engraved charm tag', 'Velvet pouch & gift box'],
  },
  'clip-acetate': {
    name: 'Acetate Hair Barrettes', image: '/assets/images/product-clip-acetate.webp', category: 'Hair Clips & Barrettes',
    moq: '100 pcs', leadTime: '12-15 days', material: 'Cellulose Acetate', style: 'Modern / Minimal / Sculptural',
    sizes: 'Standard (7cm–10cm)', finish: 'Gloss / Marble / Tortoiseshell patterns',
    logo: 'Laser engraving, foil stamping', packaging: 'Individual polybag, display card, gift box',
    description: [
      'Acetate hair barrettes bring sculptural shapes — oval cutouts, wide rectangles, tapered teardrops — in the same cellulose acetate used for premium eyewear. The marble, tortoiseshell and solid-color finishes have depth that photographs as genuine luxury.',
      'This is the barrette format that drives the accessible-luxury hair accessories segment: priced at $10–22 retail, it sells on material story and design geometry rather than embellishment. The French barrette mechanism is easy to use and holds thick and fine hair equally well.',
      'Standard sizes 7–10cm in any Pantone color or signature marble effect. MOQ from 100 pcs, production in 12-15 days.',
    ],
    details: ['Plant-based cellulose acetate', 'Sculptural shapes: oval / rectangle / teardrop', 'French barrette clip mechanism', 'Gloss polished finish', 'Marble, tortoiseshell & solid patterns', 'Standard 7–10cm sizes', 'Custom Pantone colors', 'Lightweight & durable', 'Laser engraving or foil stamping', 'Display card & gift box'],
    applications: ['Modern & minimalist brands', 'Boutique retail', 'Accessible-luxury lines', 'Social media-driven fashion', 'Gift sets'],
    customization: ['Custom colors & marble patterns', 'Shape selection', 'Laser engraving or foil stamping', 'Custom packaging', 'Mixed-style assortments'],
  },
  'clip-matte': {
    name: 'Matte Snap Hair Clips', image: '/assets/images/product-clip-matte.webp', category: 'Hair Clips & Barrettes',
    moq: '300 pcs', leadTime: '8-10 days', material: 'Coated Metal', style: 'Everyday / Minimalist / Multi-pack',
    sizes: 'Small (5cm) / Medium (7cm) / Large (9cm)', finish: 'Matte powder coat / Morandi palette',
    logo: 'Pad printing, custom hang tag', packaging: 'Bulk polybag, multi-pack display card',
    description: [
      'Matte snap clips are the everyday volume seller in hair accessories: a simple hinged metal clip with a soft powder-coat finish in a Morandi-inspired palette — dusty pink, sage green, powder blue, cream, grey, chocolate, taupe. The matte surface does not show fingerprints and feels considered rather than cheap.',
      'The snap mechanism opens and closes one-handed with a satisfying click, holds fine to medium hair securely, and comes in three sizes to cover different styling needs. Multi-pack sets of 6–8 colors are a strong gift and subscription-box play at affordable retail price points.',
      'Sizes 5cm / 7cm / 9cm in Morandi palette or any custom color. MOQ from 300 pcs, production in 8-10 days.',
    ],
    details: ['Hinged metal snap mechanism', 'Soft matte powder coat', 'Morandi color palette', 'No fingerprint surface', 'One-handed snap open & close', 'Sizes: 5cm / 7cm / 9cm', 'Multi-pack set option', 'Custom colors', 'Pad printing logo', 'Fast 8-10 day production'],
    applications: ['Everyday essentials brands', 'Gift sets & multi-packs', 'Subscription boxes', 'Kids\' & teen brands', 'High-volume retail'],
    customization: ['Custom Morandi colors', 'Size mix (5cm/7cm/9cm)', 'Multi-pack set design', 'Printed hang tag', 'Bulk packaging'],
  },
  'clip-crystal': {
    name: 'Crystal Rhinestone Barrettes', image: '/assets/images/product-clip-crystal.webp', category: 'Hair Clips & Barrettes',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Metal + Crystal', style: 'Bridal / Evening / Luxury',
    sizes: 'Medium (8cm) / Large (11cm)', finish: 'Gold-tone frame with crystal pave',
    logo: 'Laser engraving, custom gift card', packaging: 'Velvet pouch, gift box, display card',
    description: [
      'Crystal rhinestone barrettes are designed for the bridal and eveningwear market: a gold-tone metal frame fully paved or bordered with AAA-grade cubic zirconia, marquise crystals or mixed-cut stones. The effect reads as fine jewelry at a fraction of the cost.',
      'Available in full-pave rectangle, floral cluster, and mixed-stone linear formats. The French barrette mechanism is concealed beneath the crystal setting, keeping the front view completely clean. Champagne, clear and rose crystal options suit the full bridal color spectrum.',
      'Sizes 8cm and 11cm with gold or silver frame. MOQ from 200 pcs, production in 15-18 days.',
    ],
    details: ['AAA cubic zirconia / mixed crystal stones', 'Gold or silver tone metal frame', 'Full-pave & floral cluster options', 'Concealed French barrette mechanism', 'Champagne, clear & rose crystal', 'Sizes: 8cm / 11cm', 'Secure spring mechanism', 'No-snag setting', 'Gift-box ready', 'Bridal & luxury event styling'],
    applications: ['Bridal & wedding collections', 'Evening wear brands', 'Luxury accessory lines', 'Gift sets & boutique retail', 'Photo shoots & editorial'],
    customization: ['Crystal color & cut selection', 'Frame finish (gold/silver)', 'Layout (pave/floral/linear)', 'Velvet pouch & gift box', 'Custom engraved detail'],
  },
  'clip-flower': {
    name: 'Flower Hair Clips', image: '/assets/images/product-clip-flower.webp', category: 'Hair Clips & Barrettes',
    moq: '200 pcs', leadTime: '15-18 days', material: 'Metal + Crystal', style: 'Floral / Bridal / Everyday',
    sizes: 'Small (5cm) / Medium (7cm) / Large (9cm)', finish: 'Gold-tone frame with crystal petals',
    logo: 'Laser engraving, custom gift card', packaging: 'Individual polybag, velvet pouch, gift box',
    description: [
      'Flower hair clips shape a gold-tone metal frame into open floral petals, each petal outlined or filled with clear crystal. The silhouette reads delicate and feminine — a bestselling bridal and everyday accent that photographs beautifully.',
      'Unlike flat barrettes, the flower form sits on top of the hair like a small piece of jewelry, catching light from every angle. The spring-loaded clip base holds fine to medium hair securely, and the setting is snag-free against strands.',
      'Available in 5cm / 7cm / 9cm flower sizes with gold or silver frames and custom crystal colors. MOQ from 200 pcs, production in 15-18 days.',
    ],
    details: ['Open floral petal design', 'Gold or silver tone metal frame', 'Crystal-outlined petals', 'Spring-loaded clip base', 'Sits on top of hair like jewelry', 'Snag-free setting', 'Sizes: 5cm / 7cm / 9cm', 'Clear, champagne & rose crystal', 'Gift-box ready', 'Bridal & everyday styling'],
    applications: ['Bridal & wedding collections', 'Everyday feminine styling', 'Gift sets & boutique retail', 'Photo shoots & editorial', 'Seasonal floral themes'],
    customization: ['Flower size & petal layout', 'Crystal color & cut', 'Frame finish (gold/silver)', 'Velvet pouch & gift box', 'Custom engraved detail'],
  },
  'headband-satin': {
    name: 'Satin Headbands', image: '/assets/images/product-headband-satin.webp', category: 'Headbands',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Premium Satin', style: 'Classic / Padded / Slim',
    sizes: 'Standard (38cm circumference)', finish: 'High-sheen satin cover',
    logo: 'Woven label, custom hang tag', packaging: 'Individual polybag, display card, gift box',
    description: [
      'Satin headbands wrap a soft core in high-sheen premium satin — the smooth, glossy alternative to velvet that photographs with a clean, light-catching finish. The satin surface slides over hair without friction, making these a hair-friendlier choice for daily wear.',
      'Available in classic slim and padded cushion silhouettes, with a soft grip lining inside to keep the band in place. The satin finish works year-round, from summer styling to holiday party looks, in a palette of blush, champagne, ivory, sage and black.',
      'Standard 38cm circumference. MOQ from 200 pcs, production in 12-15 days.',
    ],
    details: ['High-sheen premium satin cover', 'Soft padded or slim core', 'Smooth surface, friction-free', 'Anti-slip grip lining', 'Classic & padded silhouettes', 'Standard 38cm circumference', 'Blush, champagne, ivory, sage & black', 'Woven label branding', 'Year-round styling', 'Gift-ready packaging'],
    applications: ['Everyday wear brands', 'Bridal & party styling', 'Boutique retail', 'Gift sets', 'Seasonal collections'],
    customization: ['Satin color matching', 'Padded or slim silhouette', 'Woven label & hang tag', 'Custom packaging', 'Multi-color assortments'],
  },
  'bow-oversized': {
    name: 'Oversized Hair Bows', image: '/assets/images/product-bow-oversized.webp', category: 'Bows & Ribbons',
    moq: '200 pcs', leadTime: '12-15 days', material: 'Premium Satin', style: 'Oversized / Statement / Classic',
    sizes: 'Medium (14cm) / Large (18cm) / XL (22cm)', finish: 'High-sheen satin',
    logo: 'Custom printed ribbon, metal charm tag', packaging: 'Display card, polybag, gift box',
    description: [
      'Oversized hair bows are the statement piece of the hair accessories trend cycle: wide, high-sheen satin loops in 14cm, 18cm and 22cm widths that read as a bold style choice — the silhouette driving social media styling and runway-adjacent fashion.',
      'Each bow is constructed with double-layer loops and reinforced stitching so the wide shape holds its form in storage and transit. Mounted on a sturdy alligator clip or elastic band, it stays put on thick hair and fine hair alike.',
      'Sizes 14cm / 18cm / 22cm in custom colors. MOQ from 200 pcs, production in 12-15 days.',
    ],
    details: ['Wide high-sheen satin loops', '14cm / 18cm / 22cm statement sizes', 'Double-layer construction', 'Reinforced stitching, shape-holding', 'Alligator clip or elastic back', 'Holds on thick & fine hair', 'Custom color matching', 'Custom printed ribbon', 'Metal charm tag option', 'Social media-ready styling'],
    applications: ['Trend-driven fashion brands', 'Social media styling', 'Gift sets & boutique retail', 'Photo shoots & editorial', 'Party & event lines'],
    customization: ['Satin color matching', 'Size (14cm/18cm/22cm)', 'Backing type (clip/elastic)', 'Printed ribbon & charm tags', 'Display card & gift box'],
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
            <h1 className="text-display-md text-navy mb-6">{product.name}</h1>
            {product.description.map((p, i) => (
              <p key={i} className={(i === 0 ? 'text-bronze font-medium ' : 'text-tan ') + 'leading-relaxed mb-4'}>{p}</p>
            ))}

            <div className="flex flex-wrap gap-2 mb-10">
              <span className="badge">MOQ: {product.moq}</span>
              <span className="badge">Lead Time: {product.leadTime}</span>
              <span className="badge">Material: {product.material}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <a
                href={waLink(`Hello WINCOME, I just viewed your ${product.name} and would like to discuss a project. Can we chat?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-base px-10 py-5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Discuss on WhatsApp <span className="ml-1">→</span>
              </a>
              <Link to="/contact" className="btn-outline text-base px-10 py-5">
                Request Quote via Form
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12 p-8 bg-sand/25">
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
          <h2 className="text-display-sm text-navy mb-8">Product <span className="text-gold">Details</span></h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-2 p-8 bg-sand/25">
            {product.details.map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <svg className="w-4 h-4 text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-sm text-bronze/80">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-bronze/10">
          <h2 className="text-display-sm text-navy mb-8">Perfect <span className="text-gold">For</span></h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-2 p-8 bg-sand/25">
            {product.applications.map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <svg className="w-4 h-4 text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-sm text-bronze/80">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-bronze/10">
          <h2 className="text-display-sm text-navy mb-8">Customization <span className="text-gold">Options</span></h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-2 p-8 bg-sand/25">
            {product.customization.map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <svg className="w-4 h-4 text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-sm text-bronze/80">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-navy text-white p-10 md:p-14 text-center">
          <p className="section-label !text-champagne">Start Your Project</p>
          <h2 className="text-display-md mb-4">Ready to Talk to a <span className="text-champagne italic font-light">Factory Directly?</span></h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Free design mockup and factory-direct quote within 24 hours. MOQ from 100 pcs, samples in 5–7 days.
          </p>
          <Link to="/contact" className="btn-gold">
            Request a Free Quote <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
