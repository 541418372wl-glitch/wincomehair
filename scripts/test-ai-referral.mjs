import assert from 'node:assert/strict';

const stored = new Map();
const sessionStored = new Map();
const elements = new Map();

globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
};
globalThis.window = {
  dataLayer: [],
  location: {
    hostname: 'wincomehair.com',
    origin: 'https://wincomehair.com',
    pathname: '/contact',
    href: 'https://wincomehair.com/contact?utm_source=chatgpt.com',
  },
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  },
  sessionStorage: {
    getItem: (key) => sessionStored.get(key) ?? null,
    setItem: (key, value) => sessionStored.set(key, value),
  },
  dispatchEvent() {},
};
globalThis.document = {
  referrer: '',
  cookie: '',
  getElementById: (id) => elements.get(id) || null,
  createElement: () => ({}),
  head: {
    appendChild(element) {
      elements.set(element.id, element);
      queueMicrotask(() => element.onload?.());
    },
  },
};

const analytics = await import('../src/lib/analytics.js?ai-referral-test=' + Date.now());
analytics.initializeConsentDefaults();
analytics.setAnalyticsConsent('granted');

const aiReferral = await import('../src/lib/aiReferral.js?test=' + Date.now());
assert.equal(await aiReferral.trackAiReferral(), true);

const calls = window.dataLayer.map((args) => Array.from(args));
const events = calls.filter((call) => call[0] === 'event' && call[1] === 'ai_referral_visit');
assert.equal(events.length, 1);
assert.deepEqual(events[0][2], {
  ai_platform: 'chatgpt',
  discovery_signal: 'utm_source',
  landing_path: '/contact',
});
assert.equal(await aiReferral.trackAiReferral(), false);
// A buyer can accept analytics on a later SPA page. Use the original document
// entry and send only the landing path, without any query string or fragment.
for (const [landingQuery, referrer, platform, signal] of [
  ['?utm_source=chatgpt.com', '', 'chatgpt', 'utm_source'],
  ['', 'https://claude.ai/new', 'claude', 'referrer'],
]) {
  const visit = await import('../src/lib/aiReferral.js?delayed=' + platform);
  sessionStored.clear();
  window.dataLayer.length = 0;
  analytics.setAnalyticsConsent('denied');
  const landing = '/blog/claw-clip-size-guide';
  const entry = window.location.origin + landing + landingQuery + '#size';
  window.performance = { getEntriesByType(type) { return type === 'navigation' ? [{ name: entry }] : []; } };
  document.referrer = referrer;
  window.location.href = entry;
  window.location.pathname = landing;
  assert.equal(await visit.trackAiReferral(), false);
  assert.equal(sessionStored.size, 0);
  window.location.pathname = '/contact';
  window.location.href = window.location.origin + '/contact';
  analytics.setAnalyticsConsent('granted');
  assert.equal(await visit.trackAiReferral(), true);
  assert.equal(await visit.trackAiReferral(), false);
  const tracked = window.dataLayer.filter(args => args[0] === 'event' && args[1] === 'ai_referral_visit');
  assert.equal(tracked.length, 1);
  assert.deepEqual(tracked[0][2], { ai_platform: platform, discovery_signal: signal, landing_path: landing });
}
// Reopening cookie settings must not count the same entry again, even when
// session storage is blocked and the current document is the only fallback.
const blockedStore = await import('../src/lib/aiReferral.js?blocked-session-storage');
Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage disabled'); } });
window.dataLayer.length = 0;
assert.equal(await blockedStore.trackAiReferral(), true);
analytics.setAnalyticsConsent('denied');
assert.equal(await blockedStore.trackAiReferral(), false);
analytics.setAnalyticsConsent('granted');
assert.equal(await blockedStore.trackAiReferral(), false);
assert.equal(window.dataLayer.filter(args => args[1] === 'ai_referral_visit').length, 1);
assert.deepEqual(
  aiReferral.detectAiReferral({ href: 'https://wincomehair.com/products', referrer: 'https://claude.ai/new' }),
  { ai_platform: 'claude', discovery_signal: 'referrer' },
);

console.log('AI referral attribution tests passed');
