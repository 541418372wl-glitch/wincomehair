import assert from 'node:assert/strict';

const stored = new Map();
const elements = new Map();
let cookieValue = '_ga=client; _ga_TEST=session';

globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
};
globalThis.window = {
  dataLayer: [],
  location: { hostname: 'wincomehair.com', origin: 'https://wincomehair.com', pathname: '/contact' },
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  },
  dispatchEvent() {},
};
globalThis.document = {
  getElementById: (id) => elements.get(id) || null,
  createElement: () => ({}),
  head: {
    appendChild(element) {
      elements.set(element.id, element);
      queueMicrotask(() => element.onload?.());
    },
  },
};
Object.defineProperty(globalThis.document, 'cookie', {
  get: () => cookieValue,
  set: (value) => { cookieValue = value; },
});

const analytics = await import(`../src/lib/analytics.js?test=${Date.now()}`);
analytics.initializeConsentDefaults();

const calls = () => window.dataLayer.map((args) => Array.from(args));
assert.deepEqual(calls()[0].slice(0, 2), ['consent', 'default']);
assert.equal(calls()[0][2].analytics_storage, 'denied');
assert.equal(calls()[0][2].ad_storage, 'denied');

analytics.setAnalyticsConsent('denied');
assert.equal(analytics.readAnalyticsConsent(), 'denied');
assert.equal(await analytics.trackEvent('whatsapp_click', { link_location: 'footer' }), false);
assert.equal(elements.has('wincome-ga4-script'), false);

analytics.setAnalyticsConsent('granted');
assert.equal(analytics.readAnalyticsConsent(), 'granted');
assert.equal(await analytics.trackEvent('whatsapp_click', {
  link_location: 'footer',
  email: 'must-not-send@example.com',
}), true);
assert.equal(elements.has('wincome-ga4-script'), true);

const eventCall = calls().find((call) => call[0] === 'event' && call[1] === 'whatsapp_click');
assert.equal(eventCall[2].link_location, 'footer');
assert.equal(Object.hasOwn(eventCall[2], 'email'), false);

const configCall = calls().find((call) => call[0] === 'config');
assert.equal(configCall[1], analytics.GA_MEASUREMENT_ID);
assert.equal(configCall[2].allow_google_signals, false);
assert.equal(configCall[2].allow_ad_personalization_signals, false);

delete globalThis.window;
delete globalThis.document;
delete globalThis.CustomEvent;

console.log('Analytics consent and event privacy tests passed');
