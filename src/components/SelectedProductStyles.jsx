import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { selectedProductStyles } from '../data/selectedProductStyles';

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
  const dialogRef = useRef(null);
  const previousOverflow = useRef(null);
  const titleId = `selected-style-title-${product.id}`;

  function restoreScroll() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }

  useEffect(() => () => restoreScroll(), []);

  function openSpecifications() {
    if (!dialogRef.current || dialogRef.current.open) return;
    dialogRef.current.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  function keepFocusInDialog(event) {
    if (event.key !== 'Tab') return;
    const controls = dialogRef.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <article id={`selection-${product.id}`} className="selected-style-card">
      <div className="selected-style-photo">
        <img src={product.image} alt={product.alt} width={product.imageWidth} height={product.imageHeight} loading="lazy" decoding="async" />
        <span className="selected-style-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
      </div>
      <div className="selected-style-copy">
        <p className="selected-style-label">{product.tag}</p>
        <h3>{product.title}</h3>
        <p className="selected-style-intro">{product.intro}</p>
        <StyleFacts rows={product.facts} />
        <button type="button" className="selected-style-open" onClick={openSpecifications} aria-haspopup="dialog" aria-controls={`selected-style-dialog-${product.id}`} aria-label={`View specifications for ${product.title}`}>
          View specifications <span aria-hidden="true">↗</span>
        </button>
      </div>
      <dialog ref={dialogRef} id={`selected-style-dialog-${product.id}`} className="selected-style-dialog" aria-labelledby={titleId} onClose={restoreScroll} onKeyDown={keepFocusInDialog}>
        <div className="selected-style-dialog-header">
          <span>WINCOME / PRODUCT SPECIFICATIONS</span>
          <button type="button" className="selected-style-close" onClick={() => dialogRef.current.close()} aria-label="Close specifications">Close ×</button>
        </div>
        <div className="selected-style-detail">
          <img src={product.image} alt={product.alt} width={product.imageWidth} height={product.imageHeight} loading="lazy" decoding="async" />
          <div className="selected-style-detail-copy">
            <p className="selected-style-label">{product.group}</p>
            <h2 id={titleId}>{product.title}</h2>
            <p>{product.details}</p>
            <StyleFacts rows={[...product.facts, ...(product.extra || [])]} />
            {product.table ? (
              <table>
                <caption>Size options</caption>
                <thead><tr>{product.table.heads.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
                <tbody>{product.table.rows.map(row => <tr key={row[0]}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
              </table>
            ) : null}
            {product.care ? <><h3>Care instructions</h3><p>{product.care}</p></> : null}
            {product.note ? <p className="selected-style-note">{product.note}</p> : null}
          </div>
        </div>
      </dialog>
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
