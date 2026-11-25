import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Contact from './Contact';
import { findInquiryProduct } from '../data/productInquiry';

export default function SelectedContactRoute() {
  const { search, hash } = useLocation();
  // Static /contact HTML has no query-specific data. Apply the allowlisted
  // selection after hydration, and reset the form when the selection changes.
  const [activeSearch, setActiveSearch] = useState('');
  useEffect(() => setActiveSearch(search), [search]);
  const params = new URLSearchParams(activeSearch);
  const product = findInquiryProduct(params.get('product'));
  const fromClawComparison = !product && params.get('category') === 'hair-claw-clips';

  useEffect(() => {
    if (hash === '#stock-inquiry' && activeSearch === search) {
      document.getElementById('stock-inquiry')?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [activeSearch, search, hash]);

  return <Contact key={product?.slug || (fromClawComparison ? 'claw-comparison' : 'general')} selectedProduct={product || null} fromClawComparison={fromClawComparison} />;
}
