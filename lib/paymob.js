/**
 * Paymob Payment Service
 * Handles authentication, order creation, and payment key generation
 * Uses the Paymob Accept API (Classic)
 */

const PAYMOB_BASE = 'https://accept.paymob.com/api';

/**
 * Step 1: Get authentication token from Paymob
 */
export async function getAuthToken() {
  const res = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob auth failed: ${res.status} — ${text}`);
  }

  const data = await res.json();
  return data.token;
}

/**
 * Step 2: Register an order with Paymob
 */
export async function createOrder(authToken, { amountCents, merchantOrderId, items = [] }) {
  const res = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      merchant_order_id: merchantOrderId,
      items: items.map(item => ({
        name: item.name,
        amount_cents: item.amount_cents,
        description: item.description || '',
        quantity: item.quantity || 1,
      })),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob order creation failed: ${res.status} — ${text}`);
  }

  return await res.json();
}

/**
 * Step 3: Generate a payment key
 */
export async function getPaymentKey(authToken, {
  orderId,
  amountCents,
  billingData,
  integrationId,
  currency = 'EGP',
  lockOrderWhenPaid = true,
}) {
  const res = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600, // 1 hour
      order_id: orderId,
      billing_data: {
        apartment: billingData.apartment || 'NA',
        email: billingData.email || 'customer@email.com',
        floor: billingData.floor || 'NA',
        first_name: billingData.first_name || 'Customer',
        street: billingData.street || 'NA',
        building: billingData.building || 'NA',
        phone_number: billingData.phone_number || '01000000000',
        shipping_method: 'NA',
        postal_code: billingData.postal_code || 'NA',
        city: billingData.city || 'Cairo',
        country: billingData.country || 'EG',
        last_name: billingData.last_name || 'Name',
        state: billingData.state || 'NA',
      },
      currency,
      integration_id: integrationId,
      lock_order_when_paid: lockOrderWhenPaid,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob payment key failed: ${res.status} — ${text}`);
  }

  const data = await res.json();
  return data.token;
}

/**
 * Verify HMAC signature from Paymob callback
 */
export function verifyHMAC(data, receivedHMAC) {
  const crypto = require('crypto');
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

  // Paymob HMAC concatenation order (alphabetical by key)
  const concatenated = [
    data.amount_cents,
    data.created_at,
    data.currency,
    data.error_occured,
    data.has_parent_transaction,
    data.id,
    data.integration_id,
    data.is_3d_secure,
    data.is_auth,
    data.is_capture,
    data.is_refunded,
    data.is_standalone_payment,
    data.is_voided,
    data.order?.id || data.order,
    data.owner,
    data.pending,
    data.source_data?.pan || '',
    data.source_data?.sub_type || '',
    data.source_data?.type || '',
    data.success,
  ].join('');

  const computedHMAC = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenated)
    .digest('hex');

  return computedHMAC === receivedHMAC;
}
