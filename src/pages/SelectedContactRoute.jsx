import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Contact from './Contact';
import { findInquiryProduct } from '../data/productInquiry';

const categoryPresets = new Map([
  ['hair-claw-clips', 'claw-clips'], ['claw-clips', 'claw-clips'],
  ['scrunchies', 'scrunchies'], ['hair-bows', 'bows'], ['bows', 'bows'],
  ['headbands', 'headbands'], ['hair-clips-barrettes', 'pins'],
]);

export default function SelectedContactRoute() {
  const { search, hash } = useLocation();
  // Static /contact HTML has no query-specific data. Apply the allowlisted
  // selection after hydration without remounting fields the buyer has edited.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const activeSearch = hydrated ? search : '';
  const params = new URLSearchParams(activeSearch);
  const product = findInquiryProduct(params.get('product'));
  const fromClawComparison = !product && params.get('category') === 'hair-claw-clips';

  useEffect(() => {
    if (hash === '#stock-inquiry' && activeSearch === search) {
      document.getElementById('stock-inquiry')?.scrollIntoView?.({ block: 'start', behavior: 'instant' });
    }
  }, [activeSearch, search, hash]);

  return <Contact selectedProduct={product} presetCategory={categoryPresets.get(params.get('category'))}
    fromClawComparison={fromClawComparison} />;
}
