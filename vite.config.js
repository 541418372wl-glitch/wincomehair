import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

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
  plugins: [react(), ...(buildingSsr ? [] : [inlineCss()])],
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
