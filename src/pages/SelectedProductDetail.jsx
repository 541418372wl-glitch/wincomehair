import { Link } from 'react-router-dom';
import { selectedProductInquiryPath } from '../data/selectedProductStyles';
import { trackProductInquiry } from '../lib/analytics';
import { selectedProductBuyingGuide } from '../data/selectedProductBuyingGuide';
import RelatedProducts from '../components/RelatedProducts';
import OptimizedProductImage from '../components/OptimizedProductImage';
import { productQuoteWhatsAppUrl } from '../lib/whatsapp';

export default function SelectedProductDetail({ product }) {
  const guide = selectedProductBuyingGuide[product.id];
  const categoryLabel = { scrunchies: 'Scrunchies', headbands: 'Soft Fabric Headbands', 'hair-claw-clips': 'Claw Clips', 'hair-bows': 'Hair Bows' }[product.category];
  return (
    <div className="container-site selected-product-page">
      <a className="selected-product-back" href={`/products/category/${product.category}#selected-styles`}>← Back to {categoryLabel}</a>
      <div className="selected-product-layout">
        <div className="selected-product-image">
          <OptimizedProductImage image={product.image} alt={product.alt}
            width={product.imageWidth} height={product.imageHeight} priority />
        </div>
        <div className="selected-style-detail-copy selected-product-copy">
          <p className="selected-style-label">{product.tag}</p>
          <h1>{product.title}</h1>
          <p>{product.intro}</p>
          <p>{product.details}</p>
          <h2>Product specifications</h2>
          <dl className="selected-style-facts">
            {[...product.facts, ...(product.extra || [])].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          {product.table ? <table>
            <caption>Size options</caption>
            <thead><tr>{product.table.heads.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
            <tbody>{product.table.rows.map(row => <tr key={row[0]}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
          </table> : null}
          {product.care ? <><h2>Care instructions</h2><p>{product.care}</p></> : null}
          {product.note ? <p className="selected-style-note">{product.note}</p> : null}
          <div className="selected-product-inquiry">
            <h2>Ask about this product</h2>
            <p>{product.inquiryNote || (product.moq ? `Production MOQ: ${product.moq}. Samples and in-stock items can be discussed separately. Tell us your preferred colors, size option, quantity and destination so availability and delivery timing can be confirmed.` : 'Tell us your preferred colors, size option, quantity and destination. Availability, minimum order and delivery timing are confirmed for your request.')}</p>
            <ul className="mt-3 mb-5 list-disc pl-5 space-y-1 text-sm text-bronze">
              <li>Tiered EXW/FOB unit prices and minimums for your color breakdown.</li>
              <li>Physical sampling takes about 15 days. We quote logos and packaging against your brief.</li>
              <li>We confirm carton packing and the bulk schedule in writing before you order.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link to={`${selectedProductInquiryPath(product)}#stock-inquiry`} className="btn-primary" onClick={() => void trackProductInquiry({ productId: product.slug, productName: product.title, method: 'quote_form' })}>Request a quote for this product →</Link>
              <a href={productQuoteWhatsAppUrl(product.title, product.slug)} target="_blank" rel="noopener noreferrer"
                data-analytics-location="selected_pdp_inquiry" data-product-name={product.title} className="btn-outline">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      <section className="selected-product-guidance" aria-labelledby="selection-guide-title">
        <p className="section-label">Choosing Your Style</p>
        <h2 id="selection-guide-title">Selection notes</h2>
        <ul>{guide.advice.map(note => <li key={note}>{note}</li>)}</ul>
      </section>
      <section className="selected-product-faq" aria-labelledby="product-faq-title">
        <p className="section-label">Buyer Information</p>
        <h2 id="product-faq-title">Product sourcing FAQ</h2>
        <div className="selected-product-faq-grid">
          {guide.faq.map(item => <article key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>)}
        </div>
      </section>
      <RelatedProducts productId={product.slug} category={product.category} />
      <section className="selected-product-bottom-inquiry" aria-labelledby="product-inquiry-title">
        <p className="section-label">Discuss This Product</p>
        <h2 id="product-inquiry-title">Interested in the {product.title}?</h2>
        <p>Share your preferred options, quantity and destination. We will review availability and order details for this product with you.</p>
        <Link to={`${selectedProductInquiryPath(product)}#stock-inquiry`} className="btn-gold" onClick={() => void trackProductInquiry({ productId: product.slug, productName: product.title, method: 'quote_form' })}>Discuss this product <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
