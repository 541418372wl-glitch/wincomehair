import { Link } from 'react-router-dom';
import { selectedProductStyles, selectedProductPath } from '../data/selectedProductStyles';

function StyleFacts({ rows }) {
  return (
    <dl className="selected-style-facts">
      {rows.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  );
}

function SelectedStyleCard({ product, number }) {
  return (
    <article id={`selection-${product.id}`} className="selected-style-card">
      <Link to={selectedProductPath(product)} className="selected-style-photo" aria-label={`View ${product.title}`}>
        <img src={product.image} alt={product.alt} width={product.imageWidth} height={product.imageHeight} loading="lazy" decoding="async" />
        <span className="selected-style-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
      </Link>
      <div className="selected-style-copy">
        <p className="selected-style-label">{product.tag}</p>
        <h3><Link to={selectedProductPath(product)}>{product.title}</Link></h3>
        <p className="selected-style-intro">{product.intro}</p>
        <StyleFacts rows={product.facts} />
        <Link to={selectedProductPath(product)} className="selected-style-open" aria-label={`View product details for ${product.title}`}>
          View product details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function SelectedProductStyles({ category }) {
  const selection = selectedProductStyles[category];
  if (!selection) return null;

  return (
    <section id="selected-styles" className="container-site selected-styles" aria-labelledby="selected-styles-title">
      <div className="selected-styles-heading">
        <div><p className="section-label">Product Selection</p><h2 id="selected-styles-title" className="text-display-md text-navy">{selection.title}</h2></div>
        <p>{selection.intro}</p>
      </div>
      <div className={`selected-styles-grid ${category === 'headbands' ? 'selected-styles-headbands' : ''}`}>
        {selection.items.map((product, index) => <SelectedStyleCard key={product.id} product={product} number={index + 1} />)}
      </div>
      <div className="selected-styles-brief">
        <div>
          <h3>Start with the right product details.</h3>
          <p>Share the style name, preferred colors, size option, quantity and destination. Availability, order quantities, customization and lead times are confirmed for the selected style.</p>
        </div>
        <Link to="/contact" className="btn-primary">Discuss Your Selection <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
