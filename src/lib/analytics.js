export const GA_MEASUREMENT_ID = 'G-KXQN28Q1MS';
export const ANALYTICS_CONSENT_KEY = 'wincome_analytics_consent_v1';
export const CONSENT_CHANGED_EVENT = 'wincome:analytics-consent-changed';
export const OPEN_CONSENT_EVENT = 'wincome:open-consent-preferences';

const ALLOWED_CONSENT = new Set(['granted', 'denied']);
const BLOCKED_PARAMETER_NAMES = new Set(['email', 'phone', 'name', 'message', 'company']);
let defaultsInitialized = false;
let analyticsConfigured = false;
let scriptPromise;

function hasBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function ensureGtag() {
  if (!hasBrowser()) return null;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  return window.gtag;
}

function consentState(analyticsStorage) {
  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: analyticsStorage,
  };
}

export function initializeConsentDefaults() {
  if (defaultsInitialized || !hasBrowser()) return;
  const gtag = ensureGtag();
  gtag('consent', 'default', consentState('denied'));
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'allow_ad_personalization_signals', false);
  defaultsInitialized = true;
}

export function readAnalyticsConsent() {
  if (!hasBrowser()) return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return ALLOWED_CONSENT.has(value) ? value : null;
  } catch {
    return null;
  }
}

function persistAnalyticsConsent(value) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // Consent still applies for the current page if storage is unavailable.
  }
}

function clearAnalyticsCookies() {
  if (!hasBrowser()) return;
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const domains = ['', window.location?.hostname, '.wincomehair.com'].filter(Boolean);

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
    }
  }
}

function loadGoogleTag() {
  if (!hasBrowser()) return Promise.resolve(false);
  if (scriptPromise) return scriptPromise;

  const existing = document.getElementById('wincome-ga4-script');
  if (existing) {
    scriptPromise = Promise.resolve(true);
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = 'wincome-ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return scriptPromise;
}

async function enableAnalytics() {
  initializeConsentDefaults();
  const gtag = ensureGtag();
  gtag('consent', 'update', consentState('granted'));

  const loaded = await loadGoogleTag();
  if (!loaded) return false;
  if (!analyticsConfigured) {
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    analyticsConfigured = true;
  }
  return true;
}

export function initializeAnalyticsFromStoredConsent() {
  initializeConsentDefaults();
  const consent = readAnalyticsConsent();
  if (consent === 'granted') {
    void enableAnalytics();
  } else if (consent === 'denied') {
    ensureGtag()('consent', 'update', consentState('denied'));
  }
  return consent;
}

export function setAnalyticsConsent(value) {
  if (!ALLOWED_CONSENT.has(value) || !hasBrowser()) return;
  initializeConsentDefaults();
  persistAnalyticsConsent(value);

  if (value === 'granted') {
    void enableAnalytics();
  } else {
    ensureGtag()('consent', 'update', consentState('denied'));
    clearAnalyticsCookies();
  }

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: { value } }));
}

export function openConsentPreferences() {
  if (!hasBrowser()) return;
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
}

function sanitizeEventParams(params) {
  return Object.fromEntries(
    Object.entries(params || {})
      .filter(([key, value]) => !BLOCKED_PARAMETER_NAMES.has(key) && value !== undefined && value !== null && value !== '')
      .map(([key, value]) => [
        key.slice(0, 40),
        typeof value === 'string' ? value.slice(0, 100) : value,
      ]),
  );
}

export async function trackEvent(eventName, params = {}) {
  if (!hasBrowser() || readAnalyticsConsent() !== 'granted') return false;
  const ready = await enableAnalytics();
  if (!ready) return false;
  ensureGtag()('event', eventName.slice(0, 40), sanitizeEventParams(params));
  return true;
}

export function trackGenerateLead({ productType, quantity, targetMarket }) {
  return trackEvent('generate_lead', {
    lead_source: 'quote_form',
    product_type: productType,
    quantity_range: quantity,
    target_market: targetMarket,
  });
}

export function trackProductInquiry({ productId, productName, method }) {
  return trackEvent('product_inquiry', {
    product_id: productId,
    product_name: productName,
    inquiry_method: method,
  });
}
