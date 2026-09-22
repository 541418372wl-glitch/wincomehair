import assert from 'node:assert/strict';

const savedSubmission = { ok: true, saved: true, requestId: '11111111-1111-4111-8111-111111111111' };

function environment({ storageFails = false, hostname = 'wincomehair.com' } = {}) {
  const stored = new Map();
  const scripts = new Map();
  globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
  globalThis.window = {
    dataLayer: [], location: { hostname }, dispatchEvent() {},
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
  const pending = analytics.trackGenerateLead({ submission: savedSubmission, productType: 'pins' });
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
// Consent never allows local, preview, or unrelated hosts into production GA4.
for (const hostname of ['localhost', '127.0.0.1', 'wincomehair-preview.vercel.app', 'wincomehair.vercel.app', 'wincomehair.com.example.org']) {
  const { analytics, scripts } = await fresh({ hostname });
  analytics.setAnalyticsConsent('granted');
  assert.equal(await analytics.trackEvent('whatsapp_click'), false);
  assert.equal(await analytics.trackGenerateLead({ submission: savedSubmission }), false);
  assert.equal(scripts.size, 0);
  assert.equal(window.dataLayer.some(call => ['config', 'event'].includes(call[0])), false);
}

// Only a confirmed save qualifies; repeated/concurrent callbacks count once.
{
  const { analytics, scripts } = await fresh();
  analytics.setAnalyticsConsent('granted');
  for (const submission of [undefined, { saved: true }, { ...savedSubmission, saved: false }, { ...savedSubmission, ok: false }]) {
    assert.equal(await analytics.trackGenerateLead({ submission }), false);
  }
  const first = analytics.trackGenerateLead({ submission: savedSubmission, productType: 'pins' });
  const second = analytics.trackGenerateLead({ submission: savedSubmission, productType: 'pins' });
  scripts.get('wincome-ga4-script').onload();
  assert.deepEqual(await Promise.all([first, second]), [true, true]);
  assert.equal(await analytics.trackGenerateLead({ submission: savedSubmission }), true);
  const leads = window.dataLayer.filter(call => call[0] === 'event' && call[1] === 'generate_lead');
  assert.equal(leads.length, 1);
  assert.equal(leads[0][2].lead_status, 'saved');
  assert.equal(leads[0][2].measurement_version, '2');
  assert.equal(JSON.stringify(leads).includes(savedSubmission.requestId), false);
}

delete globalThis.window;
delete globalThis.document;
delete globalThis.CustomEvent;
console.log('Analytics consent withdrawal, blocked storage and tag retry tests passed');
