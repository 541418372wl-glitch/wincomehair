import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Contact from './Contact';
import { findSelectedProduct } from '../data/selectedProductStyles';

export default function SelectedContactRoute() {
  const { search } = useLocation();
  // Static /contact HTML has no query-specific data. Apply the allowlisted
  // selection after hydration, and reset the form when the selection changes.
  const [activeSearch, setActiveSearch] = useState('');
  useEffect(() => setActiveSearch(search), [search]);
  const product = findSelectedProduct(new URLSearchParams(activeSearch).get('product'));
  return <Contact key={product?.slug || 'general'} selectedProduct={product || null} />;
}
