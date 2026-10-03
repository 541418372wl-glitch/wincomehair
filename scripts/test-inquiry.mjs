import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import handler from '../api/notify-inquiry.js';

const originalFetch = globalThis.fetch;
const originalTimeout = AbortSignal.timeout;
const originalEnv = { ...process.env };
const originalConsole = { info: console.info, warn: console.warn, error: console.error };
const structuredLogs = [];
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const FORMSPARK_URL = 'https://submit-form.com/qa-formspark-form';
const TOKEN = 'qa-private-turnstile-token';
const SECRET = 'qa-server-secret-not-a-real-credential';
const oldVariableNames = [
  'SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY', 'NOTIFY_EMAIL', 'NOTIFY_FROM',
];

for (const level of ['info', 'warn', 'error']) {
  console[level] = (line) => structuredLogs.push(JSON.parse(line));
}

function configure() {
  process.env.NODE_ENV = 'production';
  process.env.VERCEL_ENV = 'production';
  process.env.FORMSPARK_FORM_ID = 'qa-formspark-form';
  process.env.TURNSTILE_SECRET_KEY = SECRET;
  delete process.env.VERCEL_URL;
  for (const key of oldVariableNames) delete process.env[key];
}

function validPayload(overrides = {}) {
  return {
    name: 'QA Buyer',
    company: 'QA Company',
    email: 'buyer@example.com',
    phone: '+1 555 0100',
    product_type: 'claw-clips',
    quantity: '1000-1999',
    material: 'acetate',
    logo_placement: 'packaging-only',
    target_market: 'Europe / UK',
    timeline: '1 month',
    dimensions: '80 x 45 mm',
    message: 'Please quote our private-label accessory project.',
    website: '',
    form_fill_time_ms: 10_000,
    turnstileToken: TOKEN,
    ...overrides,
  };
}

function request(body, headers = {}, method = 'POST') {
  return {
    method,
    headers: {
      'content-type': 'application/json',
      origin: 'https://wincomehair.com',
      host: 'wincomehair.com',
      'x-forwarded-for': '192.0.2.42',
      'x-vercel-id': 'buyer@example.com',
      ...headers,
    },
    body,
  };
}

function response() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: undefined,
    setHeader(name, value) { headers.set(name.toLowerCase(), String(value)); return this; },
    getHeader(name) { return headers.get(name.toLowerCase()); },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function validVerification(overrides = {}) {
  return { success: true, hostname: 'wincomehair.com', action: 'inquiry', ...overrides };
}

function makeFetch({ verification = validVerification(), verificationStatus = 200,
  formsparkBody = {}, formsparkStatus = 200 } = {}) {
  return async (url) => {
    if (url === TURNSTILE_URL) return Response.json(verification, { status: verificationStatus });
    if (url === FORMSPARK_URL) return Response.json(formsparkBody, { status: formsparkStatus });
    throw new Error('Only mocked, allowlisted providers may be requested');
  };
}

async function execute(body = validPayload(), { fetchImpl = makeFetch(), headers, method, req } = {}) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    // There is deliberately no fallback to native fetch in any test.
    assert.ok([TURNSTILE_URL, FORMSPARK_URL].includes(url), 'unapproved provider URL');
    assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'error', 'provider redirects must never be followed');
    assert.ok(options.signal instanceof AbortSignal, 'provider deadline is required');
    calls.push({ url, options });
    return fetchImpl(url, options);
  };
  const res = response();
  await handler(req || request(body, headers, method), res);
  assert.equal(res.getHeader('x-request-id'), res.body.requestId);
  assert.equal(res.getHeader('cache-control'), 'no-store');
  assert.match(res.body.requestId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  for (const key of ['saved', 'notified', 'saveStatus', 'notificationStatus']) {
    assert.equal(Object.hasOwn(res.body, key), false, 'response must not claim legacy storage/notification facts');
  }
  for (const url of [TURNSTILE_URL, FORMSPARK_URL]) {
    assert.ok(calls.filter((call) => call.url === url).length <= 1, 'providers must not be retried');
  }
  return { res, calls };
}

