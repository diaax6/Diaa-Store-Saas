'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const releases = [
  { version: '2.4.0', date: '2025-05-22', tag: 'latest', changes: [
    { type: 'feature', text: 'Customer Wallet System with deposit bonuses' },
    { type: 'feature', text: 'Revenue Analytics Dashboard with heatmaps' },
    { type: 'feature', text: 'Affiliate & Referral Program' },
    { type: 'feature', text: 'Product Bundles with discount engine' },
    { type: 'feature', text: 'Payment Gateway Management dashboard' },
    { type: 'improvement', text: 'Abandoned Cart Recovery with auto-reminders' },
  ]},
  { version: '2.3.0', date: '2025-05-18', changes: [
    { type: 'feature', text: 'Flash Deal countdown banner' },
    { type: 'feature', text: 'Smart Search overlay (Ctrl+K)' },
    { type: 'feature', text: 'Floating support button (Telegram/WhatsApp)' },
    { type: 'improvement', text: 'Scroll progress bar & back-to-top' },
    { type: 'improvement', text: 'Cookie consent GDPR compliance' },
  ]},
  { version: '2.2.0', date: '2025-05-14', changes: [
    { type: 'feature', text: 'Multi-field inventory system (email/password/2FA)' },
    { type: 'feature', text: 'Auto-delivery engine for instant fulfillment' },
    { type: 'improvement', text: 'Category-based stock management' },
    { type: 'fix', text: 'Fixed product image rendering on mobile' },
  ]},
  { version: '2.1.0', date: '2025-05-10', changes: [
    { type: 'feature', text: 'Coupon system with percentage & fixed discounts' },
    { type: 'feature', text: 'Staff management with role-based access' },
    { type: 'improvement', text: 'Order processing pipeline optimization' },
    { type: 'fix', text: 'Fixed Arabic RTL layout issues' },
  ]},
  { version: '2.0.0', date: '2025-05-01', tag: 'major', changes: [
    { type: 'feature', text: 'Complete platform redesign with dark theme' },
    { type: 'feature', text: 'Multi-language support (EN/AR)' },
    { type: 'feature', text: 'Responsive admin panel' },
    { type: 'feature', text: 'Live sales ticker notifications' },
    { type: 'improvement', text: 'Performance optimizations across all pages' },
  ]},
];

const typeConfig = {
  feature: { color: '#10B981', bg: 'rgba(16,185,129,.1)', label: 'New' },
  improvement: { color: '#3B82F6', bg: 'rgba(59,130,246,.1)', label: 'Improved' },
  fix: { color: '#F59E0B', bg: 'rgba(245,158,11,.1)', label: 'Fixed' },
  breaking: { color: '#EF4444', bg: 'rgba(239,68,68,.1)', label: 'Breaking' },
};

export default function ChangelogPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ maxWidth: 750, margin: '0 auto', padding: '50px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
          background: 'rgba(99,102,241,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 6 }}>{isAr ? 'سجل التحديثات' : 'Changelog'}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>{isAr ? 'شوف الجديد والمحسّن في Diaa Store' : "See what's new and improved in Diaa Store"}</p>
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 30 }}>
        {[['all', isAr ? 'الكل' : 'All'],['feature', isAr ? 'مميزات' : 'Features'],['improvement', isAr ? 'تحسينات' : 'Improvements'],['fix', isAr ? 'إصلاحات' : 'Fixes']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding: '6px 16px', borderRadius: 20, border: '1px solid',
            borderColor: filter === k ? 'var(--color-primary)' : 'var(--color-border)',
            background: filter === k ? 'rgba(230,126,34,.08)' : 'transparent',
            color: filter === k ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: 600, fontSize: '.78rem', cursor: 'pointer', transition: '.15s',
          }}>{l}</button>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 15, top: 0, bottom: 0, width: 2,
          background: 'var(--color-border)',
        }} />

        {releases.map((r, i) => {
          const filtered = filter === 'all' ? r.changes : r.changes.filter(c => c.type === filter);
          if (filtered.length === 0) return null;
          return (
            <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 30, position: 'relative' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: r.tag === 'latest' ? 'var(--color-primary)' : r.tag === 'major' ? '#6366F1' : 'var(--color-surface)',
                border: `2px solid ${r.tag === 'latest' ? 'var(--color-primary)' : r.tag === 'major' ? '#6366F1' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>
                <span style={{ fontSize: '.6rem', fontWeight: 800, color: r.tag ? '#fff' : 'var(--color-text-muted)' }}>
                  {r.version.split('.')[1]}
                </span>
              </div>
              <div style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'monospace' }}>v{r.version}</span>
                  {r.tag === 'latest' && <span style={{ fontSize: '.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,.1)', color: '#10B981' }}>LATEST</span>}
                  {r.tag === 'major' && <span style={{ fontSize: '.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'rgba(99,102,241,.1)', color: '#6366F1' }}>MAJOR</span>}
                  <span style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{r.date}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {filtered.map((c, j) => {
                    const tc = typeConfig[c.type];
                    return (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: '.62rem', fontWeight: 700, padding: '1px 8px', borderRadius: 10,
                          background: tc.bg, color: tc.color, minWidth: 55, textAlign: 'center',
                        }}>{tc.label}</span>
                        <span style={{ fontSize: '.88rem' }}>{c.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
