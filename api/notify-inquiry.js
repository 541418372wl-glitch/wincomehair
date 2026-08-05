// Vercel Serverless Function: inquiry notification
// Triggered by Supabase Database Webhook on inquiries INSERT.
// Sends a formatted email via Resend to the business owner.

const RESEND_URL = 'https://api.resend.com/emails';
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

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fieldRow(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#1a2b3c;vertical-align:top">${esc(value)}</td></tr>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL || '541418372wl@gmail.com';
  const from = process.env.NOTIFY_FROM || 'WINCOME Inquiries <onboarding@resend.dev>';

  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  let payload;
  try {
    payload = req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const record = payload.record || {};
  if (!record.email) {
    return res.status(200).json({ ok: true, skipped: 'no record' });
  }

  const productType = PRODUCT_TYPES[record.product_type] || record.product_type || '—';
  const material = MATERIALS[record.material] || record.material || '—';
  const logoPlacement = LOGO_PLACEMENTS[record.logo_placement] || record.logo_placement || '—';
  const createdAt = record.created_at || new Date().toISOString();

  const subject = `[New Inquiry] ${record.name || '?'} — ${productType} (${record.quantity || '?'})`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#1a2b3c;padding:20px 24px">
        <h1 style="margin:0;color:#fff;font-size:20px">New Inquiry Received</h1>
        <p style="margin:4px 0 0;color:#c5a059;font-size:12px">${esc(createdAt)} · via wincomeshair.com</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:none">
        ${fieldRow('Name', record.name)}
        ${fieldRow('Company', record.company)}
        ${fieldRow('Email', record.email)}
        ${fieldRow('Phone / WhatsApp', record.phone)}
        ${fieldRow('Product Type', productType)}
        ${fieldRow('Quantity', record.quantity)}
        ${fieldRow('Material', material)}
        ${fieldRow('Logo Placement', logoPlacement)}
        ${fieldRow('Dimensions', record.dimensions)}
        ${fieldRow('Message', record.message)}
      </table>
      <p style="font-size:12px;color:#999;margin-top:16px">
        Reply to this customer directly at <a href="mailto:${esc(record.email)}">${esc(record.email)}</a>.
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
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Resend error', resp.status, errText);
      return res.status(502).json({ error: 'Email send failed', detail: errText.slice(0, 300) });
    }

    return res.status(200).json({ ok: true, to });
  } catch (err) {
    console.error('Notify function error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
