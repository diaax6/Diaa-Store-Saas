import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { code, type, value, maxUsage, expiresAt, minOrderAmount } = await request.json();

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) return NextResponse.json({ success: false, error: 'Code already exists' }, { status: 400 });

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type: type || 'PERCENTAGE',
        value,
        maxUsage: maxUsage || 100,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        minOrderAmount: minOrderAmount || 0,
      },
    });
    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
