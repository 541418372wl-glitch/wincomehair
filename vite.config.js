import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { articles } from './src/data/articles.js';

// Generate listing/SEO data from the same content source without shipping the
// full article bodies in the common entry chunk. BlogPost loads those on demand.
function articleSummaries(buildingSsr) {
  const id = 'virtual:article-summaries';
  const resolvedId = '\0' + id;
  const keys = ['slug', 'title', 'seoTitle', 'metaDescription', 'image', 'date', 'updatedDate', 'category', 'readTime', 'excerpt'];
  return {
    name: 'article-summaries',
    resolveId(source) { if (source === id) return resolvedId; },
    load(source) {
      if (source !== resolvedId) return;
      const summaries = articles.map(article => Object.fromEntries(
        keys.filter(key => article[key] !== undefined).map(key => [key, article[key]]),
      ));
      return 'export const articles = ' + JSON.stringify(summaries) + ';';
    },
    generateBundle(_options, bundle) {
      const entries = Object.values(bundle).filter(file => file.type === 'chunk' && file.isEntry);
      const visited = new Set();
      const visit = (chunk) => {
        if (!chunk || chunk.type !== 'chunk' || visited.has(chunk.fileName)) return;
        visited.add(chunk.fileName);
        for (const moduleId of Object.keys(chunk.modules)) {
          if (/[/\\]src[/\\]data[/\\](articles|redditArticles|redditTrendArticles)\.js$/.test(moduleId)) {
            this.error('Full article content must not be in the initial client graph: ' + moduleId);
          }
        }
        chunk.imports.forEach(name => visit(bundle[name]));
      };
      // SSR needs the full content for prerendering; only gate client entries.
      if (!buildingSsr) entries.forEach(visit);
    },
  };
}

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

export default defineConfig(({ ssrBuild, isSsrBuild }) => {
  const buildingSsr = Boolean(ssrBuild || isSsrBuild);
  return {
  plugins: [react(), articleSummaries(buildingSsr), ...(buildingSsr ? [] : [inlineCss()])],
  resolve: {
    alias: buildingSsr
      ? {}
      : {
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
    manifest: !buildingSsr,
    rollupOptions: buildingSsr
      ? {}
      : {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
  },
  };
});
