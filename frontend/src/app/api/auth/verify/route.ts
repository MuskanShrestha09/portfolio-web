import { NextRequest, NextResponse } from 'next/server';
import { getEnvVariable } from '@/lib/db/client';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    let env: any;
    try {
      // @ts-ignore
      const { getRequestContext } = await import('@cloudflare/next-on-pages');
      env = getRequestContext()?.env;
    } catch (e) {}

    const db = env?.DB as D1Database | undefined;
    const adminPassword = getEnvVariable('ADMIN_PASSWORD');

    if (!adminPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!db) {
      // Fallback if DB is missing (local dev)
      if (password === adminPassword) return NextResponse.json({ success: true, token: adminPassword });
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 1. Check Rate Limit (D1)
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
    
    // Auto-create table if it doesn't exist (safety)
    await db.prepare('CREATE TABLE IF NOT EXISTS login_attempts (ip TEXT PRIMARY KEY, last_attempt INTEGER, count INTEGER)').run();

    const { results } = await db.prepare('SELECT * FROM login_attempts WHERE ip = ?').bind(ip).all();
    const attempt = results[0] as any;

    if (attempt && attempt.count >= 5 && attempt.last_attempt > oneHourAgo) {
      const waitMinutes = Math.ceil((attempt.last_attempt + 900 - now) / 60); // 15 min lockout
      if (waitMinutes > 0) {
        return NextResponse.json({ 
          error: `Too many attempts. Blocked for ${waitMinutes} minutes.`, 
          blocked: true 
        }, { status: 429 });
      }
    }

    // 2. Verify Password
    if (password === adminPassword) {
      // Success: Reset attempts
      await db.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
      return NextResponse.json({ success: true, token: adminPassword });
    }

    // 3. Failure: Increment attempts
    const newCount = (attempt?.count || 0) + 1;
    await db.prepare('INSERT OR REPLACE INTO login_attempts (ip, last_attempt, count) VALUES (?, ?, ?)')
      .bind(ip, now, newCount).run();

    // Brute-force mitigation: sleep for failure
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return NextResponse.json({ 
      error: `Invalid password. ${5 - newCount} attempts remaining.`,
      attemptsRemaining: Math.max(0, 5 - newCount)
    }, { status: 401 });

  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
