import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';

// No external resources are loaded. Every API and widget call is simulated.
const originalFetch = globalThis.fetch;
const nativeSetTimeout = globalThis.setTimeout, nativeClearTimeout = globalThis.clearTimeout;
const flush = () => new Promise(resolve => nativeSetTimeout(resolve, 40));
let bundleSequence = 0;

async function harness({ siteKey = 'offline-unit-test-sitekey', hostname = 'wincomehair.com' } = {}) {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
    url: 'https://' + hostname + '/contact', pretendToBeVisual: true,
  });
  for (const name of ['window', 'document', 'CustomEvent', 'HTMLElement', 'Node']) globalThis[name] = dom.window[name];
  globalThis.requestAnimationFrame = callback => nativeSetTimeout(callback, 0);
  globalThis.cancelAnimationFrame = nativeClearTimeout;
  const requests = [], widgets = [], pendingScripts = [], timeouts = [];
  let readyCalls = 0;
  const api = {
    // Model Cloudflare's actual async-script contract: ready() throws even if
    // the API has loaded. The script load event must suffice for rendering.
    ready() {
      readyCalls++;
      throw new Error('Turnstile ready() cannot be used with an async/defer script');
    },
    render(container, options) {
      assert.ok(container.isConnected);
      const widget = { id: 'offline-widget-' + widgets.length, options, removed: false };
      widgets.push(widget);
      return widget.id;
    },
    remove(id) { widgets.find(widget => widget.id === id).removed = true; },
  };
  const appendChild = document.head.appendChild.bind(document.head);
  document.head.appendChild = element => {
    const result = appendChild(element);
    if (element.id === 'wincome-inquiry-challenge') pendingScripts.push({ element, onload: element.onload, onerror: element.onerror });
    if (element.id === 'wincome-ga4-script') queueMicrotask(() => element.onload?.());
    return result;
  };
  globalThis.setTimeout = (callback, delay, ...args) => {
    if (delay === 15_000) {
      const timer = { callback, cleared: false };
      timeouts.push(timer);
      return timer;
    }
    return nativeSetTimeout(callback, delay, ...args);
  };
  globalThis.clearTimeout = timer => {
    if (timeouts.includes(timer)) timer.cleared = true;
    else nativeClearTimeout(timer);
  };
  globalThis.fetch = (url, options) => {
    assert.equal(url, '/api/notify-inquiry');
    return new Promise(resolve => requests.push({ options, resolve }));
  };
  const bundle = await build({
    stdin: {
      contents: 'import { h, render } from "preact"; import Contact from "./src/pages/Contact.jsx"; import InquiryChallenge from "./src/components/InquiryChallenge.jsx";'
        + 'export const mount = () => render(h(Contact), document.getElementById("root"));'
        + 'export const mountChallenge = props => render(h(InquiryChallenge, props), document.getElementById("root"));'
        + 'export const unmount = () => render(null, document.getElementById("root"));'
        + 'export const sequence = ' + ++bundleSequence + ';',
      resolveDir: process.cwd(), loader: 'jsx',
    },
    bundle: true, write: false, format: 'esm', platform: 'browser', jsx: 'automatic',
    define: { 'import.meta.env': JSON.stringify({ VITE_TURNSTILE_SITE_KEY: siteKey }) },
    alias: { react: 'preact/compat', 'react-dom': 'preact/compat' },
  });
  const app = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
  const input = async (id, value) => {
    const element = document.getElementById(id);
    assert.ok(element, 'Missing form field ' + id);
    element.value = value;
    element.dispatchEvent(new window.Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    await flush();
  };
  const submit = () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  const clickText = async text => {
    const button = [...document.querySelectorAll('button')].find(element => element.textContent.includes(text));
    assert.ok(button, 'Missing button ' + text);
    button.click();
    await flush();
  };
  const loadScript = async index => {
    window.turnstile = api;
    pendingScripts[index ?? pendingScripts.length - 1].onload();
    await flush();
  };
  const verify = async () => {
    widgets.at(-1).options.callback('offline-token-' + widgets.length);
    await flush();
  };
  const contactStep = async () => {
    await input('productType', 'pins');
    await input('quantity', 'sample-stock-below-moq');
    submit(); await flush();
    submit(); await flush();
    await input('name', 'Offline QA');
    await input('email', 'offline@example.invalid');
  };
  const respond = async (body, status = 200) => {
    requests.at(-1).resolve(Response.json(body, { status }));
    await flush();
  };
  const cleanup = () => {
    app.unmount();
    globalThis.setTimeout = nativeSetTimeout;
    globalThis.clearTimeout = nativeClearTimeout;
    globalThis.fetch = originalFetch;
    dom.window.close();
  };
  return { app, input, submit, clickText, loadScript, verify, contactStep, respond, cleanup, requests, widgets, pendingScripts, timeouts,
    get readyCalls() { return readyCalls; },
  };
}

