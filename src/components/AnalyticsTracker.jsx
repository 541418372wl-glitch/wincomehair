import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSENT_CHANGED_EVENT, trackEvent, trackProductInquiry } from '../lib/analytics';
import { trackAiReferral } from '../lib/aiReferral';

function productIdFromPath(pathname) {
  const match = pathname.match(/^\/products\/([^/]+)$/);
  return match ? match[1] : '';
}

export default function AnalyticsTracker() {
  const location = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (previousPath.current !== null && previousPath.current !== path) {
      void trackEvent('page_view', {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
    previousPath.current = path;
  }, [location.pathname, location.search]);

  useEffect(() => {
    const recordAiReferral = () => { void trackAiReferral(); };
    recordAiReferral();
    window.addEventListener(CONSENT_CHANGED_EVENT, recordAiReferral);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, recordAiReferral);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const link = event.target.closest?.('a[href*="api.whatsapp.com"]');
      if (!link) return;

      const productId = productIdFromPath(window.location.pathname);
      void trackEvent('whatsapp_click', {
        link_location: link.dataset.analyticsLocation || 'page_content',
        page_path: `${window.location.pathname}${window.location.search}`,
        product_id: productId,
      });

      if (productId) {
        void trackProductInquiry({
          productId,
          productName: link.dataset.productName,
          method: 'whatsapp',
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
