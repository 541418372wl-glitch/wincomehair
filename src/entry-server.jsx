import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.mjs';
import { AppContent } from './App';
import { getSeoMeta, OG_IMAGE, SITE, SITE_NAME } from './components/SEO';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildHead(pathname) {
  const meta = getSeoMeta(pathname);
  if (!meta) throw new Error(`Missing SEO metadata for ${pathname}`);

  const url = `${SITE}${pathname}`;
  const image = meta.image || OG_IMAGE;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
  ];

  if (pathname === '/') {
    tags.push(
      `<script type="application/ld+json" id="org-jsonld">${jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE,
        logo: `${SITE}/logo-192.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+86-189-8984-6141',
          contactType: 'sales',
          availableLanguage: ['English', 'Chinese'],
        },
      })}</script>`,
      `<script type="application/ld+json" id="website-jsonld">${jsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE,
      })}</script>`,
    );
  }

  return tags.join('\n    ');
}

export function render(pathname) {
  return new Promise((resolve, reject) => {
    const destination = new PassThrough();
    const chunks = [];
    let settled = false;

    destination.on('data', (chunk) => chunks.push(chunk));
    destination.on('error', reject);
    destination.on('end', () => {
      settled = true;
      resolve({
        appHtml: Buffer.concat(chunks).toString('utf8'),
        headHtml: buildHead(pathname),
      });
    });

    const stream = renderToPipeableStream(
      <StaticRouter location={pathname}>
        <AppContent />
      </StaticRouter>,
      {
        onAllReady() {
          stream.pipe(destination);
        },
        onShellError(error) {
          settled = true;
          reject(error);
        },
        onError(error) {
          console.error(`[ssg] ${pathname}`, error);
        },
      },
    );

    setTimeout(() => {
      if (!settled) {
        stream.abort();
        reject(new Error(`SSR timed out for ${pathname}`));
      }
    }, 30000).unref();
  });
}
