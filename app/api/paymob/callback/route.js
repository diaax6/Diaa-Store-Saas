import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/paymob/callback
 * Handles Paymob transaction callback/webhook
 * Paymob sends transaction data here after payment
 * 
 * Verifies HMAC signature and processes the payment result
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { obj: transaction, hmac: receivedHMAC } = body;

    if (!transaction) {
      return NextResponse.json({ error: 'No transaction data' }, { status: 400 });
    }

    // Verify HMAC signature
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    if (hmacSecret && receivedHMAC) {
      const concatenated = [
        transaction.amount_cents,
        transaction.created_at,
        transaction.currency,
        transaction.error_occured,
        transaction.has_parent_transaction,
        transaction.id,
        transaction.integration_id,
        transaction.is_3d_secure,
        transaction.is_auth,
        transaction.is_capture,
        transaction.is_refunded,
        transaction.is_standalone_payment,
        transaction.is_voided,
        transaction.order?.id || transaction.order,
        transaction.owner,
        transaction.pending,
        transaction.source_data?.pan || '',
        transaction.source_data?.sub_type || '',
        transaction.source_data?.type || '',
        transaction.success,
      ].join('');

      const computedHMAC = crypto
        .createHmac('sha512', hmacSecret)
        .update(concatenated)
        .digest('hex');

      if (computedHMAC !== receivedHMAC) {
        console.error('HMAC verification failed!');
        return NextResponse.json({ error: 'Invalid HMAC' }, { status: 403 });
      }
    }

    // Process the transaction
    const isSuccess = transaction.success === true && transaction.is_voided === false && transaction.is_refunded === false;
    const orderId = transaction.order?.id;
    const amountCents = transaction.amount_cents;
    const transactionId = transaction.id;

    console.log(`[Paymob Callback] Transaction ${transactionId}:`, {
      success: isSuccess,
      orderId,
      amount: amountCents / 100,
      currency: transaction.currency,
      card: transaction.source_data?.pan,
      type: transaction.source_data?.type,
    });

    if (isSuccess) {
      // ✅ Payment successful — activate the order
      // TODO: Update your database order status here
      // await prisma.order.update({ where: { paymobOrderId: orderId }, data: { status: 'PAID' } });
      
      console.log(`✅ Payment SUCCESS — Order ${orderId}, Amount: ${amountCents / 100} EGP`);
    } else {
      // ❌ Payment failed
      console.log(`❌ Payment FAILED — Order ${orderId}, Error: ${transaction.data?.message || 'Unknown'}`);
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error) {
    console.error('Paymob callback error:', error);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
}

/**
 * GET /api/paymob/callback
 * Handles the redirect back from Paymob after payment
 * Paymob redirects the user here with query params
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const success = searchParams.get('success') === 'true';
  const orderId = searchParams.get('order');
  const transactionId = searchParams.get('id');
  const amountCents = searchParams.get('amount_cents');

  // Redirect to appropriate page
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  
  if (success) {
    return NextResponse.redirect(`${baseUrl}/en/checkout/success?order=${orderId}&txn=${transactionId}`);
  } else {
    return NextResponse.redirect(`${baseUrl}/en/checkout/failed?order=${orderId}`);
  }
}
