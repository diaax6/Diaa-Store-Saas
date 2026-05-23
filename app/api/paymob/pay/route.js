import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), '.paymob-config.json');
const PAYMOB_BASE = 'https://accept.paymob.com/api';

function getActiveConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      const mode = config.mode || 'live';
      return { ...(config[mode] || {}), mode };
    }
  } catch {}
  return { mode: 'live' };
}

/**
 * POST /api/paymob/pay
 * Classic Paymob API: Auth → Order → Payment Key
 * Then redirects to Paymob's hosted checkout
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, productName, productId, customerEmail, customerName, customerPhone, paymentMethod } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'المبلغ غير صالح' }, { status: 400 });
    }

    const config = getActiveConfig();
    const { apiKey, publicKey, secretKey, integrations, iframeId: configIframeId } = config;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'بوابة الدفع غير مهيئة. روح Admin → Payment Settings واضف API Key.' },
        { status: 500 }
      );
    }

    // Pick integration ID
    const methodMap = { card: 'onlineCard', cash: 'cashDeposit', tap_on_phone: 'tapOnPhone', in_store: 'inStore' };
    const intKey = methodMap[paymentMethod] || 'onlineCard';
    const integrationId = integrations?.[intKey];

    if (!integrationId) {
      return NextResponse.json(
        { success: false, error: `Integration ID لطريقة "${paymentMethod}" غير مضاف. روح Admin → Payment Settings.` },
        { status: 500 }
      );
    }

    const amountCents = Math.round(amount * 100);
    const [firstName, ...lastParts] = (customerName || 'Customer').split(' ');
    const lastName = lastParts.join(' ') || 'User';

    // ═══ Try Intention API first (modern approach) ═══
    if (secretKey && publicKey) {
      try {
        const intentRes = await fetch('https://accept.paymob.com/v1/intention/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountCents,
            currency: 'EGP',
            payment_methods: [parseInt(integrationId)],
            items: [{
              name: productName || 'Digital Product',
              amount: amountCents,
              description: `Order for ${productName || 'product'}`,
              quantity: 1,
            }],
            billing_data: {
              first_name: firstName, last_name: lastName,
              email: customerEmail || 'customer@email.com',
              phone_number: customerPhone || '+201000000000',
            },
            customer: {
              first_name: firstName, last_name: lastName,
              email: customerEmail || 'customer@email.com',
            },
          }),
        });

        if (intentRes.ok) {
          const intentData = await intentRes.json();
          const clientSecret = intentData.client_secret;
          if (clientSecret) {
            const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
            return NextResponse.json({ success: true, paymentUrl, intentionId: intentData.id });
          }
        } else {
          console.log('Intention API failed, falling back to Classic API. Status:', intentRes.status);
        }
      } catch (e) {
        console.log('Intention API error, falling back:', e.message);
      }
    }

    // ═══ Fallback: Classic API ═══
    // Step 1: Auth
    const authRes = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!authRes.ok) {
      return NextResponse.json({ success: false, error: `فشل المصادقة (${authRes.status}): تأكد من API Key` }, { status: 500 });
    }

    const authData = await authRes.json();
    const authToken = authData.token;

    // Step 2: Order
    const merchantOrderId = `DS-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const orderRes = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: 'EGP',
        merchant_order_id: merchantOrderId,
        items: [{
          name: productName || 'Digital Product',
          amount_cents: amountCents,
          description: `Order: ${productName || 'product'}`,
          quantity: 1,
        }],
      }),
    });

    if (!orderRes.ok) {
      return NextResponse.json({ success: false, error: `فشل إنشاء الطلب (${orderRes.status})` }, { status: 500 });
    }

    const orderData = await orderRes.json();

    // Step 3: Payment Key
    const payKeyRes = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderData.id,
        billing_data: {
          apartment: 'NA', floor: 'NA', street: 'NA', building: 'NA',
          shipping_method: 'NA', postal_code: 'NA',
          city: 'Cairo', country: 'EG', state: 'NA',
          email: customerEmail || 'customer@email.com',
          first_name: firstName, last_name: lastName,
          phone_number: customerPhone || '+201000000000',
        },
        currency: 'EGP',
        integration_id: parseInt(integrationId),
        lock_order_when_paid: true,
      }),
    });

    if (!payKeyRes.ok) {
      return NextResponse.json({ success: false, error: `فشل مفتاح الدفع (${payKeyRes.status}): تأكد من Integration ID` }, { status: 500 });
    }

    const payKeyData = await payKeyRes.json();
    const paymentToken = payKeyData.token;

    // Step 4: Build URL
    // Use Unified Checkout with payment key as clientSecret
    if (publicKey) {
      const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${paymentToken}`;
      return NextResponse.json({ success: true, paymentUrl, paymentToken, orderId: orderData.id, merchantOrderId });
    }

    // Fallback: iframe
    if (configIframeId) {
      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${configIframeId}?payment_token=${paymentToken}`;
      return NextResponse.json({ success: true, paymentUrl, paymentToken, orderId: orderData.id, merchantOrderId });
    }

    // Last resort: redirect to our pay page
    const baseUrl = request.headers.get('origin') || 'http://localhost:3001';
    const paymentUrl = `${baseUrl}/en/checkout/pay?token=${paymentToken}`;
    return NextResponse.json({ success: true, paymentUrl, paymentToken, orderId: orderData.id, merchantOrderId });

  } catch (error) {
    console.error('Paymob pay error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
