import assert from 'node:assert/strict';
import handler from '../api/csp-report.js';

const originalWarn = console.warn;
const logs = [];
console.warn = (line) => logs.push(JSON.parse(line));

function response() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: undefined,
    setHeader(name, value) { headers.set(name.toLowerCase(), String(value)); return this; },
    getHeader(name) { return headers.get(name.toLowerCase()); },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { return this; },
  };
}

try {
  const res = response();
  await handler({
    method: 'POST',
    headers: { 'content-type': 'application/csp-report' },
    body: {
      'csp-report': {
        'document-uri': 'https://wincomehair.com/contact?email=private@example.com',
        'blocked-uri': 'https://unexpected.example/script.js?token=secret',
        'effective-directive': 'script-src-elem',
        'violated-directive': "script-src 'self'",
        'source-file': 'https://wincomehair.com/assets/app.js?private=1',
        'script-sample': 'private user content',
        'status-code': 200,
        disposition: 'report',
      },
    },
  }, res);

  assert.equal(res.statusCode, 204);
  assert.match(res.getHeader('x-request-id'), /^[0-9a-f-]{36}$/);
  assert.equal(logs.length, 1);
  assert.equal(logs[0].event, 'csp.violation.reported');
  assert.equal(logs[0].documentUrl, 'https://wincomehair.com/contact');
  assert.equal(logs[0].blockedUrl, 'https://unexpected.example/script.js');
  assert.equal(logs[0].sourceFile, 'https://wincomehair.com/assets/app.js');
  assert.equal(JSON.stringify(logs).includes('private@example.com'), false);
  assert.equal(JSON.stringify(logs).includes('private user content'), false);

  const invalid = response();
  await handler({ method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' }, invalid);
  assert.equal(invalid.statusCode, 415);
} finally {
  console.warn = originalWarn;
}

console.log('CSP report endpoint tests passed');
