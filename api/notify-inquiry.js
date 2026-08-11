import { createHmac, randomUUID } from 'node:crypto';

// Vercel Serverless Function: inquiry intake.
// The server is the only database write path. A request is successful only
// after Supabase confirms the inquiry was stored; email is a notification,
// not the source of truth.

const ROUTE = '/api/notify-inquiry';
const RESEND_URL = 'https://api.resend.com/emails';
const MAX_BODY = 64 * 1024;
const MIN_FORM_FILL_MS = 2_000;
const MAX_URLS = 3;

const RATE_LIMITS = {
  ip: { limit: 5, windowSeconds: 15 * 60 },
  email: { limit: 3, windowSeconds: 60 * 60 },
  content: { limit: 2, windowSeconds: 10 * 60 },
};

const PRODUCT_TYPES = {
  'claw-clips': 'Hair Claws & Clips',
  headbands: 'Headbands',
  scrunchies: 'Scrunchies & Hair Ties',
  bows: 'Hair Bows & Ribbons',
  pins: 'Hair Pins & Barrettes',
  other: 'Multiple Types / Other',
};
const MATERIALS = {
  acetate: 'Cellulose Acetate',
  metal: 'Zinc Alloy / Metal',
  silk: 'Mulberry Silk',
  satin: 'Premium Satin',
  cotton: 'Organic Cotton',
  velvet: 'Velvet',
  'not-sure': 'Not Sure - Need Recommendation',
};
const LOGO_PLACEMENTS = {
  center: 'Product Center',
  side: 'Side / Edge',
  'all-over': 'All-Over Print',
  'packaging-only': 'Packaging Only',
  'no-logo': 'No Logo',
};
const MARKETS = {
  'North America': 'North America',
  'Europe / UK': 'Europe / UK',
  'Australia / NZ': 'Australia / NZ',
  'Middle East': 'Middle East',
  'Southeast Asia': 'Southeast Asia',
  'Latin America': 'Latin America',
  'Other / Global': 'Other / Global',
};
const TIMELINES = {
  'ASAP (within 2 weeks)': 'ASAP (within 2 weeks)',
  '1 month': '1 month',
  '2-3 months': '2-3 months',
  'Just planning / researching': 'Just planning / researching',
};

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
    method: req.method,
    vercelRequestId: getHeader(req, 'x-vercel-id') || undefined,
  };
}

function responder(req, res, requestId, startedAt) {
  const base = requestContext(req, requestId);
  if (typeof res.setHeader === 'function') {
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('Cache-Control', 'no-store');
  }

  return (status, body, outcome, extra = {}) => {
    writeLog(status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info', 'inquiry.request.completed', {
      ...base,
      status,
      outcome,
      durationMs: Date.now() - startedAt,
      ...extra,
    });
    return res.status(status).json({ ...body, requestId });
  };
}

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function validEmail(value) {
  return typeof value === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    && value.length <= 254;
}

