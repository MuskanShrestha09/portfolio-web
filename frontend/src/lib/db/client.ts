// This file provides safe access to Cloudflare-specific resources
// while preventing crashes in the local Next.js development server.

export async function getDb() {
  // If we are definitely not on Cloudflare (local dev), return null immediately.
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development' && !process.env.CF_PAGES) {
    return null;
  }

  try {
    // @ts-ignore
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const ctx = getRequestContext();
    return ctx?.env?.DB;
  } catch (e) {
    return null;
  }
}

export async function getEnvVariable(key: string): Promise<string | undefined> {
  if (typeof window !== 'undefined') return undefined;

  // 1. Always prioritize process.env (works locally and in many production environments)
  if (process.env[key]) return process.env[key];

  // 2. Only attempt Cloudflare Request Context if we might be on Cloudflare
  if (process.env.NODE_ENV === 'production' || process.env.CF_PAGES) {
    try {
      // @ts-ignore
      const { getRequestContext } = await import('@cloudflare/next-on-pages');
      const ctx = getRequestContext();
      return (ctx?.env as any)?.[key];
    } catch (e) {
      return undefined;
    }
  }

  return undefined;
}
