import { NextResponse } from 'next/server';
import { verifyHMAC } from '@/lib/paymob';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request) {
  try {
    const payload = await request.json();
    const hmac = request.headers.get('hmac') || request.nextUrl.searchParams.get('hmac');

    // Verify HMAC
    if (process.env.PAYMOB_HMAC_SECRET && !verifyHMAC(payload.obj || payload, hmac)) {
      console.error('❌ PayMob webhook: Invalid HMAC');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const data = payload.obj || payload;
    const result = {
      success: data.success === true || data.success === 'true',
      orderId: data.order?.merchant_order_id || data.merchant_order_id,
      transactionId: data.id,
      amount: data.amount_cents / 100,
      errorMessage: data.data?.message || '',
    };

    console.log(`📥 PayMob webhook: order=${result.orderId}, success=${result.success}, amount=${result.amount}`);

    if (!result.orderId) {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({
      where: { id: result.orderId },
      include: {
        customer: true,
        items: { include: { product: true, pricing: true } },
      },
    });

    if (!order) {
      console.error(`Order not found: ${result.orderId}`);
      return NextResponse.json({ received: true });
    }

    if (result.success) {
      // ✅ Payment successful — process order
      await prisma.$transaction(async (tx) => {
        // 1. Update order status
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            status: 'PROCESSING',
            paymentRef: String(result.transactionId),
          },
        });

        // 2. Assign inventory for each item
        for (const item of order.items) {
          const inventory = await tx.inventory.findFirst({
            where: {
              productId: item.productId,
              tenantId: order.tenantId,
              status: 'AVAILABLE',
            },
            orderBy: { createdAt: 'asc' },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { id: inventory.id },
              data: {
                status: 'SOLD',
                soldToId: order.customerId,
                soldAt: new Date(),
              },
            });

            await tx.orderItem.update({
              where: { id: item.id },
              data: {
                inventoryId: inventory.id,
                deliveryData: inventory.data,
              },
            });

            // Create subscription
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + item.durationMonths);

            await tx.subscription.create({
              data: {
                tenantId: order.tenantId,
                customerId: order.customerId,
                productId: item.productId,
                inventoryId: inventory.id,
                startsAt: startDate,
                expiresAt: endDate,
              },
            });
          }
        }

        // 3. Update order to completed
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'COMPLETED',
            deliveredAt: new Date(),
          },
        });

        // 4. Update customer stats
        await tx.customer.update({
          where: { id: order.customerId },
          data: {
            totalSpent: { increment: order.total },
          },
        });
      });

      // Send order confirmation email (outside transaction)
      try {
        const updatedOrder = await prisma.order.findUnique({
          where: { id: order.id },
          include: { items: { include: { product: true } } },
        });
        await sendOrderConfirmation(
          order.customer?.email || order.email,
          updatedOrder,
          order.customer?.language || 'en'
        );
      } catch (emailErr) {
        console.error('Order confirmation email failed:', emailErr.message);
      }

      console.log(`✅ Order ${order.orderNumber} completed successfully`);
    } else {
      // ❌ Payment failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
          notes: result.errorMessage || 'Payment failed',
        },
      });
      console.log(`❌ Order ${order.orderNumber} payment failed: ${result.errorMessage}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayMob webhook error:', error);
    return NextResponse.json({ received: true, error: error.message });
  }
}
