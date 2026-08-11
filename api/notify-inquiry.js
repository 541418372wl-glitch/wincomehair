// Vercel Serverless Function: inquiry intake.
// The server is the only database write path. A request is successful only
// after Supabase confirms the inquiry was stored; email is a notification,
// not the source of truth.

const RESEND_URL = 'https://api.resend.com/emails';
const MAX_BODY = 64 * 1024;

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
  'not-sure': 'Not Sure — Need Recommendation',
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

// Best-effort instance-local protection. Vercel Firewall should be used for
// stronger distributed rate limiting if abuse becomes material.
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

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function validEmail(value) {
  return typeof value === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    && value.length <= 254;
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

function getBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined && req.body !== null) {
      resolve(req.body);
      return;
    }

    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  if (req.headers['content-length'] && Number(req.headers['content-length']) > MAX_BODY) {
    return res.status(413).json({ error: 'Payload too large.' });
  }

  let payload;
  try {
    payload = await getBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // Accept the current flat payload and the legacy webhook-style shape.
  const raw = payload.record || payload;

  // Honeypot: bots receive a neutral response but create no row or email.
  if (clean(raw.website, 200)) {
    return res.status(200).json({ ok: true });
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

  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const supabaseUrl = clean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, 500).replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Inquiry storage is not configured');
    return res.status(500).json({ error: 'Inquiry service is temporarily unavailable.' });
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
      const detail = await dbResponse.text();
      console.error('Supabase insert error', dbResponse.status, detail.slice(0, 300));
      return res.status(502).json({ error: 'Failed to save inquiry. Please try again.' });
    }
  } catch (error) {
    console.error('Supabase insert exception', error);
    return res.status(502).json({ error: 'Failed to save inquiry. Please try again.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.warn('Inquiry saved, but email notification is not configured');
    return res.status(200).json({ ok: true, saved: true, notified: false });
  }

  const productType = PRODUCT_TYPES[productTypeValue] || productTypeValue || '—';
  const material = MATERIALS[materialValue] || materialValue || '—';
  const logoPlacement = LOGO_PLACEMENTS[logoPlacementValue] || logoPlacementValue || '—';
  const market = MARKETS[targetMarket] || targetMarket || '—';
  const leadTime = TIMELINES[timeline] || timeline || '—';
  const createdAt = new Date().toISOString();
  const from = process.env.NOTIFY_FROM || 'WINCOME Inquiries <onboarding@resend.dev>';
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
        Reply directly at <a href="mailto:${escAttr(email)}">${escHtml(email)}</a>.
        Respond within 24 hours for highest conversion.
      </p>
    </div>
  `;

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
      const detail = await emailResponse.text();
      console.error('Resend error', emailResponse.status, detail.slice(0, 300));
      return res.status(200).json({ ok: true, saved: true, notified: false });
    }
  } catch (error) {
    console.error('Resend exception', error);
    return res.status(200).json({ ok: true, saved: true, notified: false });
  }

  return res.status(200).json({ ok: true, saved: true, notified: true });
}
