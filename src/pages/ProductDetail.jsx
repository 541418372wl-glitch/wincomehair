import { useParams, Link } from 'react-router-dom';

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
              <p key={i} className="text-tan leading-relaxed mb-4">{p}</p>
            ))}

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
          <h2 className="text-display-sm text-navy mb-8">Product <span className="text-gold">Details</span></h2>
          <div className="grid md:grid-cols-2 gap-4">
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
          <div className="grid md:grid-cols-2 gap-4">
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
          <div className="grid md:grid-cols-2 gap-4">
            {product.customization.map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <svg className="w-4 h-4 text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-sm text-bronze/80">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-navy text-white p-10 md:p-14 text-center">
          <p className="section-label !text-gold">Start Your Project</p>
          <h2 className="text-display-md mb-4">Ready to Talk to a <span className="text-gold">Factory Directly?</span></h2>
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
