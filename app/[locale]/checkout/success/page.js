'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order');
  const txnId = params.get('txn');

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: 20,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#10B981', marginBottom: 12 }}>
          Payment Successful! 🎉
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 24 }}>
          Your payment has been processed successfully. Your order is being prepared.
        </p>

        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: '16px 24px', marginBottom: 24, textAlign: 'left',
        }}>
          {orderId && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>Order ID</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '.85rem' }}>#{orderId}</span>
            </div>
          )}
          {txnId && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>Transaction</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '.85rem' }}>{txnId}</span>
            </div>
          )}
        </div>

        <Link href="/" style={{
          display: 'inline-block', padding: '12px 32px', borderRadius: 10,
          background: 'var(--color-primary)', color: '#fff', fontWeight: 700,
          textDecoration: 'none', fontSize: '.9rem',
        }}>
          Back to Store
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
