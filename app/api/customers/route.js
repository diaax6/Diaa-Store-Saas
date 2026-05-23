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
          { id: '1', name: 'Ahmed Mohamed', email: 'ahmed@gmail.com', isVip: true, totalSpent: 156, createdAt: '2025-04-01', _count: { orders: 12, subscriptions: 3 } },
          { id: '2', name: 'Sara Ali', email: 'sara@gmail.com', isVip: false, totalSpent: 45, createdAt: '2025-04-15', _count: { orders: 4, subscriptions: 1 } },
          { id: '3', name: 'Omar Hassan', email: 'omar@gmail.com', isVip: false, totalSpent: 88, createdAt: '2025-05-01', _count: { orders: 7, subscriptions: 2 } },
        ],
      });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        _count: { select: { orders: true, subscriptions: { where: { status: 'ACTIVE' } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const { name, email, password, phone, telegramUsername } = await request.json();

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }

    const { hashPassword } = await import('@/lib/auth');
    const passwordHash = await hashPassword(password);

    const customer = await prisma.customer.create({
      data: { name, email, passwordHash, phone, telegramUsername },
    });

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
