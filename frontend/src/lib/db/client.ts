import { getRequestContext } from '@cloudflare/next-on-pages';

export function getDb() {
  // If we're definitely not on Cloudflare (local Next.js dev server),
  // return null immediately to avoid getRequestContext() throwing an error.
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development' && !process.env.CF_PAGES) {
    return null;
  }

  try {
    const ctx = getRequestContext();
    return ctx?.env?.DB;
  } catch (e) {
    // Silently return null in dev if context isn't available
    return null;
  }
}
