import assert from 'node:assert/strict';
import handler from '../api/notify-inquiry.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const originalConsole = {
  info: console.info,
  warn: console.warn,
  error: console.error,
};
const structuredLogs = [];
let ipCounter = 10;

for (const level of ['info', 'warn', 'error']) {
  console[level] = (line) => {
    structuredLogs.push(JSON.parse(line));
  };
}

function validPayload(overrides = {}) {
  return {
    name: 'QA Buyer',
    email: 'buyer@example.com',
    product_type: 'claw-clips',
    quantity: '300-1000',
    target_market: 'Europe / UK',
    message: 'Please quote our private-label accessory project.',
    website: '',
    form_started_at: Date.now() - 10_000,
    ...overrides,
  };
}

function request(body, headers = {}, method = 'POST') {
  ipCounter += 1;
  return {
    method,
    headers: {
      'content-type': 'application/json',
      origin: 'https://wincomehair.com',
      host: 'wincomehair.com',
      'user-agent': 'Wincome QA',
      'x-forwarded-for': `192.0.2.${ipCounter}`,
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
    setHeader(name, value) {
      headers.set(name.toLowerCase(), String(value));
      return this;
    },
    getHeader(name) {
      return headers.get(name.toLowerCase());
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function configure() {
  process.env.NODE_ENV = 'production';
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test';
  process.env.RESEND_API_KEY = 'resend-test';
  process.env.NOTIFY_EMAIL = 'owner@example.com';
}

function makeFetch({ rateStatus = 200, rateAllowed = true, dbStatus = 201, emailStatus = 200 } = {}) {
  return async (url, options) => {
    if (url.includes('/rpc/consume_inquiry_rate_limits')) {
      if (rateStatus !== 200) return new Response('', { status: rateStatus });
      const input = JSON.parse(options.body);
      const result = input.p_key_hashes.map((keyHash, index) => ({
        key_hash: keyHash,
        current_count: rateAllowed ? 1 : input.p_limits[index] + 1,
        max_requests: input.p_limits[index],
        allowed: rateAllowed,
        retry_after_seconds: 300,
      }));
      return Response.json(result);
    }
    if (url.endsWith('/rest/v1/inquiries')) {
      return new Response('', { status: dbStatus });
    }
    if (url === 'https://api.resend.com/emails') {
      return Response.json({ id: 'email_test_123' }, { status: emailStatus });
    }
    throw new Error(`Unexpected fetch URL: ${url}`);
  };
}

async function run(body, fetchImpl, { headers, method } = {}) {
  const res = response();
  globalThis.fetch = fetchImpl;
  await handler(request(body, headers, method), res);
  return res;
}

try {
  configure();
  const calls = [];
  const successFetch = makeFetch();
  const success = await run(validPayload(), async (url, options) => {
    calls.push({ url, options });
    return successFetch(url, options);
  });
  assert.equal(success.statusCode, 200);
  assert.equal(success.body.ok, true);
  assert.equal(success.body.saved, true);
  assert.equal(success.body.notified, true);
  assert.match(success.body.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(success.getHeader('x-request-id'), success.body.requestId);
  assert.equal(success.getHeader('cache-control'), 'no-store');
  assert.equal(calls.length, 3);

  const rateInput = JSON.parse(calls[0].options.body);
  assert.equal(rateInput.p_key_hashes.length, 3);
  assert.deepEqual(rateInput.p_limits, [5, 3, 2]);
  assert.deepEqual(rateInput.p_window_seconds, [900, 3600, 600]);
  assert.ok(rateInput.p_key_hashes.every((value) => /^[a-f0-9]{64}$/.test(value)));
  assert.equal(calls[0].options.body.includes('buyer@example.com'), false);
  assert.equal(calls[0].options.body.includes('192.0.2.'), false);

  const stored = JSON.parse(calls[1].options.body);
  assert.equal(stored.name, 'QA Buyer');
  assert.equal(Object.hasOwn(stored, 'website'), false, 'honeypot must never be written to inquiries');
  assert.equal(Object.hasOwn(stored, 'form_started_at'), false, 'timing signal must never be stored');
  assert.equal(calls[1].options.headers.apikey, 'service-role-test');
  assert.equal(JSON.parse(calls[2].options.body).html.includes(success.body.requestId), true);

  configure();
  let dbFailureCalls = 0;
  const dbFailureFetch = makeFetch({ dbStatus: 400 });
  const dbFailure = await run(validPayload(), async (url, options) => {
    dbFailureCalls += 1;
    return dbFailureFetch(url, options);
  });
  assert.equal(dbFailure.statusCode, 502);
  assert.equal(dbFailure.body.error, 'Failed to save inquiry. Please try again.');
  assert.equal(dbFailureCalls, 2, 'email must not send when storage fails');

  configure();
  let emailFailureCalls = 0;
  const emailFailureFetch = makeFetch({ emailStatus: 500 });
  const emailFailure = await run(validPayload(), async (url, options) => {
    emailFailureCalls += 1;
    return emailFailureFetch(url, options);
  });
  assert.equal(emailFailure.statusCode, 200);
  assert.equal(emailFailure.body.saved, true);
  assert.equal(emailFailure.body.notified, false);
  assert.equal(emailFailureCalls, 3);

  configure();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  let unconfiguredCalls = 0;
  const unconfigured = await run(validPayload(), async () => {
    unconfiguredCalls += 1;
    return new Response('', { status: 200 });
  });
  assert.equal(unconfigured.statusCode, 500);
  assert.equal(unconfiguredCalls, 0);

  configure();
  let botCalls = 0;
  const bot = await run(validPayload({ website: 'https://spam.example' }), async () => {
    botCalls += 1;
    return new Response('', { status: 200 });
  });
  assert.equal(bot.statusCode, 200);
  assert.equal(bot.body.saved, true);
  assert.equal(botCalls, 0);

  configure();
  let fastCalls = 0;
  const tooFast = await run(validPayload({ form_started_at: Date.now() - 100 }), async () => {
    fastCalls += 1;
    return new Response('', { status: 200 });
  });
  assert.equal(tooFast.statusCode, 200);
  assert.equal(tooFast.body.saved, true);
  assert.equal(fastCalls, 0);

  configure();
  let badOriginCalls = 0;
  const badOrigin = await run(validPayload(), async () => {
    badOriginCalls += 1;
    return new Response('', { status: 200 });
  }, { headers: { origin: 'https://attacker.example' } });
  assert.equal(badOrigin.statusCode, 403);
  assert.equal(badOriginCalls, 0);

  configure();
  let contentTypeCalls = 0;
  const badContentType = await run(validPayload(), async () => {
    contentTypeCalls += 1;
    return new Response('', { status: 200 });
  }, { headers: { 'content-type': 'text/plain' } });
  assert.equal(badContentType.statusCode, 415);
  assert.equal(contentTypeCalls, 0);

  configure();
  let rateLimitedCalls = 0;
  const blockedFetch = makeFetch({ rateAllowed: false });
  const blocked = await run(validPayload(), async (url, options) => {
    rateLimitedCalls += 1;
    return blockedFetch(url, options);
  });
  assert.equal(blocked.statusCode, 429);
  assert.equal(blocked.body.retryAfterSeconds, 300);
  assert.equal(blocked.getHeader('retry-after'), '300');
  assert.equal(rateLimitedCalls, 1, 'blocked requests must not reach inquiry storage or email');

  configure();
  let unavailableCalls = 0;
  const unavailableFetch = makeFetch({ rateStatus: 500 });
  const unavailable = await run(validPayload(), async (url, options) => {
    unavailableCalls += 1;
    return unavailableFetch(url, options);
  });
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailableCalls, 1);

  const events = new Set(structuredLogs.map((entry) => entry.event));
  for (const expected of [
    'inquiry.request.started',
    'inquiry.request.completed',
    'inquiry.rate_limit.allowed',
    'inquiry.rate_limit.blocked',
    'inquiry.database.insert_started',
    'inquiry.database.insert_succeeded',
    'inquiry.database.insert_failed',
    'inquiry.email.send_started',
    'inquiry.email.send_succeeded',
    'inquiry.email.send_failed',
    'inquiry.antispam.filtered',
  ]) {
    assert.equal(events.has(expected), true, `missing structured log event: ${expected}`);
  }
  const serializedLogs = JSON.stringify(structuredLogs);
  assert.equal(serializedLogs.includes('buyer@example.com'), false, 'logs must not include raw email');
  assert.equal(serializedLogs.includes('192.0.2.'), false, 'logs must not include raw IP');
  assert.equal(serializedLogs.includes('private-label accessory project'), false, 'logs must not include inquiry text');
} finally {
  globalThis.fetch = originalFetch;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
}

console.log('Inquiry API anti-spam, distributed rate-limit, request ID, and logging tests passed');
