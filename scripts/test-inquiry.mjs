import assert from 'node:assert/strict';
import handler from '../api/notify-inquiry.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
let ipCounter = 10;

function request(body) {
  ipCounter += 1;
  return {
    method: 'POST',
    headers: { 'x-forwarded-for': `192.0.2.${ipCounter}` },
    body,
  };
}

function response() {
  return {
    statusCode: 200,
    body: undefined,
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
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test';
  process.env.RESEND_API_KEY = 'resend-test';
  process.env.NOTIFY_EMAIL = 'owner@example.com';
}

async function run(body, fetchImpl) {
  const res = response();
  globalThis.fetch = fetchImpl;
  await handler(request(body), res);
  return res;
}

try {
  configure();
  const calls = [];
  const success = await run(
    {
      name: 'QA Buyer',
      email: 'buyer@example.com',
      product_type: 'claw-clips',
      target_market: 'Europe / UK',
      website: '',
    },
    async (url, options) => {
      calls.push({ url, options });
      return new Response('', { status: url.includes('supabase.co') ? 201 : 200 });
    },
  );
  assert.equal(success.statusCode, 200);
  assert.deepEqual(success.body, { ok: true, saved: true, notified: true });
  assert.equal(calls.length, 2);
  const stored = JSON.parse(calls[0].options.body);
  assert.equal(stored.name, 'QA Buyer');
  assert.equal(Object.hasOwn(stored, 'website'), false, 'honeypot must never be written to inquiries');
  assert.equal(calls[0].options.headers.apikey, 'service-role-test');

  configure();
  let dbFailureCalls = 0;
  const dbFailure = await run(
    { name: 'QA Buyer', email: 'buyer@example.com' },
    async () => {
      dbFailureCalls += 1;
      return new Response('{"message":"bad schema"}', { status: 400 });
    },
  );
  assert.equal(dbFailure.statusCode, 502);
  assert.equal(dbFailure.body.error, 'Failed to save inquiry. Please try again.');
  assert.equal(dbFailureCalls, 1, 'email must not send when storage fails');

  configure();
  let emailFailureCalls = 0;
  const emailFailure = await run(
    { name: 'QA Buyer', email: 'buyer@example.com' },
    async (url) => {
      emailFailureCalls += 1;
      return new Response('', { status: url.includes('supabase.co') ? 201 : 500 });
    },
  );
  assert.equal(emailFailure.statusCode, 200);
  assert.deepEqual(emailFailure.body, { ok: true, saved: true, notified: false });
  assert.equal(emailFailureCalls, 2);

  configure();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  let unconfiguredCalls = 0;
  const unconfigured = await run(
    { name: 'QA Buyer', email: 'buyer@example.com' },
    async () => {
      unconfiguredCalls += 1;
      return new Response('', { status: 200 });
    },
  );
  assert.equal(unconfigured.statusCode, 500);
  assert.equal(unconfiguredCalls, 0);

  configure();
  let botCalls = 0;
  const bot = await run(
    { name: 'Bot', email: 'bot@example.com', website: 'https://spam.example' },
    async () => {
      botCalls += 1;
      return new Response('', { status: 200 });
    },
  );
  assert.equal(bot.statusCode, 200);
  assert.equal(botCalls, 0);

  console.log('Inquiry API regression tests passed');
} finally {
  globalThis.fetch = originalFetch;
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
}