const accepted = requestId => ({ ok: true, accepted: true, submissionStatus: 'accepted', requestId });
const rejected = { ok: false, accepted: false, submissionStatus: 'rejected' };

{
  const test = await harness();
  try {
    test.app.mount(); await flush();
    assert.equal(test.pendingScripts.length, 0);
    test.submit(); await flush();
    assert.ok(document.getElementById('productType'), 'Blank step cannot advance');
    await test.input('productType', 'pins');
    assert.equal(document.querySelector('#quantity option[value="1000-1999"]'), null);
    await test.input('quantity', 'sample-stock-below-moq');
    test.submit(); await flush();
    assert.ok(document.getElementById('material'), 'Enter advances without submitting');
    assert.equal(test.pendingScripts.length, 0, 'Details step loads no third party');
    test.submit(); await flush();
    assert.ok(document.getElementById('email'));
    assert.equal(test.pendingScripts.length, 1);
    assert.equal(test.pendingScripts[0].element.src, 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit');
    await test.input('name', 'Offline QA');
    await test.input('email', 'offline@example.invalid');
    test.submit(); await flush();
    assert.equal(test.requests.length, 0, 'Verification blocks programmatic submit');
    await test.loadScript();
    assert.equal(test.readyCalls, 0, 'An async script load renders without calling the incompatible ready API');
    assert.equal(test.widgets.length, 1, 'The first script load creates a widget without requiring a retry');
    assert.equal(test.widgets[0].options.action, 'inquiry');
    assert.equal(test.widgets[0].options['response-field'], false);
    await test.verify();
    const expired = test.widgets.at(-1);
    expired.options['expired-callback']();
    expired.options.callback('late-expired-token');
    await flush(); test.submit();
    assert.equal(test.requests.length, 0, 'Expired callbacks cannot enable submission');
    await test.clickText('Retry security check');
    assert.equal(expired.removed, true);
    await test.verify();
    test.submit(); test.submit(); await flush();
    assert.equal(test.requests.length, 1, 'Double submit makes one API call');
    const payload = JSON.parse(test.requests[0].options.body);
    assert.match(payload.turnstileToken, /^offline-token-/);
    assert.equal(Object.hasOwn(payload.record, 'turnstileToken'), false);
    assert.equal(payload.record.email, 'offline@example.invalid');
    assert.equal(document.querySelector('button[type="submit"]').disabled, true);
    assert.equal(document.querySelector('button[type="button"]').disabled, true);
    await test.respond(rejected, 422);
    assert.ok(document.querySelector('[role="alert"]'));
    assert.equal(document.getElementById('email').value, 'offline@example.invalid');
    assert.equal(document.querySelector('button[type="button"]').disabled, false);
    test.submit();
    assert.equal(test.requests.length, 1, 'Consumed token is not reused');
    await test.verify();
    test.submit();
    await test.respond({ ...rejected, submissionStatus: 'unknown', requestId: 'offline-reference' }, 502);
    assert.match(document.querySelector('[role="alert"]').textContent, /before submitting again/);
    assert.match(document.querySelector('[role="alert"]').textContent, /offline-reference/);
    const removedWidget = test.widgets.at(-1);
    assert.equal(removedWidget.removed, true);
    removedWidget.options.callback('late-removed-token');
    test.submit(); await flush();
    assert.equal(test.requests.length, 2, 'Unknown result blocks all retries');
    assert.equal(document.getElementById('name').value, 'Offline QA');
    const fallbackUrl = new URL(document.querySelector('[data-analytics-location="contact_unconfirmed"]').href);
    assert.equal(fallbackUrl.hostname, 'api.whatsapp.com');
    await test.clickText('I have checked with WINCOME');
    test.submit();
    assert.equal(test.requests.length, 2, 'Acknowledgement still requires fresh verification');
    await test.verify();
    test.submit();
    await test.respond(accepted('11111111-1111-4111-8111-111111111111'));
    assert.match(document.body.textContent, /Thank You for Your Request/);
    assert.match(document.body.textContent, /accepted for processing/);
    assert.doesNotMatch(document.body.textContent, /saved|delivered/i);
    assert.equal(window.dataLayer, undefined, 'Security does not grant analytics consent');
    assert.equal(document.getElementById('wincome-ga4-script'), null);
  } finally { test.cleanup(); }
}

// New accepted leads use a distinct measurement version and exclude PII.
{
  const test = await harness();
  try {
    window.localStorage.setItem('wincome_analytics_consent_v1', 'granted');
    test.app.mount(); await flush();
    await test.contactStep(); await test.loadScript(); await test.verify();
    test.submit();
    await test.respond({ ok: true, saved: true, requestId: '22222222-2222-4222-8222-222222222222' });
    assert.doesNotMatch(document.body.textContent, /Thank You for Your Request/);
    assert.equal((window.dataLayer || []).filter(call => call[0] === 'event').length, 0);
    await test.clickText('I have checked with WINCOME'); await test.verify();
    test.submit(); test.submit();
    await test.respond(accepted('33333333-3333-4333-8333-333333333333'));
    const leads = window.dataLayer.filter(call => call[0] === 'event' && call[1] === 'generate_lead');
    assert.equal(leads.length, 1);
    assert.equal(leads[0][2].product_type, 'pins');
    assert.equal(leads[0][2].lead_status, 'accepted');
    assert.equal(leads[0][2].measurement_version, '3');
    assert.doesNotMatch(JSON.stringify(leads), /example\.invalid|offline-token|33333333/);
  } finally { test.cleanup(); }
}

// Unmount while downloading prevents an orphaned widget and a stale token.
{
  const test = await harness(), tokens = [];
  try {
    test.app.mountChallenge({ onTokenChange: token => tokens.push(token) }); await flush();
    test.app.unmount(); await test.loadScript();
    assert.equal(test.widgets.length, 0);
    assert.deepEqual(tokens, ['', '']);
  } finally { test.cleanup(); }
}

// Timeout, late callback, error, expiry, retry, and removal all clear tokens.
{
  const test = await harness(), tokens = [];
  try {
    test.app.mountChallenge({ onTokenChange: token => tokens.push(token) }); await flush();
    test.timeouts[0].callback(); await flush();
    assert.match(document.body.textContent, /could not finish/);
    assert.equal(test.pendingScripts[0].element.isConnected, false);
    await test.loadScript(0);
    assert.equal(test.widgets.length, 0);
    await test.clickText('Retry security check');
    assert.equal(test.widgets.length, 1);
    const oldWidget = test.widgets.at(-1);
    oldWidget.options['error-callback']();
    oldWidget.options.callback('late-error-token'); await flush();
    assert.equal(tokens.at(-1), '');
    await test.clickText('Retry security check');
    assert.equal(oldWidget.removed, true);
    await test.verify();
    assert.match(tokens.at(-1), /^offline-token-/);
    test.widgets.at(-1).options['timeout-callback'](); await flush();
    assert.equal(tokens.at(-1), '');
  } finally { test.cleanup(); }
}
{
  const test = await harness();
  try {
    test.app.mountChallenge({ onTokenChange() {} }); await flush();
    test.pendingScripts[0].onerror(); await flush();
    await test.clickText('Retry security check');
    assert.equal(test.pendingScripts.length, 2, 'Failed script load is retryable');
    await test.loadScript();
    assert.equal(test.widgets.length, 1);
  } finally { test.cleanup(); }
}

// Missing keys, dummy keys, local and preview hosts cannot submit or load APIs.
for (const options of [{ siteKey: '' }, { siteKey: '1x00000000000000000000AA' }, { hostname: 'wincomehair-preview.vercel.app' }, { hostname: 'localhost' }]) {
  const test = await harness(options);
  try {
    test.app.mount(); await flush(); await test.contactStep();
    assert.match(document.body.textContent, /form is temporarily unavailable/);
    assert.equal(test.pendingScripts.length, 0);
    test.submit(); await flush();
    assert.equal(test.requests.length, 0);
  } finally { test.cleanup(); }
}

for (const name of ['window', 'document', 'CustomEvent', 'HTMLElement', 'Node', 'requestAnimationFrame', 'cancelAnimationFrame']) delete globalThis[name];
console.log('Contact steps, MOQ, Turnstile lifecycle, accepted lead privacy, uncertain-result lock and preview isolation tests passed');