function hasControlCharacters(value) {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function countUrls(value) {
  return (String(value ?? '').match(/(?:https?:\/\/|www\.)/gi) || []).length;
}

function escHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(value) {
  return escHtml(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fieldRow(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;white-space:nowrap;vertical-align:top">${escHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#1a2b3c;vertical-align:top">${escHtml(value)}</td></tr>`;
}

function isAllowedOrigin(req) {
  const origin = getHeader(req, 'origin');
  if (!origin) return true;

  try {
    const parsed = new URL(origin);
    const requestHost = (getHeader(req, 'x-forwarded-host') || getHeader(req, 'host')).toLowerCase();
    const configuredHost = String(process.env.VERCEL_URL || '').toLowerCase();
    const productionHosts = new Set(['wincomehair.com', 'www.wincomehair.com']);

    if (parsed.protocol === 'https:' && productionHosts.has(parsed.host.toLowerCase())) return true;
    if (parsed.protocol === 'https:' && configuredHost && parsed.host.toLowerCase() === configuredHost) return true;
    if (parsed.protocol === 'https:' && requestHost && parsed.host.toLowerCase() === requestHost) return true;
    return process.env.NODE_ENV !== 'production'
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

function keyedHash(secret, scope, value) {
  return createHmac('sha256', secret)
    .update(`wincome-inquiry:${scope}:${value}`)
    .digest('hex');
}

function getClientIdentity(req) {
  const forwarded = getHeader(req, 'x-forwarded-for').split(',')[0].trim();
  if (forwarded) return forwarded;
  const realIp = getHeader(req, 'x-real-ip');
  if (realIp) return realIp;
  return `fallback:${getHeader(req, 'user-agent')}:${getHeader(req, 'accept-language')}`;
}

function buildRateRules(req, serviceKey, email, productType, quantity, company, message) {
  const rules = [
    {
      scope: 'ip',
      keyHash: keyedHash(serviceKey, 'ip', getClientIdentity(req)),
      ...RATE_LIMITS.ip,
    },
    {
      scope: 'email',
      keyHash: keyedHash(serviceKey, 'email', email.toLowerCase()),
      ...RATE_LIMITS.email,
    },
  ];

  const normalizedMessage = message.toLowerCase().replace(/\s+/g, ' ').trim();
  if (normalizedMessage.length >= 20) {
    const duplicateFingerprint = [normalizedMessage, productType, quantity, company.toLowerCase()].join('|');
    rules.push({
      scope: 'content',
      keyHash: keyedHash(serviceKey, 'content', duplicateFingerprint),
      ...RATE_LIMITS.content,
    });
  }
  return rules;
}

async function consumeRateLimits({ req, requestId, supabaseUrl, serviceKey, rules }) {
  const startedAt = Date.now();
  const context = requestContext(req, requestId);
  writeLog('info', 'inquiry.rate_limit.started', {
    ...context,
    scopes: rules.map((rule) => rule.scope),
  });

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/consume_inquiry_rate_limits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        p_key_hashes: rules.map((rule) => rule.keyHash),
        p_limits: rules.map((rule) => rule.limit),
        p_window_seconds: rules.map((rule) => rule.windowSeconds),
      }),
    });

    if (!response.ok) {
      writeLog('error', 'inquiry.rate_limit.failed', {
        ...context,
        provider: 'supabase',
        providerStatus: response.status,
        durationMs: Date.now() - startedAt,
      });
      return { ok: false };
    }

    const result = await response.json().catch(() => null);
    if (!Array.isArray(result) || result.length !== rules.length) {
      writeLog('error', 'inquiry.rate_limit.failed', {
        ...context,
        provider: 'supabase',
        reason: 'invalid_response',
        durationMs: Date.now() - startedAt,
      });
      return { ok: false };
    }

    const scopeByHash = new Map(rules.map((rule) => [rule.keyHash, rule.scope]));
    const normalized = result.map((entry) => ({
      scope: scopeByHash.get(entry.key_hash) || 'unknown',
      keyId: String(entry.key_hash || '').slice(0, 12),
      currentCount: Number(entry.current_count),
      limit: Number(entry.max_requests),
      allowed: entry.allowed === true,
      retryAfterSeconds: Math.max(1, Number(entry.retry_after_seconds) || 1),
    }));
    const blocked = normalized.filter((entry) => !entry.allowed);

    writeLog(blocked.length ? 'warn' : 'info', blocked.length ? 'inquiry.rate_limit.blocked' : 'inquiry.rate_limit.allowed', {
      ...context,
      checks: normalized,
      durationMs: Date.now() - startedAt,
    });
    return {
      ok: true,
      allowed: blocked.length === 0,
      retryAfterSeconds: blocked.length
        ? Math.max(...blocked.map((entry) => entry.retryAfterSeconds))
        : 0,
    };
  } catch (error) {
    writeLog('error', 'inquiry.rate_limit.failed', {
      ...context,
      provider: 'supabase',
      errorType: error instanceof Error ? error.name : 'UnknownError',
      durationMs: Date.now() - startedAt,
    });
    return { ok: false };
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

  const contentType = getHeader(req, 'content-type').toLowerCase();
  if (!contentType.startsWith('application/json')) {
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
    return send(
      status,
      { error: status === 413 ? 'Payload too large.' : 'Invalid payload' },
      status === 413 ? 'payload_too_large' : 'invalid_json',
    );
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return send(400, { error: 'Invalid payload' }, 'invalid_payload');
  }

  // Accept the current flat payload and the legacy webhook-style shape.
  const raw = payload.record || payload;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return send(400, { error: 'Invalid payload' }, 'invalid_payload');
  }

  // Honeypot and implausibly fast submissions receive a neutral response and
  // create no database row or email, so automated clients get no useful signal.
  const honeypot = clean(raw.website, 200);
  const formStartedAt = Number(raw.form_started_at || raw.formStartedAt);
  const fillDurationMs = Number.isFinite(formStartedAt) ? Date.now() - formStartedAt : null;
  const tooFast = fillDurationMs !== null && (fillDurationMs < MIN_FORM_FILL_MS || fillDurationMs > 24 * 60 * 60 * 1000);
  if (honeypot || tooFast) {
    writeLog('warn', 'inquiry.antispam.filtered', {
      ...context,
      reason: honeypot ? 'honeypot' : 'implausible_fill_time',
      fillDurationMs: tooFast ? fillDurationMs : undefined,
    });
    return send(200, { ok: true, saved: true, notified: false }, 'spam_filtered');
  }

  const name = clean(raw.name, 120);
  const email = clean(raw.email, 254);
  const company = clean(raw.company, 150);
  const phone = clean(raw.phone, 60);
  const productTypeValue = clean(raw.product_type || raw.productType, 60);
  const quantity = clean(raw.quantity, 60);
  const materialValue = clean(raw.material, 60);
  const logoPlacementValue = clean(raw.logo_placement || raw.logoPlacement, 60);
  const targetMarket = clean(raw.target_market || raw.targetMarket, 60);
  const timeline = clean(raw.timeline, 80);
  const dimensions = clean(raw.dimensions, 80);
  const message = clean(raw.message, 3000);
  const fields = [name, email, company, phone, productTypeValue, quantity, materialValue, logoPlacementValue, targetMarket, timeline, dimensions, message];

  if (fields.some(hasControlCharacters)) {
    return send(400, { error: 'Invalid characters in payload.' }, 'invalid_characters');
  }
  if (fields.reduce((total, value) => total + countUrls(value), 0) > MAX_URLS) {
    writeLog('warn', 'inquiry.antispam.filtered', { ...context, reason: 'excessive_urls' });
    return send(200, { ok: true, saved: true, notified: false }, 'spam_filtered');
  }
  if (!name) {
    return send(400, { error: 'Name is required.' }, 'validation_failed');
  }
  if (!validEmail(email)) {
    return send(400, { error: 'A valid email is required.' }, 'validation_failed');
  }

  const supabaseUrl = clean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, 500).replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    writeLog('error', 'inquiry.database.unconfigured', context);
    return send(500, { error: 'Inquiry service is temporarily unavailable.' }, 'database_unconfigured');
  }

  const rules = buildRateRules(req, serviceKey, email, productTypeValue, quantity, company, message);
  const emailId = keyedHash(serviceKey, 'email-log', email.toLowerCase()).slice(0, 12);
  const rateLimit = await consumeRateLimits({ req, requestId, supabaseUrl, serviceKey, rules });
  if (!rateLimit.ok) {
    return send(503, { error: 'Inquiry service is temporarily unavailable.' }, 'rate_limit_unavailable');
  }
  if (!rateLimit.allowed) {
    res.setHeader?.('Retry-After', String(rateLimit.retryAfterSeconds));
    return send(
      429,
      { error: 'Too many requests, please try again later.', retryAfterSeconds: rateLimit.retryAfterSeconds },
      'rate_limited',
      { emailId },
    );
  }

  const dbRecord = {
    name,
    email,
    company: company || null,
    phone: phone || null,
    product_type: productTypeValue || null,
    quantity: quantity || null,
    material: materialValue || null,
    logo_placement: logoPlacementValue || null,
    target_market: targetMarket || null,
    timeline: timeline || null,
    dimensions: dimensions || null,
    message: message || null,
  };

  const dbStartedAt = Date.now();
  writeLog('info', 'inquiry.database.insert_started', { ...context, provider: 'supabase', emailId });
  try {
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(dbRecord),
    });

    if (!dbResponse.ok) {
      writeLog('error', 'inquiry.database.insert_failed', {
        ...context,
        provider: 'supabase',
        providerStatus: dbResponse.status,
        emailId,
        durationMs: Date.now() - dbStartedAt,
      });
      return send(502, { error: 'Failed to save inquiry. Please try again.' }, 'database_failed', { emailId });
    }
    writeLog('info', 'inquiry.database.insert_succeeded', {
      ...context,
      provider: 'supabase',
      emailId,
      durationMs: Date.now() - dbStartedAt,
    });
  } catch (error) {
    writeLog('error', 'inquiry.database.insert_failed', {
      ...context,
      provider: 'supabase',
      errorType: error instanceof Error ? error.name : 'UnknownError',
      emailId,
      durationMs: Date.now() - dbStartedAt,
    });
    return send(502, { error: 'Failed to save inquiry. Please try again.' }, 'database_failed', { emailId });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) {
    writeLog('warn', 'inquiry.email.skipped', {
      ...context,
      provider: 'resend',
      reason: 'not_configured',
      emailId,
    });
    return send(200, { ok: true, saved: true, notified: false }, 'saved_email_skipped', { emailId });
  }

  const productType = PRODUCT_TYPES[productTypeValue] || productTypeValue || '-';
  const material = MATERIALS[materialValue] || materialValue || '-';
  const logoPlacement = LOGO_PLACEMENTS[logoPlacementValue] || logoPlacementValue || '-';
  const market = MARKETS[targetMarket] || targetMarket || '-';
  const leadTime = TIMELINES[timeline] || timeline || '-';
  const createdAt = new Date().toISOString();
  const from = process.env.NOTIFY_FROM || 'WINCOME Inquiries <onboarding@resend.dev>';
  const subject = `[New Inquiry] ${name} - ${productType} (${quantity || '?'})`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#1a2b3c;padding:20px 24px">
        <h1 style="margin:0;color:#fff;font-size:20px">New Inquiry Received</h1>
        <p style="margin:4px 0 0;color:#c5a059;font-size:12px">${escHtml(createdAt)} - via wincomehair.com - Request ${escHtml(requestId)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:none">
        ${fieldRow('Name', name)}
        ${fieldRow('Company', company)}
        ${fieldRow('Email', email)}
        ${fieldRow('Phone / WhatsApp', phone)}
        ${fieldRow('Product Type', productType)}
        ${fieldRow('Quantity', quantity)}
        ${fieldRow('Material', material)}
        ${fieldRow('Logo Placement', logoPlacement)}
        ${fieldRow('Target Market', market)}
        ${fieldRow('Expected Lead Time', leadTime)}
        ${fieldRow('Dimensions', dimensions)}
        ${fieldRow('Message', message)}
      </table>
      <p style="font-size:12px;color:#999;margin-top:16px">
        Reply directly at <a href="mailto:${escAttr(email)}">${escHtml(email)}</a>.
        Respond within 24 hours for highest conversion.
      </p>
    </div>
  `;

  const emailStartedAt = Date.now();
  writeLog('info', 'inquiry.email.send_started', { ...context, provider: 'resend', emailId });
  try {
    const emailResponse = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, reply_to: email, subject, html }),
    });

    if (!emailResponse.ok) {
      writeLog('error', 'inquiry.email.send_failed', {
        ...context,
        provider: 'resend',
        providerStatus: emailResponse.status,
        emailId,
        durationMs: Date.now() - emailStartedAt,
      });
      return send(200, { ok: true, saved: true, notified: false }, 'saved_email_failed', { emailId });
    }

    const emailResult = await emailResponse.json().catch(() => ({}));
    writeLog('info', 'inquiry.email.send_succeeded', {
      ...context,
      provider: 'resend',
      messageId: clean(emailResult?.id, 120) || undefined,
      emailId,
      durationMs: Date.now() - emailStartedAt,
    });
  } catch (error) {
    writeLog('error', 'inquiry.email.send_failed', {
      ...context,
      provider: 'resend',
      errorType: error instanceof Error ? error.name : 'UnknownError',
      emailId,
      durationMs: Date.now() - emailStartedAt,
    });
    return send(200, { ok: true, saved: true, notified: false }, 'saved_email_failed', { emailId });
  }

  return send(200, { ok: true, saved: true, notified: true }, 'saved_and_notified', { emailId });
}
