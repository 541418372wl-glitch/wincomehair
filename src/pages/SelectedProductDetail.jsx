import { Link } from 'react-router-dom';
import { selectedProducts, selectedProductPath, selectedProductInquiryPath } from '../data/selectedProductStyles';
import { trackProductInquiry } from '../lib/analytics';
import { selectedProductBuyingGuide } from '../data/selectedProductBuyingGuide';

export default function SelectedProductDetail({ product }) {
  const related = selectedProducts.filter(item => item.category === product.category && item.id !== product.id);
  const guide = selectedProductBuyingGuide[product.id];
  const categoryLabel = { scrunchies: 'Scrunchies', headbands: 'Soft Fabric Headbands', 'hair-claw-clips': 'Claw Clips' }[product.category];
  const comparisonLabel = { scrunchies: 'scrunchies', headbands: 'fabric headbands', 'hair-claw-clips': 'claw clips' }[product.category];
  return (
    <div className="container-site selected-product-page">
      <a className="selected-product-back" href={`/products/category/${product.category}#selected-styles`}>← Back to {categoryLabel}</a>
      <div className="selected-product-layout">
        <div className="selected-product-image">
          <img src={product.image} alt={product.alt} width={product.imageWidth} height={product.imageHeight} fetchpriority="high" />
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
            <p>Tell us your preferred colors, size option, quantity and destination. Availability, minimum order and delivery timing are confirmed for your request.</p>
            <Link to={selectedProductInquiryPath(product)} className="btn-primary" onClick={() => void trackProductInquiry({ productId: product.slug, productName: product.title, method: 'quote_form' })}>Request a quote for this product →</Link>
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
      <section className="selected-product-related" aria-labelledby="related-styles-title">
        <h2 id="related-styles-title">Compare other {comparisonLabel}</h2>
        <div>{related.map(item => <Link to={selectedProductPath(item)} key={item.id}>
          <img src={item.image} alt={item.alt} width={item.imageWidth} height={item.imageHeight} loading="lazy" />
          <span>{item.title} →</span>
        </Link>)}</div>
      </section>
      <section className="selected-product-bottom-inquiry" aria-labelledby="product-inquiry-title">
        <p className="section-label">Discuss This Product</p>
        <h2 id="product-inquiry-title">Interested in the {product.title}?</h2>
        <p>Share your preferred options, quantity and destination. We will review availability and order details for this product with you.</p>
        <Link to={selectedProductInquiryPath(product)} className="btn-gold" onClick={() => void trackProductInquiry({ productId: product.slug, productName: product.title, method: 'quote_form' })}>Discuss this product <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
