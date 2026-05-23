import { NextResponse } from 'next/server';

export async function GET() {
  try {
    let prisma;
    try {
      prisma = (await import('@/lib/prisma')).default;
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      return NextResponse.json({ success: true, data: { store_name: 'Diaa Store', color_primary: '#8B5CF6' } });
    }
    const { getSettings } = await import('@/lib/settings');
    const settings = await getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const { updateSettings } = await import('@/lib/settings');
    const body = await request.json();
    await updateSettings(body);
    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
