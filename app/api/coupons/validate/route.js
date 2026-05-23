import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Validate a coupon code
export async function POST(request) {
  try {
    const { code, orderAmount } = await request.json();

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Coupon not found' });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: 'Coupon is inactive' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Coupon has expired' });
    }

    if (coupon.usageCount >= coupon.maxUsage) {
      return NextResponse.json({ valid: false, error: 'Coupon usage limit reached' });
    }

    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      return NextResponse.json({ valid: false, error: `Minimum order amount: $${coupon.minOrderAmount}` });
    }

    const discount = coupon.type === 'PERCENTAGE'
      ? orderAmount * (Number(coupon.value) / 100)
      : Math.min(Number(coupon.value), orderAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount * 100) / 100,
      },
    });
  } catch (error) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
