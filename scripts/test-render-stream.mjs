import assert from 'node:assert/strict';
import { createElement as h, lazy, Suspense } from 'react';
import { renderStream } from '../src/lib/render-stream.js';

assert.match(await renderStream(h('h1', null, 'Working page')), /Working page/);
const Broken = lazy(() => Promise.reject(new Error('Article module failed')));
await assert.rejects(renderStream(h(Suspense, { fallback: h('p', null, 'Loading') }, h(Broken))), /Article module failed/);
function BrokenShell() { throw new Error('Shell failed'); }
await assert.rejects(renderStream(h(BrokenShell)), /Shell failed/);
const Pending = lazy(() => new Promise(() => {}));
await assert.rejects(renderStream(h(Suspense, { fallback: null }, h(Pending)), { timeoutMs: 20 }), /SSR timed out/);
console.log('SSR success, lazy subtree failure, shell failure and timeout tests passed');
