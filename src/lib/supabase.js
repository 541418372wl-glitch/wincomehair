import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard against invalid/placeholder URLs (e.g. Vercel CLI injects "[SENSITIVE]"
// during local builds) — degrade to null instead of crashing at runtime.
function isValidUrl(u) {
  if (!u || typeof u !== 'string') return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const supabase = isValidUrl(url) && anonKey ? createClient(url, anonKey) : null;
