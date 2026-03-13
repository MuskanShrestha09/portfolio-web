// This file provides safe access to Cloudflare-specific resources
// while preventing crashes in the local Next.js development server.

export async function getDb() {
  // If we're local dev, return null immediately to avoid runtime sandbox issues.
  if (process.env.NODE_ENV === 'development' && !process.env.CF_PAGES) {
    return null;
  }

  try {
    // We use dynamic import to avoid bundling issues in non-Cloudflare environments.
    // The try-catch block is essential as getRequestContext is only available in Cloudflare Edge.
    const mod = await import('@cloudflare/next-on-pages').catch(() => null);
    if (!mod || !mod.getRequestContext) return null;

    const ctx = mod.getRequestContext();
    const db = ctx?.env?.DB;
    
    if (db) return db;
    // Special case for local dev using wrangler (if applicable)
    if (process.env.NODE_ENV === 'development' && (ctx?.env as any)?.DB) return (ctx?.env as any)?.DB;
    
  } catch (e) {
    console.warn('getDb fallback triggered:', e);
  }
  return null;
}

export async function getEnvVariable(key: string): Promise<string | undefined> {
  if (typeof window !== 'undefined') return undefined;

  // 1. Try process.env (Standard/Local/Vercel)
  // Note: On Cloudflare Pages, only non-secret variables are in process.env
  if (process.env[key]) return process.env[key];

  // 2. Try Cloudflare Request Context (Secrets are here)
  try {
    const mod = await import('@cloudflare/next-on-pages').catch(() => null);
    if (mod && mod.getRequestContext) {
      const ctx = mod.getRequestContext();
      const val = (ctx?.env as any)?.[key];
      if (val) return val;
    }
  } catch (e) {
    // Ignore context errors
  }

  return undefined;
}
