import { trackEvent } from './analytics.js';

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

let referralPromise;

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
  try {
    return window.sessionStorage?.getItem(AI_REFERRAL_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markAiReferralTracked() {
  try {
    window.sessionStorage?.setItem(AI_REFERRAL_SESSION_KEY, '1');
  } catch {
    // The event may still be sent if session storage is unavailable.
  }
}

export function trackAiReferral() {
  if (!hasBrowser() || hasTrackedAiReferral()) return Promise.resolve(false);

  const referral = detectAiReferral();
  if (!referral) return Promise.resolve(false);
  if (referralPromise) return referralPromise;

  referralPromise = trackEvent('ai_referral_visit', {
    ...referral,
    landing_path: window.location?.pathname || '/',
  }).then((tracked) => {
    if (tracked) markAiReferralTracked();
    return tracked;
  }).finally(() => {
    referralPromise = undefined;
  });

  return referralPromise;
}
