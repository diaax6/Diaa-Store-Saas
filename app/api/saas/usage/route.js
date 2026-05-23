import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const tenantId = auth.tenant?.id;
    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 400 });
    }

    // Get current usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [products, categories, staff, orders, inventory, coupons, customers] = await Promise.all([
      prisma.product.count({ where: { tenantId } }),
      prisma.category.count({ where: { tenantId } }),
      prisma.staff.count({ where: { tenantId } }),
      prisma.order.count({ where: { tenantId, createdAt: { gte: startOfMonth } } }),
      prisma.inventory.count({ where: { tenantId } }),
      prisma.coupon.count({ where: { tenantId } }),
      prisma.customer.count({ where: { tenantId } }),
    ]);

    // Get subscription info
    const subscription = await prisma.saasSubscription.findUnique({
      where: { tenantId },
    });

    return NextResponse.json({
      success: true,
      data: {
        plan: auth.tenant.plan,
        subscription,
        usage: {
          products,
          categories,
          staff,
          orders,
          inventory,
          coupons,
          customers,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
