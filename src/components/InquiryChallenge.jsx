import { useEffect, useRef, useState } from 'react';

const SCRIPT_ID = 'wincome-inquiry-challenge';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const PRODUCTION_HOSTS = new Set(['wincomehair.com', 'www.wincomehair.com']);
let scriptLoading;

function loadTurnstile() {
  if (typeof window.turnstile?.render === 'function') return Promise.resolve(window.turnstile);
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    let settled = false;
    const finish = (api, error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      script.onload = null;
      script.onerror = null;
      if (error) {
        script.remove();
        scriptLoading = undefined;
        reject(error);
      } else {
        resolve(api);
      }
    };
    const timeout = setTimeout(() => finish(null, new Error('Verification loading timed out')), 15_000);
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      const api = window.turnstile;
      if (typeof api?.render !== 'function') {
        finish(null, new Error('Verification unavailable'));
        return;
      }
      // The load event already confirms script execution. Turnstile rejects
      // ready() when its script was loaded with async/defer.
      finish(api);
    };
    script.onerror = () => finish(null, new Error('Verification unavailable'));
    try { document.head.appendChild(script); }
    catch { finish(null, new Error('Verification unavailable')); }
  });
  return scriptLoading;
}

function hasProductionConfiguration(siteKey) {
  return typeof siteKey === 'string'
    && /^[A-Za-z0-9_-]{16,100}$/.test(siteKey)
    // Cloudflare's test keys must never enable the customer form.
    && !/^[123]x0{20}/.test(siteKey)
    && PRODUCTION_HOSTS.has(window.location?.hostname);
}

// Mounted only on the contact step. Security verification is independent of
// optional analytics consent; its token remains in memory until one submission.
export default function InquiryChallenge({ onTokenChange, resetKey = 0 }) {
  const container = useRef(null);
  const onToken = useRef(onTokenChange);
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);
  onToken.current = onTokenChange;

  useEffect(() => {
    let disposed = false;
    let callbackActive = true;
    let widgetId;
    let api;
    onToken.current('');
    const siteKey = import.meta.env?.VITE_TURNSTILE_SITE_KEY;
    if (!hasProductionConfiguration(siteKey)) {
      setStatus('unavailable');
      return () => { disposed = true; };
    }
    setStatus('loading');

    const invalidate = (nextStatus) => {
      if (disposed) return;
      callbackActive = false;
      onToken.current('');
      setStatus(nextStatus);
    };
    void loadTurnstile().then((loadedApi) => {
      if (disposed || !container.current) return;
      api = loadedApi;
      widgetId = api.render(container.current, {
        sitekey: siteKey,
        action: 'inquiry',
        theme: 'light',
        size: 'compact',
        'response-field': false,
        'refresh-expired': 'manual',
        'refresh-timeout': 'manual',
        retry: 'never',
        callback: (token) => {
          if (disposed || !callbackActive) return;
          if (typeof token !== 'string' || !token || token.length > 2048) {
            invalidate('error');
            return;
          }
          onToken.current(token);
          setStatus('ready');
        },
        'expired-callback': () => invalidate('expired'),
        'timeout-callback': () => invalidate('expired'),
        'error-callback': () => { invalidate('error'); return true; },
      });
      if (widgetId === undefined || widgetId === null) invalidate('error');
    }).catch(() => invalidate('error'));

    return () => {
      disposed = true;
      onToken.current('');
      if (widgetId !== undefined && widgetId !== null) {
        try { api.remove(widgetId); } catch { /* The widget may already be removed. */ }
      }
    };
  }, [resetKey, retry]);

  return (
    <div className="space-y-2">
      <div ref={container} />
      <p role="status" className="text-xs text-tan leading-relaxed">
        {status === 'loading' && 'Please complete the security check before sending your request.'}
        {status === 'ready' && 'Security check complete.'}
        {status === 'expired' && 'The security check expired. Please verify again.'}
        {status === 'error' && 'The security check could not finish. Retry it or contact us via WhatsApp.'}
        {status === 'unavailable' && 'The quote form is temporarily unavailable. Please contact us via WhatsApp.'}
      </p>
      {['error', 'expired'].includes(status) && (
        <button type="button" onClick={() => setRetry(value => value + 1)} className="text-xs text-gold underline">
          Retry security check
        </button>
      )}
    </div>
  );
}
