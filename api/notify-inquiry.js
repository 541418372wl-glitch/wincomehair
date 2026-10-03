import { randomUUID } from 'node:crypto';

// The same-origin API validates every Turnstile token before forwarding a form.
// Formspark's HTTP acknowledgement confirms acceptance, not archive or delivery.
const ROUTE = '/api/notify-inquiry';
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const PRODUCTION_HOSTS = new Set(['wincomehair.com', 'www.wincomehair.com']);
const NON_SUBMISSION_FORM_IDS = new Set(['echo', 'your-form-id', 'your-formspark-form-id']);
const TURNSTILE_TEST_SECRETS = new Set([
  '1x0000000000000000000000000000000AA',
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
]);
const MAX_BODY = 64 * 1024;
const MIN_FORM_FILL_MS = 2_000;
const MAX_URLS = 3;
// Two sequential requests fit within the function's 30-second duration.
// Neither verification nor submission is automatically retried.
const PROVIDER_TIMEOUT_MS = 8_000;

function getHeader(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : String(value ?? '').trim();
}

function writeLog(level, event, context = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'inquiry-api',
    event,
    ...context,
  };
  const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info';
  console[method](JSON.stringify(entry));
}

function requestContext(req, requestId) {
  return {
    requestId,
    route: ROUTE,
    method: ['POST', 'GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
      ? req.method : 'OTHER',
  };
}

function errorType(error) {
  return ['TimeoutError', 'AbortError', 'TypeError', 'SyntaxError'].includes(error?.name)
    ? error.name : 'Error';
}

function responder(req, res, requestId, startedAt) {
  const base = requestContext(req, requestId);
  res.setHeader?.('X-Request-ID', requestId);
  res.setHeader?.('Cache-Control', 'no-store');

  return (status, body, outcome) => {
    writeLog(status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info', 'inquiry.request.completed', {
      ...base,
      status,
      outcome,
      durationMs: Date.now() - startedAt,
    });
    return res.status(status).json({
      ok: false,
      accepted: false,
      submissionStatus: 'rejected',
      ...body,
      requestId,
    });
  };
}

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

function hasControlCharacters(value) {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function countUrls(value) {
  return (String(value ?? '').match(/(?:https?:\/\/|www\.)/gi) || []).length;
}

function isAllowedOrigin(req) {
  const origin = getHeader(req, 'origin');
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    if (parsed.protocol === 'https:' && PRODUCTION_HOSTS.has(parsed.host)) return true;
    // Host and forwarded-host are caller input, never an origin allowlist.
    return process.env.NODE_ENV !== 'production'
      && process.env.VERCEL_ENV !== 'production'
      && parsed.protocol === 'http:'
      && ['localhost', '127.0.0.1'].includes(parsed.hostname);
  } catch {
    return false;
  }
}

