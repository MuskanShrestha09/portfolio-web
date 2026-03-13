import { dbService } from '@/lib/db/service';
import { getEnvVariable } from '@/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(_req: NextRequest) {
  try {
    const results = await dbService.getAllProjects();
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Projects API GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('X-Admin-Password');
    if (authHeader !== getEnvVariable('ADMIN_PASSWORD')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const success = await dbService.createProject(body);
    
    if (!success) throw new Error('Failed to create project');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Projects API POST error:', error);
    return NextResponse.json({ error: 'Failed to create project', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('X-Admin-Password');
    if (authHeader !== getEnvVariable('ADMIN_PASSWORD')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { oldId, ...updates } = body;
    const success = await dbService.updateProject(updates.id, updates, oldId);
    
    if (!success) throw new Error('Database update failed');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Projects API PUT error:', error);
    return NextResponse.json({ error: 'Failed to update project', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('X-Admin-Password');
    if (authHeader !== getEnvVariable('ADMIN_PASSWORD')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });

    const success = await dbService.deleteProject(id);
    if (!success) throw new Error('Delete operation failed');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Projects API DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project', details: error?.message }, { status: 500 });
  }
}
