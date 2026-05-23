'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function FailedContent() {
  const params = useSearchParams();
  const orderId = params.get('order');

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: 20,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#EF4444', marginBottom: 12 }}>
          Payment Failed
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 24 }}>
          Unfortunately, your payment could not be processed. Please try again or use a different payment method.
        </p>

        {orderId && (
          <div style={{
            background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.15)',
            borderRadius: 10, padding: '10px 16px', marginBottom: 24,
            fontSize: '.82rem', color: 'var(--color-text-muted)',
          }}>
            Order Reference: #{orderId}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/" style={{
            padding: '12px 28px', borderRadius: 10,
            background: 'var(--color-surface)', color: 'var(--color-text)',
            border: '1px solid var(--color-border)', fontWeight: 600,
            textDecoration: 'none', fontSize: '.9rem',
          }}>
            Back to Store
          </Link>
          <button onClick={() => window.history.back()} style={{
            padding: '12px 28px', borderRadius: 10,
            background: 'var(--color-primary)', color: '#fff',
            border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem',
          }}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>Loading...</div>}>
      <FailedContent />
    </Suspense>
  );
}
