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
export function getEnvVariable(key: string): string | undefined {
  if (typeof window !== 'undefined') return undefined;

  // 1. Try process.env (Standard/Local)
  if (process.env[key]) return process.env[key];

  // 2. Try Cloudflare Request Context
  try {
    const ctx = getRequestContext();
    return (ctx?.env as any)?.[key];
  } catch (e) {
    return undefined;
  }
}
