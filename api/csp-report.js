import { randomUUID } from 'node:crypto';

const ROUTE = '/api/csp-report';
const MAX_BODY = 32 * 1024;

function header(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : String(value ?? '').trim();
}

function safeText(value, max = 160) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}

function safeUrl(value) {
  const text = safeText(value, 1000);
  if (!text) return undefined;
  if (['inline', 'eval', 'data', 'blob'].includes(text)) return text;
  try {
    const parsed = new URL(text, 'https://wincomehair.com');
    return `${parsed.origin}${parsed.pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

async function body(req) {
  if (req.body !== undefined && req.body !== null) {
    const size = Buffer.byteLength(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    if (size > MAX_BODY) throw Object.assign(new Error('too_large'), { statusCode: 413 });
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('too_large'), { statusCode: 413 }));
        req.destroy?.();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

function normalizeReports(payload) {
  const reports = Array.isArray(payload) ? payload : [payload];
  return reports.slice(0, 20).map((entry) => entry?.['csp-report'] || entry?.body || entry || {});
}

export default async function handler(req, res) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  res.setHeader?.('X-Request-ID', requestId);
  res.setHeader?.('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader?.('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed', requestId });
  }

  const contentType = header(req, 'content-type').toLowerCase();
  const allowedType = contentType.startsWith('application/csp-report')
    || contentType.startsWith('application/reports+json')
    || contentType.startsWith('application/json');
  if (!allowedType) {
    return res.status(415).json({ error: 'Unsupported report type', requestId });
  }

  let payload;
  try {
    payload = await body(req);
  } catch (error) {
    return res.status(error?.statusCode === 413 ? 413 : 400).json({
      error: error?.statusCode === 413 ? 'Report too large' : 'Invalid report',
      requestId,
    });
  }

  for (const report of normalizeReports(payload)) {
    console.warn(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'warn',
      service: 'csp-report',
      event: 'csp.violation.reported',
      requestId,
      route: ROUTE,
      documentUrl: safeUrl(report['document-uri'] || report.documentURL),
      blockedUrl: safeUrl(report['blocked-uri'] || report.blockedURL),
      effectiveDirective: safeText(report['effective-directive'] || report.effectiveDirective, 100),
      violatedDirective: safeText(report['violated-directive'] || report.violatedDirective, 160),
      sourceFile: safeUrl(report['source-file'] || report.sourceFile),
      statusCode: Number(report['status-code'] || report.statusCode) || undefined,
      disposition: safeText(report.disposition, 20) || 'report',
      durationMs: Date.now() - startedAt,
    }));
  }

  return res.status(204).end();
}