async function assertRejected(body, statusCode, options = {}) {
  const result = await execute(body, options);
  assert.equal(result.res.statusCode, statusCode);
  assert.equal(result.res.body.ok, false);
  assert.equal(result.res.body.accepted, false);
  assert.equal(result.res.body.submissionStatus, 'rejected');
  assert.equal(result.calls.length, 0, 'rejected payloads must not contact providers');
  return result;
}

try {
  configure();
  const { res: accepted, calls } = await execute();
  assert.equal(accepted.statusCode, 200);
  assert.deepEqual(Object.keys(accepted.body).sort(), ['accepted', 'ok', 'requestId', 'submissionStatus']);
  assert.equal(accepted.body.ok, true);
  assert.equal(accepted.body.accepted, true);
  assert.equal(accepted.body.submissionStatus, 'accepted');
  assert.deepEqual(calls.map((call) => call.url), [TURNSTILE_URL, FORMSPARK_URL]);

  const verificationInput = JSON.parse(calls[0].options.body);
  assert.deepEqual(verificationInput, { secret: SECRET, response: TOKEN });
  assert.equal(calls[0].options.body.includes('buyer@example.com'), false);
  assert.equal(calls[0].options.body.includes('192.0.2.'), false);
  const submitted = JSON.parse(calls[1].options.body);
  for (const key of ['name', 'company', 'email', 'phone', 'product_type', 'quantity',
    'material', 'logo_placement', 'target_market', 'timeline', 'dimensions', 'message']) {
    assert.equal(submitted[key], validPayload()[key], 'all inquiry fields must survive forwarding');
  }
  assert.equal(submitted.request_reference, accepted.body.requestId);
  assert.deepEqual(submitted._email, { subject: 'New inquiry from wincomehair.com' });
  assert.equal(calls[1].options.body.includes(TOKEN), false, 'consumed token must not reach Formspark');
  assert.equal(calls[1].options.body.includes(SECRET), false, 'server secret must not reach Formspark');
  for (const key of ['website', 'form_fill_time_ms', 'turnstileToken', 'record', 'attachments']) {
    assert.equal(Object.hasOwn(submitted, key), false);
  }
  assert.equal(calls[1].options.headers['Content-Type'], 'application/json');
  assert.equal(calls[1].options.headers.Accept, 'application/json');
  assert.equal(Object.hasOwn(calls[1].options.headers, 'Authorization'), false);
  assert.equal(Object.hasOwn(calls[1].options.headers, 'apikey'), false);

  // Nested records, legacy field aliases and JSON strings still work. Reserved
  // provider controls, attachments and visitor-supplied routing are discarded.
  const nested = await execute({
    record: {
      ...validPayload(),
      product_type: undefined, productType: 'pins',
      logo_placement: undefined, logoPlacement: 'center',
      target_market: undefined, targetMarket: 'North America',
      attachments: ['must-not-forward'],
      _email: { to: 'attacker@example.com' },
      _redirect: 'https://attacker.example',
      request_reference: 'attacker-reference',
      _botpoison: 'attacker-control',
      'cf-turnstile-response': 'must-not-forward',
    },
    turnstileToken: TOKEN,
  });
  assert.equal(nested.res.body.accepted, true);
  const nestedForwarded = JSON.parse(nested.calls[1].options.body);
  assert.equal(nestedForwarded.product_type, 'pins');
  assert.equal(nestedForwarded.logo_placement, 'center');
  assert.equal(nestedForwarded.target_market, 'North America');
  assert.equal(nestedForwarded.request_reference, nested.res.body.requestId);
  assert.equal(nested.calls[1].options.body.includes('attacker'), false);
  assert.equal(nested.calls[1].options.body.includes('must-not-forward'), false);
  assert.equal((await execute(JSON.stringify(validPayload()))).res.body.accepted, true);

  // Removing every old provider variable must not affect new inquiries.
  assert.ok(oldVariableNames.every((key) => process.env[key] === undefined));
  for (const hostname of ['wincomehair.com', 'www.wincomehair.com']) {
    const result = await execute(validPayload(), {
      headers: { origin: 'https://' + hostname },
      fetchImpl: makeFetch({ verification: validVerification({ hostname }) }),
    });
    assert.equal(result.res.body.accepted, true);
  }

  for (const [body, status] of [
    [validPayload({ name: '' }), 400],
    [validPayload({ email: 'invalid' }), 400],
    [validPayload({ website: 'https://spam.example' }), 400],
    [validPayload({ form_fill_time_ms: 100 }), 400],
    [validPayload({ form_fill_time_ms: 90_000_000 }), 400],
    [validPayload({ message: 'https://a.example https://b.example https://c.example https://d.example' }), 400],
    [validPayload({ message: 'Hello\u0001world' }), 400],
    [validPayload({ turnstileToken: undefined }), 400],
    [validPayload({ turnstileToken: '' }), 400],
    [validPayload({ turnstileToken: 42 }), 400],
    [validPayload({ turnstileToken: ['token'] }), 400],
    [validPayload({ turnstileToken: 'token with spaces' }), 400],
    [validPayload({ turnstileToken: 'x'.repeat(2049) }), 400],
    [validPayload({ turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX' }), 400],
    [validPayload({ message: 'x'.repeat(70_000) }), 413],
    ['{invalid JSON', 400],
    [[], 400],
    [{ record: [] }, 400],
    [42, 400],
  ]) {
    await assertRejected(body, status);
  }
  await assertRejected(validPayload(), 405, { method: 'GET' });
  await assertRejected(validPayload(), 415, { headers: { 'content-type': 'text/plain' } });
  await assertRejected(validPayload(), 415, { headers: { 'content-type': 'application/json-malformed' } });
  await assertRejected(validPayload(), 413, { headers: { 'content-length': '70000' } });
  for (const origin of ['https://attacker.example', 'http://wincomehair.com',
    'https://wincomehair.com:8443', 'https://wincomehair.com.attacker.example', 'null']) {
    await assertRejected(validPayload(), 403, { headers: {
      origin, host: 'attacker.example', 'x-forwarded-host': 'attacker.example',
    } });
  }
  process.env.VERCEL_URL = 'attacker.example';
  await assertRejected(validPayload(), 403, { headers: { origin: 'https://attacker.example' } });
  delete process.env.VERCEL_URL;

  for (const deployment of ['preview', 'development', 'staging']) {
    configure();
    process.env.VERCEL_ENV = deployment;
    await assertRejected(validPayload(), 403);
  }
  configure();
  for (const key of ['FORMSPARK_FORM_ID', 'TURNSTILE_SECRET_KEY']) {
    delete process.env[key];
    await assertRejected(validPayload(), 503);
    configure();
  }
  for (const formId of ['https://attacker.example', '../other-form', 'form/id',
    'form?target=other', 'form#other', 'x'.repeat(101), 'echo', 'Echo',
    'your-form-id', 'your-formspark-form-id']) {
    process.env.FORMSPARK_FORM_ID = formId;
    await assertRejected(validPayload(), 503);
  }
  for (const secret of ['1x0000000000000000000000000000000AA',
    '2x0000000000000000000000000000000AA', '3x0000000000000000000000000000000AA']) {
    configure();
    process.env.TURNSTILE_SECRET_KEY = secret;
    await assertRejected(validPayload(), 503);
    // NODE_ENV also protects a production server without VERCEL_ENV.
    delete process.env.VERCEL_ENV;
    await assertRejected(validPayload(), 503);
  }
  configure();

  // Validation failures, wrong actions, wrong domains and consumed tokens fail
  // closed before Formspark. The provider response body is never exposed.
  for (const verification of [
    validVerification({ success: false, 'error-codes': ['invalid-input-response'] }),
    validVerification({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
    validVerification({ hostname: 'attacker.example' }),
    validVerification({ hostname: 'preview.vercel.app' }),
    validVerification({ hostname: 'wincomehair.com.attacker.example' }),
    validVerification({ hostname: undefined }),
    validVerification({ action: 'login' }),
    validVerification({ action: undefined }),
  ]) {
    const result = await execute(validPayload(), { fetchImpl: makeFetch({ verification }) });
    assert.equal(result.res.statusCode, 400);
    assert.equal(result.res.body.accepted, false);
    assert.equal(result.calls.length, 1);
    assert.equal(JSON.stringify(result.res.body).includes('timeout-or-duplicate'), false);
  }
  for (const fetchImpl of [
    makeFetch({ verificationStatus: 500 }),
    makeFetch({ verification: {} }),
    makeFetch({ verification: null }),
    makeFetch({ verification: [] }),
    makeFetch({ verification: { success: 'true' } }),
    async () => new Response('<html>verification unavailable</html>', { headers: { 'Content-Type': 'text/html' } }),
    async () => new Response('{broken', { headers: { 'Content-Type': 'application/json' } }),
    async () => { throw new DOMException('Timed out', 'TimeoutError'); },
    async () => { throw new TypeError('Lost response'); },
  ]) {
    const result = await execute(validPayload(), { fetchImpl });
    assert.equal(result.res.statusCode, 503);
    assert.equal(result.res.body.accepted, false);
    assert.equal(result.res.body.submissionStatus, 'rejected');
    assert.equal(result.calls.length, 1);
  }

  // Siteverify is authoritative for one-use tokens. A second request must
  // validate again and must not reuse a cached success from the first one.
  let verificationCount = 0;
  let submissionCount = 0;
  const replayFetch = async (url) => {
    if (url === TURNSTILE_URL) {
      verificationCount += 1;
      return Response.json(verificationCount === 1 ? validVerification()
        : { success: false, 'error-codes': ['timeout-or-duplicate'] });
    }
    submissionCount += 1;
    return Response.json({});
  };
  assert.equal((await execute(validPayload(), { fetchImpl: replayFetch })).res.body.accepted, true);
  assert.equal((await execute(validPayload(), { fetchImpl: replayFetch })).res.body.accepted, false);
  assert.equal(verificationCount, 2);
  assert.equal(submissionCount, 1);

  // Every uncertain Formspark response gives a reference and WhatsApp guidance.
  // No response body, error detail, automatic retry or fallback reaches visitors.
  const formFailures = [
    () => Response.json({ error: 'provider-private-error' }, { status: 400 }),
    () => Response.json({}, { status: 429 }),
    () => Response.json({}, { status: 500 }),
    () => new Response('<html>200 is not JSON</html>', { headers: { 'Content-Type': 'text/html' } }),
    () => new Response('{}'),
    () => new Response('{broken', { headers: { 'Content-Type': 'application/json' } }),
    () => Response.json(null),
    () => Response.json([]),
    () => Response.json('unexpected'),
    () => Response.json({ success: false }),
    () => Response.json({ ok: false }),
    () => Response.json({ accepted: false }),
    () => Response.json({ error: 'provider-private-error' }),
    () => Response.json({ errors: ['provider-private-error'] }),
    () => { throw new DOMException('Timed out after accepting write', 'TimeoutError'); },
    () => { throw new DOMException('Aborted after accepting write', 'AbortError'); },
    () => { throw new TypeError('Redirect disallowed or network response lost'); },
    () => { const error = new Error('buyer@example.com ' + TOKEN); error.name = TOKEN; throw error; },
  ];
  for (const failure of formFailures) {
    const result = await execute(validPayload(), { fetchImpl: async (url) => {
      if (url === TURNSTILE_URL) return Response.json(validVerification());
      return failure();
    } });
    assert.equal(result.res.statusCode, 502);
    assert.equal(result.res.body.ok, false);
    assert.equal(result.res.body.accepted, false);
    assert.equal(result.res.body.submissionStatus, 'unknown');
    assert.match(result.res.body.error, /WhatsApp before submitting again/);
    assert.equal(result.calls.length, 2);
    assert.equal(JSON.stringify(result.res.body).includes('provider-private-error'), false);
    assert.equal(JSON.stringify(result.res.body).includes(TOKEN), false);
  }

  // Exercise cancellation through the supplied signal, rather than only a
  // provider that throws immediately. Short test timers never call a network.
  for (const target of [TURNSTILE_URL, FORMSPARK_URL]) {
    const deadlines = [];
    AbortSignal.timeout = (milliseconds) => {
      deadlines.push(milliseconds);
      const targetCall = target === TURNSTILE_URL ? 1 : 2;
      if (deadlines.length !== targetCall) return originalTimeout(milliseconds);
      const controller = new AbortController();
      setTimeout(() => controller.abort(new DOMException('Mock deadline', 'TimeoutError')), 1);
      return controller.signal;
    };
    try {
      const result = await execute(validPayload(), { fetchImpl: async (url, options) => {
        if (url !== target) return Response.json(validVerification());
        return new Promise((resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
        });
      } });
      assert.equal(result.res.statusCode, target === TURNSTILE_URL ? 503 : 502);
      assert.equal(result.res.body.accepted, false);
      assert.equal(result.res.body.submissionStatus, target === TURNSTILE_URL ? 'rejected' : 'unknown');
      assert.ok(deadlines.every((milliseconds) => milliseconds > 0 && milliseconds <= 8_000));
    } finally {
      AbortSignal.timeout = originalTimeout;
    }
  }

  // A valid empty JSON acknowledgement is acceptance only: it cannot establish
  // storage or email delivery, and even silent filtering cannot be inferred.
  for (const formsparkBody of [{}, { success: true }, { errors: [] }]) {
    const result = await execute(validPayload(), { fetchImpl: makeFetch({ formsparkBody }) });
    assert.equal(result.res.body.submissionStatus, 'accepted');
    assert.equal(result.res.body.accepted, true);
  }

  // Exercise streamed JSON and size enforcement when Vercel has not parsed it.
  const streamed = new EventEmitter();
  Object.assign(streamed, request(undefined));
  streamed.destroy = () => {};
  const streamedRun = execute(undefined, { req: streamed });
  streamed.emit('data', Buffer.from(JSON.stringify(validPayload())));
  streamed.emit('end');
  assert.equal((await streamedRun).res.body.accepted, true);
  const oversized = new EventEmitter();
  Object.assign(oversized, request(undefined));
  oversized.destroy = () => {};
  const oversizedRun = execute(undefined, { req: oversized });
  oversized.emit('data', Buffer.alloc(70_000, 65));
  const oversizedResult = await oversizedRun;
  assert.equal(oversizedResult.res.statusCode, 413);
  assert.equal(oversizedResult.calls.length, 0);

  const events = new Set(structuredLogs.map((entry) => entry.event));
  for (const expected of ['inquiry.request.started', 'inquiry.request.completed',
    'inquiry.verification.started', 'inquiry.verification.allowed', 'inquiry.verification.rejected',
    'inquiry.verification.unavailable', 'inquiry.submission.started',
    'inquiry.submission.accepted', 'inquiry.submission.unconfirmed', 'inquiry.antispam.filtered']) {
    assert.equal(events.has(expected), true, 'missing structured event: ' + expected);
  }
  const serializedLogs = JSON.stringify(structuredLogs);
  for (const value of ['buyer@example.com', '192.0.2.', 'QA Buyer', 'QA Company',
    '+1 555 0100', 'private-label accessory project', TOKEN, SECRET, 'provider-private-error',
    'supabase', 'resend']) {
    assert.equal(serializedLogs.includes(value), false, 'logs must not expose private/provider input: ' + value);
  }
} finally {
  globalThis.fetch = originalFetch;
  AbortSignal.timeout = originalTimeout;
  Object.assign(console, originalConsole);
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
}

console.log('Inquiry API Formspark acceptance, mandatory Turnstile, provider deadlines, isolation and privacy tests passed');
