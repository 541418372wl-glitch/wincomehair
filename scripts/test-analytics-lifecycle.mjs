import assert from 'node:assert/strict';

function environment({ storageFails = false } = {}) {
  const stored = new Map();
  const scripts = new Map();
  globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
  globalThis.window = {
    dataLayer: [], location: { hostname: 'wincomehair.com' }, dispatchEvent() {},
    localStorage: {
      getItem(key) { if (storageFails) throw new Error('blocked'); return stored.get(key); },
      setItem(key, value) { if (storageFails) throw new Error('blocked'); stored.set(key, value); },
    },
  };
  globalThis.document = {
    cookie: '', getElementById: id => scripts.get(id),
    createElement: () => ({ remove() { scripts.delete(this.id); } }),
    head: { appendChild: script => scripts.set(script.id, script) },
  };
  return { scripts, stored };
}

let sequence = 0;
async function fresh(options) {
  const env = environment(options);
  const analytics = await import('../src/lib/analytics.js?lifecycle=' + ++sequence);
  return { ...env, analytics };
}

// A slow tag download must not send a queued lead after consent is withdrawn.
{
  const { analytics, scripts } = await fresh();
  analytics.setAnalyticsConsent('granted');
  const pending = analytics.trackGenerateLead({ productType: 'pins' });
  analytics.setAnalyticsConsent('denied');
  scripts.get('wincome-ga4-script').onload();
  assert.equal(await pending, false);
  assert.equal(window.dataLayer.some(call => ['config', 'event'].includes(call[0])), false);
}

// Explicit session consent still works when browsers refuse localStorage.
{
  const { analytics, scripts } = await fresh({ storageFails: true });
  analytics.setAnalyticsConsent('granted');
  assert.equal(analytics.readAnalyticsConsent(), 'granted');
  const pending = analytics.trackEvent('form_start');
  scripts.get('wincome-ga4-script').onload();
  assert.equal(await pending, true);
  analytics.setAnalyticsConsent('denied');
  assert.equal(await analytics.trackEvent('form_start'), false);
}

// A failed download is retryable on a later event, and another tab's consent
// choice must still be respected when persistent storage works.
{
  const { analytics, scripts, stored } = await fresh();
  analytics.setAnalyticsConsent('granted');
  const failed = analytics.trackEvent('form_start');
  scripts.get('wincome-ga4-script').onerror();
  assert.equal(await failed, false);
  const retry = analytics.trackEvent('form_start');
  scripts.get('wincome-ga4-script').onload();
  assert.equal(await retry, true);
  stored.set(analytics.ANALYTICS_CONSENT_KEY, 'denied');
  assert.equal(await analytics.trackEvent('form_start'), false);
}
delete globalThis.window;
delete globalThis.document;
delete globalThis.CustomEvent;
console.log('Analytics consent withdrawal, blocked storage and tag retry tests passed');
