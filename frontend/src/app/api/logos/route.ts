import { dbService } from '@/lib/db/service';
import { getEnvVariable } from '@/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(_req: NextRequest) {
  try {
    const results = await dbService.getAllLogos();
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Logos GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const pwd = req.headers.get('X-Admin-Password');
  if (pwd !== getEnvVariable('ADMIN_PASSWORD')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const success = await dbService.createLogo(body);
    
    if (!success) throw new Error('Failed to create logo');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logos POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const pwd = req.headers.get('X-Admin-Password');
  if (pwd !== getEnvVariable('ADMIN_PASSWORD')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing logo ID' }, { status: 400 });

    const success = await dbService.deleteLogo(id);
    if (!success) throw new Error('Delete operation failed');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logos DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
