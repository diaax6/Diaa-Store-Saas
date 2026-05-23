import { NextResponse } from 'next/server';
import { generateOrderNumber } from '@/lib/utils';
import { requireAdmin } from '@/lib/admin-guard';
import { sendOrderConfirmation } from '@/lib/email';

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    let prisma;
    try {
      prisma = (await import('@/lib/prisma')).default;
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      return NextResponse.json({
        success: true,
        data: [
          { id: '1', orderNumber: 'ORD-001', customer: { name: 'Ahmed Mohamed', email: 'ahmed@test.com' }, items: [{ product: { nameEn: 'ChatGPT Plus', image: null }, quantity: 1, price: 12 }], total: 12, status: 'COMPLETED', paymentMethod: 'wallet', paymentStatus: 'PAID', createdAt: new Date().toISOString() },
          { id: '2', orderNumber: 'ORD-002', customer: { name: 'Sara Ali', email: 'sara@test.com' }, items: [{ product: { nameEn: 'Adobe CC', image: null }, quantity: 1, price: 25 }], total: 25, status: 'PENDING', paymentMethod: 'card', paymentStatus: 'PENDING', createdAt: new Date().toISOString() },
          { id: '3', orderNumber: 'ORD-003', customer: { name: 'Omar Hassan', email: 'omar@test.com' }, items: [{ product: { nameEn: 'Spotify Premium', image: null }, quantity: 1, price: 8 }], total: 8, status: 'PROCESSING', paymentMethod: 'wallet', paymentStatus: 'PAID', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: '4', orderNumber: 'ORD-004', customer: { name: 'Mona Khaled', email: 'mona@test.com' }, items: [{ product: { nameEn: 'Netflix Premium', image: null }, quantity: 1, price: 10 }], total: 10, status: 'COMPLETED', paymentMethod: 'wallet', paymentStatus: 'PAID', createdAt: new Date(Date.now() - 7200000).toISOString() },
          { id: '5', orderNumber: 'ORD-005', customer: { name: 'Youssef Tarek', email: 'youssef@test.com' }, items: [{ product: { nameEn: 'Microsoft 365', image: null }, quantity: 1, price: 13 }], total: 13, status: 'COMPLETED', paymentMethod: 'card', paymentStatus: 'PAID', createdAt: new Date(Date.now() - 10800000).toISOString() },
        ],
        total: 5, page: 1, limit: 20,
        demo: true,
      });
    }

    const tenantId = auth.tenant?.id;
    const tenantWhere = tenantId ? { tenantId } : {};

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);

    const where = { ...tenantWhere };
    if (status && status !== 'ALL') where.status = status;

    const [orders, count] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { name: true, email: true } },
          items: { include: { product: { select: { nameEn: true, nameAr: true, image: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: orders, total: count, page, limit });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const body = await request.json();
    const { customerId, items, paymentMethod, couponCode, tenantId: bodyTenantId } = body;

    // Resolve tenant
    let tenantId = bodyTenantId;
    if (!tenantId) {
      const defaultTenant = await prisma.tenant.findFirst({ where: { isActive: true } });
      tenantId = defaultTenant?.id;
    }

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'No active store found' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const pricing = await prisma.productPricing.findUnique({
        where: { id: item.pricingId },
        include: { product: true },
      });
      if (!pricing) throw new Error(`Pricing not found: ${item.pricingId}`);

      const qty = item.quantity || 1;
      subtotal += Number(pricing.price) * qty;

      for (let i = 0; i < qty; i++) {
        orderItems.push({
          productId: pricing.productId,
          pricingId: pricing.id,
          price: pricing.price,
          durationMonths: pricing.durationMonths,
          quantity: 1,
        });
      }
    }

    let discount = 0;
    let couponId = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { tenantId, code: couponCode },
      });
      if (coupon && coupon.isActive && coupon.usedCount < (coupon.maxUses || 999999)) {
        discount = coupon.type === 'PERCENTAGE'
          ? subtotal * (coupon.value / 100)
          : Math.min(coupon.value, subtotal);
        couponId = coupon.id;
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Process wallet payment immediately
    if (paymentMethod === 'wallet') {
      const wallet = await prisma.wallet.findUnique({ where: { customerId } });
      if (!wallet || wallet.balance < total) {
        return NextResponse.json({ success: false, error: 'Insufficient wallet balance' }, { status: 400 });
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          tenantId,
          orderNumber: generateOrderNumber(),
          customerId,
          subtotal,
          discount,
          total,
          couponId,
          paymentMethod,
          paymentStatus: paymentMethod === 'wallet' ? 'PAID' : 'PENDING',
          status: paymentMethod === 'wallet' ? 'PROCESSING' : 'PENDING',
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });

      // If wallet payment — deduct balance
      if (paymentMethod === 'wallet') {
        await tx.wallet.update({
          where: { customerId },
          data: { balance: { decrement: total } },
        });
        await tx.walletTransaction.create({
          data: {
            walletId: (await tx.wallet.findUnique({ where: { customerId } })).id,
            type: 'DEBIT',
            amount: total,
            description: `Order #${newOrder.orderNumber}`,
            referenceId: newOrder.id,
          },
        });

        // Auto-deliver: assign inventory
        for (const item of newOrder.items) {
          const inventory = await tx.inventory.findFirst({
            where: {
              productId: item.productId,
              tenantId,
              status: 'AVAILABLE',
            },
            orderBy: { createdAt: 'asc' },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { id: inventory.id },
              data: { status: 'SOLD', soldToId: customerId, soldAt: new Date() },
            });
            await tx.orderItem.update({
              where: { id: item.id },
              data: { inventoryId: inventory.id, deliveryData: inventory.data },
            });

            // Create subscription record
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + item.durationMonths);
            await tx.subscription.create({
              data: {
                tenantId,
                customerId,
                productId: item.productId,
                inventoryId: inventory.id,
                startsAt: startDate,
                expiresAt: endDate,
              },
            });
          }
        }

        // Mark as completed
        await tx.order.update({
          where: { id: newOrder.id },
          data: { status: 'COMPLETED', deliveredAt: new Date() },
        });

        // Update customer stats
        await tx.customer.update({
          where: { id: customerId },
          data: { totalSpent: { increment: total } },
        });
      }

      return newOrder;
    });

    // Send email confirmation (outside transaction)
    if (paymentMethod === 'wallet') {
      try {
        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        const fullOrder = await prisma.order.findUnique({
          where: { id: order.id },
          include: { items: { include: { product: true } } },
        });
        if (customer?.email) {
          await sendOrderConfirmation(customer.email, fullOrder, customer.language || 'en');
        }
      } catch (emailErr) {
        console.error('Order email failed:', emailErr.message);
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
