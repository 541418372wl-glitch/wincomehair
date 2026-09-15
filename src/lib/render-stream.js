import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';

// A broken lazy subtree must fail the build instead of publishing a fallback.
export function renderStream(element, { timeoutMs = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    const destination = new PassThrough();
    const chunks = [];
    let settled = false;
    let stream;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
      stream?.abort();
      destination.destroy();
    };
    const timer = setTimeout(() => fail(new Error('SSR timed out')), timeoutMs);
    destination.on('data', chunk => chunks.push(chunk));
    destination.on('error', fail);
    destination.on('end', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    try {
      stream = renderToPipeableStream(element, {
        onAllReady() { if (!settled) stream.pipe(destination); },
        onShellError: fail,
        onError: fail,
      });
    } catch (error) {
      fail(error);
    }
  });
}
