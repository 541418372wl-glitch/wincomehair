import { useEffect, useLayoutEffect } from 'react';

const useNavigationEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
import { useLocation, useNavigationType } from 'react-router-dom';

export default function NavigationScroll() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useNavigationEffect(() => {
    // Browser history and hash links retain their own scroll behavior.
    if (navigationType === 'POP' || location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.key, location.hash, navigationType]);

  return null;
}