async function getBody(req) {
  if (req.body !== undefined && req.body !== null) {
    const size = Buffer.byteLength(
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      'utf8',
    );
    if (size > MAX_BODY) throw Object.assign(new Error('Payload too large'), { statusCode: 413 });
    if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
    return req.body;
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy?.();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text ? JSON.parse(text) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function isJsonResponse(response) {
  return response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() === 'application/json';
}

async function verifyTurnstile({ token, secret, context }) {
  const startedAt = Date.now();
  writeLog('info', 'inquiry.verification.started', context);
  try {
    const response = await fetch(TURNSTILE_URL, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // Do not send customer fields or an untrusted forwarded IP to Siteverify.
      body: JSON.stringify({ secret, response: token }),
    });
    if (!response.ok || !isJsonResponse(response)) {
      writeLog('error', 'inquiry.verification.unavailable', {
        ...context, providerStatus: response.status, durationMs: Date.now() - startedAt,
      });
      return { available: false };
    }
    const result = await response.json();
    if (!result || typeof result !== 'object' || Array.isArray(result)
      || typeof result.success !== 'boolean') {
      writeLog('error', 'inquiry.verification.unavailable', {
        ...context, reason: 'invalid_response', durationMs: Date.now() - startedAt,
      });
      return { available: false };
    }
    // Cloudflare enforces five-minute expiry and single-use tokens. Never cache
    // success or treat a replay as valid, even for a repeated browser request.
    const allowed = result.success === true
      && PRODUCTION_HOSTS.has(result.hostname)
      && result.action === 'inquiry';
    writeLog(allowed ? 'info' : 'warn', allowed ? 'inquiry.verification.allowed' : 'inquiry.verification.rejected', {
      ...context, durationMs: Date.now() - startedAt,
    });
    return { available: true, allowed };
  } catch (error) {
    writeLog('error', 'inquiry.verification.unavailable', {
      ...context, errorType: errorType(error), durationMs: Date.now() - startedAt,
    });
    return { available: false };
  }
}

export default async function handler(req, res) {
  const startedAt = Date.now();
  const requestId = randomUUID();
  const send = responder(req, res, requestId, startedAt);
  const context = requestContext(req, requestId);
  writeLog('info', 'inquiry.request.started', context);

  if (req.method !== 'POST') {
    res.setHeader?.('Allow', 'POST');
    return send(405, { error: 'Method not allowed' }, 'method_not_allowed');
  }
  // Reject inherited production credentials before contacting either provider.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return send(403, { error: 'Inquiry submission is only available on the production website.' }, 'non_production_rejected');
  }
  if (getHeader(req, 'content-type').toLowerCase().split(';')[0].trim() !== 'application/json') {
    return send(415, { error: 'Content-Type must be application/json.' }, 'unsupported_media_type');
  }
  if (!isAllowedOrigin(req)) {
    writeLog('warn', 'inquiry.antispam.filtered', { ...context, reason: 'origin_mismatch' });
    return send(403, { error: 'Request origin is not allowed.' }, 'origin_rejected');
  }
  if (getHeader(req, 'content-length') && Number(getHeader(req, 'content-length')) > MAX_BODY) {
    return send(413, { error: 'Payload too large.' }, 'payload_too_large');
  }

  let payload;
  try {
    payload = await getBody(req);
  } catch (error) {
    const status = error?.statusCode === 413 ? 413 : 400;
    return send(status, { error: status === 413 ? 'Payload too large.' : 'Invalid payload' },
      status === 413 ? 'payload_too_large' : 'invalid_json');
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return send(400, { error: 'Invalid payload' }, 'invalid_payload');
  }
  const raw = payload.record || payload;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return send(400, { error: 'Invalid payload' }, 'invalid_payload');
  }

  const honeypot = clean(raw.website, 200);
  const submittedFillDuration = Number(raw.form_fill_time_ms || raw.formFillTimeMs);
  const legacyFormStartedAt = Number(raw.form_started_at || raw.formStartedAt);
  const fillDurationMs = Number.isFinite(submittedFillDuration) && submittedFillDuration > 0
    ? submittedFillDuration
    : Number.isFinite(legacyFormStartedAt) && legacyFormStartedAt > 0
      ? Date.now() - legacyFormStartedAt : null;
  const tooFast = fillDurationMs !== null
    && (fillDurationMs < MIN_FORM_FILL_MS || fillDurationMs > 24 * 60 * 60 * 1000);
  if (honeypot || tooFast) {
    writeLog('warn', 'inquiry.antispam.filtered', {
      ...context, reason: honeypot ? 'honeypot' : 'implausible_fill_time',
    });
    return send(400, { error: 'Unable to accept this submission. Please contact us via WhatsApp.' }, 'spam_filtered');
  }

  const record = {
    name: clean(raw.name, 120),
    email: clean(raw.email, 254),
    company: clean(raw.company, 150),
    phone: clean(raw.phone, 60),
    product_type: clean(raw.product_type || raw.productType, 60),
    quantity: clean(raw.quantity, 60),
    material: clean(raw.material, 60),
    logo_placement: clean(raw.logo_placement || raw.logoPlacement, 60),
    target_market: clean(raw.target_market || raw.targetMarket, 60),
    timeline: clean(raw.timeline, 80),
    dimensions: clean(raw.dimensions, 80),
    message: clean(raw.message, 3000),
  };
  const fields = Object.values(record);
  if (fields.some(hasControlCharacters)) {
    return send(400, { error: 'Invalid characters in payload.' }, 'invalid_characters');
  }
  if (fields.reduce((total, value) => total + countUrls(value), 0) > MAX_URLS) {
    writeLog('warn', 'inquiry.antispam.filtered', { ...context, reason: 'excessive_urls' });
    return send(400, { error: 'Unable to accept this submission. Please contact us via WhatsApp.' }, 'spam_filtered');
  }
  if (!record.name) return send(400, { error: 'Name is required.' }, 'validation_failed');
  if (!validEmail(record.email)) return send(400, { error: 'A valid email is required.' }, 'validation_failed');

  const formId = String(process.env.FORMSPARK_FORM_ID || '').trim();
  const secret = String(process.env.TURNSTILE_SECRET_KEY || '').trim();
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(formId) || NON_SUBMISSION_FORM_IDS.has(formId.toLowerCase()) || !secret
    || (isProduction && TURNSTILE_TEST_SECRETS.has(secret))) {
    writeLog('error', 'inquiry.provider.unconfigured', context);
    return send(503, { error: 'Inquiry service is temporarily unavailable. Please contact us via WhatsApp.' }, 'provider_unconfigured');
  }

  const token = payload.turnstileToken;
  if (typeof token !== 'string' || !token.length || token.length > 2048
    || /\s/.test(token) || (isProduction && token === 'XXXX.DUMMY.TOKEN.XXXX')) {
    return send(400, { error: 'Please complete the security check before submitting.' }, 'invalid_verification_token');
  }
  const verification = await verifyTurnstile({ token, secret, context });
  if (!verification.available) {
    return send(503, { error: 'Security verification is temporarily unavailable. Please try the check again or contact us via WhatsApp.' }, 'verification_unavailable');
  }
  if (!verification.allowed) {
    return send(400, { error: 'Security verification failed. Please try the check again or contact us via WhatsApp.' }, 'verification_rejected');
  }

  const providerStartedAt = Date.now();
  writeLog('info', 'inquiry.submission.started', { ...context, provider: 'formspark' });
  try {
    const response = await fetch('https://submit-form.com/' + formId, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // Only explicitly allowed customer fields reach Formspark. The token has
      // already been consumed; Formspark's native captcha must remain disabled.
      body: JSON.stringify({
        ...record,
        request_reference: requestId,
        _email: { subject: 'New inquiry from wincomehair.com' },
      }),
    });
    if (!response.ok || !isJsonResponse(response)) {
      throw Object.assign(new Error('Unconfirmed provider response'), { providerStatus: response.status });
    }
    const result = await response.json();
    if (!result || typeof result !== 'object' || Array.isArray(result)
      || result.ok === false || result.success === false || result.accepted === false
      || result.error || (Array.isArray(result.errors) && result.errors.length)) {
      throw new Error('Unconfirmed provider response');
    }
    // A valid HTTP/JSON acknowledgement can still precede silent spam filtering.
    // Never claim a stored record, notification acceptance, or inbox delivery.
    writeLog('info', 'inquiry.submission.accepted', {
      ...context, provider: 'formspark', durationMs: Date.now() - providerStartedAt,
    });
    return send(200, { ok: true, accepted: true, submissionStatus: 'accepted' }, 'provider_accepted');
  } catch (error) {
    writeLog('error', 'inquiry.submission.unconfirmed', {
      ...context,
      provider: 'formspark',
      errorType: errorType(error),
      providerStatus: Number.isInteger(error?.providerStatus) ? error.providerStatus : undefined,
      durationMs: Date.now() - providerStartedAt,
    });
    return send(502, {
      error: 'We could not confirm whether your inquiry was received. Please contact us via WhatsApp before submitting again.',
      submissionStatus: 'unknown',
    }, 'provider_unconfirmed');
  }
}
