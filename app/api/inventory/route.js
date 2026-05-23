import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    let prisma;
    try {
      prisma = (await import('@/lib/prisma')).default;
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      return NextResponse.json({
        success: true,
        data: [
          { id: '1', product: { nameEn: 'ChatGPT Plus', image: '🤖' }, type: 'ACCOUNT', status: 'AVAILABLE', createdAt: new Date().toISOString() },
          { id: '2', product: { nameEn: 'ChatGPT Plus', image: '🤖' }, type: 'ACCOUNT', status: 'SOLD', soldTo: { name: 'Ahmed' }, soldAt: new Date().toISOString(), createdAt: new Date().toISOString() },
          { id: '3', product: { nameEn: 'Spotify Premium', image: '🎵' }, type: 'ACCOUNT', status: 'AVAILABLE', createdAt: new Date().toISOString() },
        ],
        counts: { ALL: 25, AVAILABLE: 15, SOLD: 8, RESERVED: 0, EXPIRED: 2 },
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const productId = searchParams.get('productId');

    const where = {};
    if (status && status !== 'ALL') where.status = status;
    if (productId) where.productId = productId;

    // Note: Inventory model in schema
    const items = await prisma.inventory.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const counts = {
      ALL: await prisma.inventory.count(),
      AVAILABLE: await prisma.inventory.count({ where: { status: 'AVAILABLE' } }),
      SOLD: await prisma.inventory.count({ where: { status: 'SOLD' } }),
      RESERVED: await prisma.inventory.count({ where: { status: 'RESERVED' } }),
      EXPIRED: await prisma.inventory.count({ where: { status: 'EXPIRED' } }),
    };

    return NextResponse.json({ success: true, data: items, counts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const { encrypt } = await import('@/lib/encryption');
    const body = await request.json();
    const { productId, type, items } = body;

    const created = await prisma.inventory.createMany({
      data: items.map(data => ({
        productId,
        type: type || 'ACCOUNT',
        data: encrypt(data),
        status: 'AVAILABLE',
      })),
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
