import { dbService } from '@/lib/db/service';
import { getEnvVariable } from '@/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(_req: NextRequest) {
  try {
    const settings = await dbService.getSettings();
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const pwd = req.headers.get('X-Admin-Password');
  if (pwd !== await getEnvVariable('ADMIN_PASSWORD')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await req.json();
    const success = await dbService.updateSettings(updates);
    
    if (!success) throw new Error('Failed to update settings');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
