import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    const where = {};
    if (customerId) where.customerId = customerId;

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: { product: true, customer: true },
      orderBy: { expiresAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
