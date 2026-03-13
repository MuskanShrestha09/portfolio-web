import { NextRequest, NextResponse } from 'next/server';
import { getEnvVariable, getDb } from '@/lib/db/client';

export const runtime = 'edge';

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('X-Admin-Password');
    if (authHeader !== await getEnvVariable('ADMIN_PASSWORD')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    
    if (!db) {
      return NextResponse.json({ error: 'Database not available in this environment' }, { status: 503 });
    }

    const body = await req.json();
    const { projects } = body; // Expects an array: { id: string, sort_order: number }[]
    
    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    for (const p of projects) {
      await db.prepare('UPDATE projects SET sort_order = ? WHERE id = ?').bind(p.sort_order, p.id).run();
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder database error:', error);
    return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 });
  }
}
