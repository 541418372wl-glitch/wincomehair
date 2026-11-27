import { Component } from 'react';

const reloadFlag = 'wincome_chunk_reloaded_v1';

export default class ChunkErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (!/ChunkLoadError|Importing a module script failed|Failed to fetch dynamically imported module|Loading chunk/i.test(String(error))) return;
    try {
      if (!window.sessionStorage.getItem(reloadFlag)) {
        window.sessionStorage.setItem(reloadFlag, '1');
        window.location.reload();
      }
    } catch { /* A manual reload is available when storage is restricted. */ }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section role="alert" className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-xl font-semibold text-navy">This page could not load</h1>
        <p className="mt-3 text-sm text-bronze">Reload to get the latest catalog.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-6">Reload Page</button>
      </section>
    );
  }
}
