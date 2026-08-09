// Vercel Serverless Function: inquiry intake
// Receives the raw form payload from the client, validates it, writes to
// Supabase via the service-role key (bypassing RLS), and sends a formatted
// email via Resend. This is the single write path — the client never touches
// Supabase directly.

const RESEND_URL = 'https://api.resend.com/emails';
const SUPABASE_REST = (url) => `${url}/rest/v1/inquiries`;
const MAX_BODY = 64 * 1024;

const PRODUCT_TYPES = {
  'claw-clips': 'Hair Claws & Clips',
  'headbands': 'Headbands',
  'scrunchies': 'Scrunchies & Hair Ties',
  'bows': 'Hair Bows & Ribbons',
  'pins': 'Hair Pins & Barrettes',
  'other': 'Multiple Types / Other',
};
const MATERIALS = {
  'acetate': 'Cellulose Acetate',
  'metal': 'Zinc Alloy / Metal',
  'silk': 'Mulberry Silk',
  'satin': 'Premium Satin',
  'cotton': 'Organic Cotton',
  'velvet': 'Velvet',
  'not-sure': 'Not Sure — Need Recommendation',
};
const LOGO_PLACEMENTS = {
  'center': 'Product Center',
  'side': 'Side / Edge',
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

// --- In-memory rate limiter (best-effort; Vercel may run multiple instances) ---
const rateLimitStore = new Map();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX = 5;

function rateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimitStore.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_MAX) {
    if (rateLimitStore.size > 5000) rateLimitStore.clear();
    return true;
  }
  return false;
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Attribute-safe escaping for href="mailto:..." values (quotes are the risk).
function escAttr(s) {
  return escHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fieldRow(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;white-space:nowrap;vertical-align:top">${escHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#1a2b3c;vertical-align:top">${escHtml(value)}</td></tr>`;
}

function validEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
}

function clean(str, max) {
  return String(str ?? '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Rate limit by client IP ---
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Notification service not configured.' });
  }

  if (req.headers['content-length'] && Number(req.headers['content-length']) > MAX_BODY) {
    return res.status(413).json({ error: 'Payload too large.' });
  }

  let payload = {};
  try {
    payload = req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // Accept both legacy `{record:{...}}` shape and flat `{name, email, ...}` shape.
  const raw = payload.record || payload;

  // --- Honeypot: silently drop bots ---
  if (clean(raw.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  // --- Field validation ---
  const name = clean(raw.name, 120);
  const email = clean(raw.email, 254);
  const company = clean(raw.company, 150);
  const phone = clean(raw.phone, 60);
  const quantity = clean(raw.quantity, 60);
  const dimensions = clean(raw.dimensions, 80);
  const message = clean(raw.message, 3000);
  const targetMarket = clean(raw.target_market || raw.targetMarket, 60);
  const timeline = clean(raw.timeline, 80);

  if (!validEmail(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const productType = PRODUCT_TYPES[raw.product_type || raw.productType] || clean(raw.product_type || raw.productType || '', 100) || '—';
  const material = MATERIALS[raw.material] || clean(raw.material || '', 100) || '—';
  const logoPlacement = LOGO_PLACEMENTS[raw.logo_placement || raw.logoPlacement] || clean(raw.logo_placement || raw.logoPlacement || '', 100) || '—';
  const market = MARKETS[targetMarket] || targetMarket || '—';
  const leadTime = TIMELINES[timeline] || timeline || '—';
  const createdAt = new Date().toISOString();

  // --- Write to Supabase via service-role key (bypasses RLS, no anon INSERT needed) ---
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const dbRecord = {
        name, email,
        company: company || null,
        phone: phone || null,
        product_type: clean(raw.product_type || raw.productType || '', 60) || null,
        quantity: quantity || null,
        material: clean(raw.material || '', 60) || null,
        logo_placement: clean(raw.logo_placement || raw.logoPlacement || '', 60) || null,
        target_market: targetMarket || null,
        timeline: timeline || null,
        dimensions: dimensions || null,
        message: message || null,
        website: clean(raw.website || '', 200) || null,
      };
      const dbResp = await fetch(SUPABASE_REST(supabaseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(dbRecord),
      });
      if (!dbResp.ok) {
        const dbErr = await dbResp.text();
        console.error('Supabase insert error', dbResp.status, dbErr.slice(0, 300));
        return res.status(502).json({ error: 'Failed to save inquiry. Please try again.' });
      }
    } catch (dbEx) {
      console.error('Supabase insert exception', dbEx);
      return res.status(500).json({ error: 'Internal error saving inquiry.' });
    }
  }

  // Use the verified Resend sender domain when available; fall back to the
  // Resend shared domain until wincomehair.com is verified in Resend.
  const from = process.env.NOTIFY_FROM || 'WINCOME Inquiries <onboarding@resend.dev>';
  // NOTIFY_EMAIL must be set in Vercel env vars; no hardcoded fallback.
  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.warn('NOTIFY_EMAIL env var not set — skipping email notification');
    return res.status(200).json({ ok: true });
  }

  const subject = `[New Inquiry] ${name} — ${productType} (${quantity || '?'})`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#1a2b3c;padding:20px 24px">
        <h1 style="margin:0;color:#fff;font-size:20px">New Inquiry Received</h1>
        <p style="margin:4px 0 0;color:#c5a059;font-size:12px">${escHtml(createdAt)} · via wincomehair.com</p>
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
        Reply to this customer directly at <a href="mailto:${escAttr(email)}">${escHtml(email)}</a>.
        <br/>Recommendation: respond within 24 hours for the highest conversion rate.
      </p>
    </div>
  `;

  try {
    const resp = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Resend error', resp.status, errText.slice(0, 300));
      return res.status(502).json({ error: 'Email send failed' });
    }

    // Never leak the internal recipient address to the browser.
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Notify function error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
