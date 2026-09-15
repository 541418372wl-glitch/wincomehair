import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';

// No external resources are loaded by JSDOM. All requests are intercepted.
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
  url: 'https://wincomehair.com/contact', pretendToBeVisual: true,
});
for (const name of ['window', 'document', 'CustomEvent', 'HTMLElement', 'Node']) globalThis[name] = dom.window[name];
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const originalFetch = globalThis.fetch;
const originalError = console.error;
const originalWarn = console.warn;
const errors = [], warnings = [];
console.error = (...args) => errors.push(args);
console.warn = (...args) => warnings.push(args);
let calls = 0;
let finishRequest;
globalThis.fetch = () => { calls++; return new Promise(resolve => { finishRequest = resolve; }); };

const bundle = await build({
  stdin: {
    contents: 'import { h, render } from "preact"; import Contact from "./src/pages/Contact.jsx"; export const mount = () => render(h(Contact), document.getElementById("root")); export const unmount = () => render(null, document.getElementById("root"));',
    resolveDir: process.cwd(), loader: 'jsx',
  },
  bundle: true, write: false, format: 'esm', platform: 'browser', jsx: 'automatic',
  alias: { react: 'preact/compat', 'react-dom': 'preact/compat' },
});
const app = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const flush = () => new Promise(resolve => setTimeout(resolve, 20));
const input = async (id, value) => {
  const element = document.getElementById(id);
  assert.ok(element, 'Missing form field ' + id);
  element.value = value;
  element.dispatchEvent(new window.Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  await flush();
};
const submit = () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

try {
  app.mount();
  await flush();
  await input('productType', 'pins');
  assert.equal(document.querySelector('#quantity option[value="1000-1999"]'), null);
  await input('quantity', 'sample-stock-below-moq');
  submit();
  await flush();
  assert.ok(document.getElementById('material'), 'Enter on product step advances to details');
  assert.equal(calls, 0);
  submit();
  await flush();
  assert.ok(document.getElementById('email'), 'Enter on details step advances to contact');
  assert.equal(calls, 0);
  await input('name', 'Local QA');
  await input('email', 'qa@example.invalid');
  submit();
  submit(); // same render: state alone does not prevent this duplicate
  await flush();
  assert.equal(calls, 1);
  assert.equal(document.querySelector('button[type="button"]').disabled, true);
  finishRequest(Response.json({ error: 'Temporary failure' }, { status: 503 }));
  await flush();
  assert.ok(document.querySelector('[role="alert"]'), 'Failed submission shows accessible feedback');
  assert.equal(document.querySelector('button[type="button"]').disabled, false);
  submit();
  await flush();
  assert.equal(calls, 2, 'The in-flight lock is released after a failure');
  finishRequest(Response.json({ saved: true, notified: false }));
  await flush();
  assert.match(document.body.textContent, /Thank You for Your Inquiry/);
  assert.equal(window.dataLayer, undefined, 'No analytics may load without consent');
  assert.equal(errors.length, 1);
  assert.equal(errors[0][0], 'Inquiry submission failed:');
  assert.equal(warnings.length, 1);
  assert.match(warnings[0][0], /Inquiry saved/);
} finally {
  app.unmount();
  globalThis.fetch = originalFetch;
  console.error = originalError;
  console.warn = originalWarn;
  dom.window.close();
}
console.log('Contact form step progression, MOQ options, duplicate submit, failed retry and saved-without-email success tests passed');
