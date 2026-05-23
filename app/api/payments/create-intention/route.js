import { NextResponse } from 'next/server';
import { getAuthToken, createOrder, getPaymentKey } from '@/lib/paymob';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { orderId, paymentMethod = 'card', locale = 'en' } = await request.json();

    if (!process.env.PAYMOB_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Payment gateway not configured yet. Please contact support.',
        notConfigured: true,
      }, { status: 503 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const amountCents = Math.round(order.total * 100);

    // Step 1: Auth
    const authToken = await getAuthToken();

    // Step 2: Create order on Paymob
    const paymobOrder = await createOrder(authToken, {
      amountCents,
      merchantOrderId: order.orderNumber || order.id,
      items: [{
        name: 'Order',
        amount_cents: amountCents,
        quantity: 1,
      }],
    });

    // Step 3: Payment key
    const integrationId = process.env.PAYMOB_INTEGRATION_ID;
    const paymentKey = await getPaymentKey(authToken, {
      orderId: paymobOrder.id,
      amountCents,
      integrationId: parseInt(integrationId),
      billingData: {
        email: order.customer?.email || 'guest@example.com',
        first_name: order.customer?.name?.split(' ')[0] || 'Guest',
        last_name: order.customer?.name?.split(' ').slice(1).join(' ') || 'Customer',
        phone_number: order.customer?.phone || '01000000000',
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paymobOrderId: String(paymobOrder.id) },
    });

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    return NextResponse.json({
      success: true,
      clientSecret: paymentKey,
      checkoutUrl: iframeUrl,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
