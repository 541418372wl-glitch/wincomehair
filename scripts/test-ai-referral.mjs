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
assert.deepEqual(
  aiReferral.detectAiReferral({ href: 'https://wincomehair.com/products', referrer: 'https://claude.ai/new' }),
  { ai_platform: 'claude', discovery_signal: 'referrer' },
);

console.log('AI referral attribution tests passed');
