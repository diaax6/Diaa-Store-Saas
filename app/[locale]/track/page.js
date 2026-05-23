'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const demoOrders = [
  { id: 'ORD-2025-1847', product: 'ChatGPT Plus', price: 12, date: '2025-05-22', status: 'delivered', email: 'ahmed@test.com',
    timeline: [
      { step: 'Order Placed', time: '2025-05-22 14:30', done: true },
      { step: 'Payment Confirmed', time: '2025-05-22 14:31', done: true },
      { step: 'Processing', time: '2025-05-22 14:31', done: true },
      { step: 'Delivered', time: '2025-05-22 14:32', done: true },
    ]},
  { id: 'ORD-2025-1846', product: 'Netflix Premium', price: 10, date: '2025-05-22', status: 'processing', email: 'sara@test.com',
    timeline: [
      { step: 'Order Placed', time: '2025-05-22 15:10', done: true },
      { step: 'Payment Confirmed', time: '2025-05-22 15:11', done: true },
      { step: 'Processing', time: '2025-05-22 15:12', done: false },
      { step: 'Delivered', time: '', done: false },
    ]},
];

const statusColors = {
  delivered: { color: '#10B981', bg: 'rgba(16,185,129,.1)', label: 'Delivered' },
  processing: { color: '#F59E0B', bg: 'rgba(245,158,11,.1)', label: 'Processing' },
  pending: { color: '#6366F1', bg: 'rgba(99,102,241,.1)', label: 'Pending Payment' },
  cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,.1)', label: 'Cancelled' },
};

export default function OrderTracking() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [trackId, setTrackId] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const track = () => {
    setSearched(true);
    const found = demoOrders.find(o => o.id.toLowerCase() === trackId.trim().toLowerCase());
    setOrder(found || null);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '50px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16, margin: '0 auto 16px',
          background: 'rgba(230,126,34,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 6 }}>{isAr ? 'تتبع طلبك' : 'Track Your Order'}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>{isAr ? 'أدخل رقم الطلب لمعرفة حالة التوصيل' : 'Enter your order ID to see delivery status'}</p>
      </div>

      <div style={{
        display: 'flex', gap: 8, marginBottom: 30,
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 6,
      }}>
        <input
          value={trackId} onChange={e => setTrackId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && track()}
          placeholder={isAr ? 'أدخل رقم الطلب (مثال: ORD-2025-1847)' : 'Enter Order ID (e.g. ORD-2025-1847)'}
          style={{
            flex: 1, background: 'transparent', border: 'none', color: 'var(--color-text)',
            padding: '12px 16px', fontSize: '1rem', outline: 'none', fontFamily: 'monospace',
          }}
        />
        <button onClick={track} style={{
          padding: '12px 24px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, var(--color-primary), #F39C12)',
          color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem',
        }}>{isAr ? 'تتبع' : 'Track'}</button>
      </div>

      {searched && !order && (
        <div style={{
          textAlign: 'center', padding: 40,
          background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.15)',
          borderRadius: 14,
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,.4)" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{isAr ? 'الطلب غير موجود' : 'Order not found'}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '.88rem' }}>{isAr ? 'تحقق من رقم الطلب وحاول مرة أخرى' : 'Check your order ID and try again'}</p>
        </div>
      )}

      {order && (() => {
        const cfg = statusColors[order.status];
        const completedSteps = order.timeline.filter(t => t.done).length;
        const progress = (completedSteps / order.timeline.length) * 100;
        return (
          <div style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem' }}>{order.id}</span>
                  <div style={{ fontSize: '.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{order.date}</div>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: '.78rem',
                  fontWeight: 700, background: cfg.bg, color: cfg.color,
                }}>{cfg.label}</span>
              </div>
            </div>

            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{order.product}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--color-text-muted)' }}>{order.email}</div>
                </div>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '1.2rem' }}>${order.price}</span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '.78rem', fontWeight: 600 }}>{isAr ? 'التقدم' : 'Progress'}</span>
                <span style={{ fontSize: '.78rem', color: 'var(--color-text-muted)' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-tertiary)', marginBottom: 24 }}>
                <div style={{
                  height: '100%', borderRadius: 3, width: `${progress}%`,
                  background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}AA)`,
                  transition: 'width .5s',
                }} />
              </div>

              {order.timeline.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                  {i < order.timeline.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 13, top: 28, width: 2, height: 'calc(100% - 4px)',
                      background: step.done ? cfg.color + '40' : 'var(--color-border)',
                    }} />
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: step.done ? cfg.color : 'var(--color-bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: step.done ? 'none' : '2px solid var(--color-border)',
                  }}>
                    {step.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <div style={{ paddingBottom: 24 }}>
                    <div style={{ fontWeight: 600, fontSize: '.9rem', color: step.done ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{step.step}</div>
                    <div style={{ fontSize: '.72rem', color: 'var(--color-text-muted)' }}>{step.time || (isAr ? 'قيد الانتظار' : 'Pending')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: '.78rem', color: 'var(--color-text-muted)' }}>
        Try: <button onClick={() => { setTrackId('ORD-2025-1847'); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600 }}>ORD-2025-1847</button>
        {isAr ? ' أو ' : ' or '}
        <button onClick={() => { setTrackId('ORD-2025-1846'); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600 }}>ORD-2025-1846</button>
      </div>
    </div>
  );
}
