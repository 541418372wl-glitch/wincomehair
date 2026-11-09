import { Link } from 'react-router-dom';
import { selectedProductPath } from '../data/selectedProductStyles';

const inquiryDetails = {
  oversized: 'Choose regular fabric or the larger satin option, then list colors and quantities for each option.',
  silk: 'Specify the listed width and corresponding outer diameter, then colors and quantities for each size.',
  rhinestone: 'Specify colors, quantities and decoration requirements. Review the product care instructions before ordering.',
};

function ListedDimensions({ product }) {
  if (product.table) {
    return (
      <>
        <p className="scrunchie-dimension-key">{product.table.heads.join(' → ')}</p>
        <ul className="scrunchie-dimensions">
          {product.table.rows.map(([option, diameter]) => <li key={option}>{option} → {diameter}</li>)}
        </ul>
      </>
    );
  }
  const dimensions = [...product.facts.filter(([label]) => label === 'Outer diameter'), ...product.extra];
  return <ul className="scrunchie-dimensions">{dimensions.map(([label, value]) => <li key={label}>{label}: {value}</li>)}</ul>;
}

export default function ScrunchieBuyingComparison({ products }) {
  return (
    <div id="scrunchie-buying-comparison" className="scrunchie-buying-comparison">
      <h3 id="scrunchie-comparison-title">Compare Scrunchie Specifications for a Bulk Order</h3>
      <p className="scrunchie-comparison-intro">Planning custom scrunchies for a retail collection? Start with the fabric, finished dimensions and decoration, then list the quantity required for each size and color. The photos above show the selected styles; they are not a to-scale comparison.</p>
      <p id="scrunchie-scroll-hint" className="scrunchie-scroll-hint">Swipe or scroll horizontally to compare all columns.</p>
      <div className="scrunchie-table-scroll" role="region" aria-labelledby="scrunchie-comparison-title" aria-describedby="scrunchie-scroll-hint" tabIndex={0}>
        <table className="scrunchie-comparison-table">
          <caption className="sr-only">Three selected scrunchies: confirmed fabrics, listed dimensions and details to include in an inquiry.</caption>
          <thead><tr><th scope="col">Selected style</th><th scope="col">Fabric &amp; finish</th><th scope="col">Listed dimensions</th><th scope="col">Specify in your inquiry</th></tr></thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <th scope="row"><Link to={selectedProductPath(product)}>{product.title}</Link></th>
                <td>{product.facts.find(([label]) => label === 'Material' || label === 'Fabric')[1]}{product.id === 'rhinestone' ? <p>Charmeuse satin with hot-fix rhinestones.</p> : null}</td>
                <td><ListedDimensions product={product} /></td>
                <td>{inquiryDetails[product.id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="scrunchie-buying-notes">
        <section aria-labelledby="scrunchie-order-terms">
          <h4 id="scrunchie-order-terms">Production MOQ &amp; timing</h4>
          <p>The production MOQ for each listed scrunchie style is {products[0].moq}. Confirm the quantity allocation across sizes and colors with your quotation. A per-color minimum or permission to mix styles is not established here.</p>
          <p>Samples and in-stock items are discussed separately, subject to confirmation. Physical sampling takes approximately 15 days; bulk production and shipping schedules are confirmed separately.</p>
        </section>
        <section aria-labelledby="scrunchie-missing-details">
          <h4 id="scrunchie-missing-details">Details still to confirm</h4>
          <ul>
            <li>Finished weight, elastic opening, stretch range and recovery test results are not yet available.</li>
            <li>Hair-volume fit and wrap count are unverified; outer diameter does not establish either.</li>
            <li>Size/color minimums, mixed-style or mixed-color allowances, unit prices and quantity pricing require a quotation.</li>
          </ul>
        </section>
      </div>
      <div className="selected-styles-brief scrunchie-quote-brief">
        <div>
          <h3>What to Include in a Custom Scrunchie Quote</h3>
          <ul>
            <li>Product style and fabric option</li>
            <li>Listed size and quantity per size/color</li>
            <li>Branding request: label, ribbon, hang tag or packaging artwork</li>
            <li>Packaging choice and quantity per pack</li>
            <li>Destination and required delivery date</li>
          </ul>
          <p>For custom scrunchies with a logo, include your artwork and preferred placement. Suitable branding methods, costs and availability must be confirmed for the selected construction. No completed logo-production example is shown here.</p>
          <p className="scrunchie-guide-links"><Link to="/blog/silk-vs-satin-scrunchies">Compare silk and satin fabrics</Link><Link to="/blog/hair-accessory-packaging-guide">Plan retail packaging</Link></p>
        </div>
        <Link to="/contact" className="btn-primary">Request a Scrunchie Quote <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
