import { readAnalyticsConsent, trackEvent } from './analytics.js';

export const AI_REFERRAL_SESSION_KEY = 'wincome_ai_referral_tracked_v1';

const AI_REFERRAL_SOURCES = [
  { platform: 'chatgpt', domains: ['chatgpt.com', 'chat.openai.com'], campaignSources: ['chatgpt', 'chatgpt.com'] },
  { platform: 'perplexity', domains: ['perplexity.ai'], campaignSources: ['perplexity', 'perplexity.ai'] },
  { platform: 'claude', domains: ['claude.ai'], campaignSources: ['claude', 'claude.ai'] },
  { platform: 'gemini', domains: ['gemini.google.com', 'bard.google.com'], campaignSources: ['gemini', 'gemini.google.com'] },
  { platform: 'copilot', domains: ['copilot.microsoft.com'], campaignSources: ['copilot', 'microsoft_copilot'] },
  { platform: 'you', domains: ['you.com'], campaignSources: ['you.com', 'you_ai'] },
  { platform: 'poe', domains: ['poe.com'], campaignSources: ['poe', 'poe.com'] },
];

const SESSION_AI_CONTEXT_KEY = 'wincome_ai_attribution_v1';
let documentAttribution;
let referralPromise;
let trackedInDocument = false;

function hasBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function hostnameMatches(hostname, domain) {
  return hostname === domain || hostname.endsWith('.' + domain);
}

export function detectAiReferral({ referrer, href } = {}) {
  if (!hasBrowser() && (!referrer || !href)) return null;

  const pageHref = href || window.location?.href || '';
  const referringUrl = referrer ?? document.referrer ?? '';

  try {
    const campaignSource = new URL(pageHref).searchParams.get('utm_source')?.toLowerCase().trim();
    if (campaignSource) {
      const match = AI_REFERRAL_SOURCES.find((source) => source.campaignSources.includes(campaignSource));
      if (match) return { ai_platform: match.platform, discovery_signal: 'utm_source' };
    }
  } catch {
    // Ignore malformed landing URLs and continue with the referrer signal.
  }

  if (!referringUrl) return null;
  try {
    const hostname = new URL(referringUrl).hostname.toLowerCase().replace(/^www\./, '');
    const match = AI_REFERRAL_SOURCES.find((source) => source.domains.some((domain) => hostnameMatches(hostname, domain)));
    return match ? { ai_platform: match.platform, discovery_signal: 'referrer' } : null;
  } catch {
    return null;
  }
}

function hasTrackedAiReferral() {
  if (trackedInDocument) return true;
  try {
    return window.sessionStorage?.getItem(AI_REFERRAL_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markAiReferralTracked() {
  trackedInDocument = true;
  try {
    window.sessionStorage?.setItem(AI_REFERRAL_SESSION_KEY, '1');
  } catch {
    // In-page consent changes still count this entry only once.
  }
}

function detectLandingContext() {
  // Consent may be granted after a client-side navigation. The document's
  // navigation entry still identifies the original landing URL in that case.
  let landing = new URL(window.location.href);
  try {
    const entry = window.performance?.getEntriesByType?.('navigation')?.[0];
    if (entry?.name) {
      const original = new URL(entry.name);
      if (original.origin === landing.origin) landing = original;
    }
  } catch {
    // Navigation timing may be unavailable in privacy-restricted browsers.
  }
  const referral = detectAiReferral({ href: landing.href });
  return referral ? { ...referral, landing_path: landing.pathname } : null;
}

function isValidContext(context) {
  return AI_REFERRAL_SOURCES.some(source => source.platform === context?.ai_platform)
    && ['referrer', 'utm_source'].includes(context.discovery_signal)
    && typeof context.landing_path === 'string' && /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*\/?)?$/.test(context.landing_path)
    && context.landing_path.length <= 200;
}

export function readSessionAiAttribution() {
  if (!hasBrowser() || readAnalyticsConsent() !== 'granted') return null;
  if (documentAttribution) return documentAttribution;
  try {
    const stored = JSON.parse(window.sessionStorage?.getItem(SESSION_AI_CONTEXT_KEY) || 'null');
    if (isValidContext(stored)) {
      const { ai_platform, discovery_signal, landing_path } = stored;
      return { ai_platform, discovery_signal, landing_path };
    }
  } catch { /* Storage is optional. */ }
  const detected = detectLandingContext();
  if (!isValidContext(detected)) return null;
  documentAttribution = detected;
  try {
    window.sessionStorage?.setItem(SESSION_AI_CONTEXT_KEY, JSON.stringify(detected));
  } catch { /* Keep first-touch context in this document. */ }
  return detected;
}

export function trackAiReferral() {
  if (!hasBrowser()) return Promise.resolve(false);
  if (readAnalyticsConsent() === 'denied') {
    documentAttribution = null;
    try { window.sessionStorage?.removeItem(SESSION_AI_CONTEXT_KEY); } catch { /* Restricted storage. */ }
    return Promise.resolve(false);
  }
  const context = readSessionAiAttribution();
  if (!context || hasTrackedAiReferral()) return Promise.resolve(false);
  if (referralPromise) return referralPromise;

  referralPromise = trackEvent('ai_referral_visit', context).then((tracked) => {
    if (tracked) markAiReferralTracked();
    return tracked;
  }).finally(() => {
    referralPromise = undefined;
  });

  return referralPromise;
}
