import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  OPEN_CONSENT_EVENT,
  readAnalyticsConsent,
  setAnalyticsConsent,
} from '../lib/analytics';

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readAnalyticsConsent() === null);
    const showPreferences = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, showPreferences);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, showPreferences);
  }, []);

  const choose = (value) => {
    setAnalyticsConsent(value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[calc(100vw-1.5rem)] border border-bronze/20 bg-white p-4 shadow-2xl sm:inset-x-4 sm:bottom-4 sm:max-w-3xl sm:p-6"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 id="analytics-consent-title" className="text-base font-medium text-navy">Analytics cookies</h2>
          <p id="analytics-consent-description" className="mt-1 text-sm leading-relaxed text-tan">
            We use optional Google Analytics cookies to measure site usage and inquiry conversions. Analytics stays off unless you accept. Essential site functions do not require analytics cookies.{' '}
            <Link to="/privacy" className="text-gold underline">Privacy details</Link>
          </p>
        </div>
        <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3">
          <button type="button" onClick={() => choose('denied')} className="btn-outline justify-center px-3 py-3 text-xs sm:px-5 sm:text-sm">
            Reject analytics
          </button>
          <button type="button" onClick={() => choose('granted')} className="btn-primary justify-center px-3 py-3 text-xs sm:px-5 sm:text-sm">
            Accept analytics
          </button>
        </div>
      </div>
    </aside>
  );
}
