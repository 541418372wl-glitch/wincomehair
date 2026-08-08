import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { productMeta } from './src/data/productMeta';
import { articles } from './src/data/articles';

// vite-plugin-prerender 1.0.8 ships a broken ESM entry (uses require inside).
// Load it through its CJS entry instead.
// SSG prerender only on local builds; Vercel builds skip it (no chromium download risk).
const isVercelBuild = process.env.VERCEL === '1';
const prerenderPlugin = isVercelBuild ? null : (() => {
  const require = createRequire(import.meta.url);
  const vitePrerender = require('vite-plugin-prerender');
  const Renderer = vitePrerender.PuppeteerRenderer;
  return vitePrerender({
    staticDir: join(process.cwd(), 'dist'),
    routes,
    renderer: new Renderer({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      maxConcurrentRoutes: 4,
      renderAfterTime: 3500,
    }),
    server: { port: 8123 },
  });
})();

// Inline the built CSS into index.html (post-build) to eliminate
// render-blocking stylesheet requests, then remove the .css file.
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    closeBundle() {
      const assetsDir = join(process.cwd(), 'dist', 'assets');
      if (!existsSync(assetsDir)) return;
      const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
      if (!cssFiles.length) return;
      const css = cssFiles.map((f) => readFileSync(join(assetsDir, f), 'utf8')).join('');
      const htmlPath = join(process.cwd(), 'dist', 'index.html');
      let html = readFileSync(htmlPath, 'utf8');
      html = html.replace(/<link rel="stylesheet"[^>]*>/g, () => `<style>${css}</style>`);
      writeFileSync(htmlPath, html);
      cssFiles.forEach((f) => unlinkSync(join(assetsDir, f)));
    },
  };
}

// Static routes + all product detail pages + all blog articles
const routes = [
  '/', '/products', '/customization', '/about', '/contact', '/faq', '/quality', '/cases', '/blog', '/privacy', '/terms',
  ...Object.keys(productMeta).map((id) => `/products/${id}`),
  ...articles.map((a) => `/blog/${a.slug}`),
];

export default defineConfig({
  plugins: [
    react(),
    inlineCss(),
    ...(prerenderPlugin ? [prerenderPlugin] : []),
  ],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/client': 'preact/compat/client',
      'react/jsx-runtime': 'preact/compat/jsx-runtime',
    },
  },
  server: {
    host: '127.0.0.1'
  },
  build: {
    target: 'es2017',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
