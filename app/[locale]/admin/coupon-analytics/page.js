'use client';
import { useState } from 'react';

const coupons = [
  { code: 'WELCOME20', type: 'percentage', value: 20, uses: 145, maxUses: 500, revenue: 1740, conversion: 34.2, created: '2025-04-01', expires: '2025-06-30', active: true },
  { code: 'FLASH50', type: 'fixed', value: 5, uses: 89, maxUses: 100, revenue: 890, conversion: 45.1, created: '2025-05-10', expires: '2025-05-25', active: true },
  { code: 'VIP30', type: 'percentage', value: 30, uses: 23, maxUses: 50, revenue: 920, conversion: 62.5, created: '2025-05-15', expires: '2025-07-15', active: true },
  { code: 'COMEBACK10', type: 'percentage', value: 10, uses: 67, maxUses: 200, revenue: 402, conversion: 28.3, created: '2025-05-01', expires: '2025-06-15', active: true },
  { code: 'SUMMER25', type: 'percentage', value: 25, uses: 12, maxUses: 100, revenue: 240, conversion: 18.7, created: '2025-05-20', expires: '2025-08-31', active: false },
];

export default function CouponAnalyticsPage() {
  const totalRevenue = coupons.reduce((s, c) => s + c.revenue, 0);
  const totalUses = coupons.reduce((s, c) => s + c.uses, 0);
  const avgConversion = coupons.reduce((s, c) => s + c.conversion, 0) / coupons.length;
  const bestCoupon = coupons.reduce((best, c) => c.conversion > best.conversion ? c : best, coupons[0]);

  const stats = [
    { label: 'Total Revenue from Coupons', value: `$${totalRevenue.toLocaleString()}`, color: '#10B981' },
    { label: 'Total Redemptions', value: totalUses, color: '#3B82F6' },
    { label: 'Avg. Conversion Rate', value: `${avgConversion.toFixed(1)}%`, color: '#F59E0B' },
    { label: 'Best Performing', value: bestCoupon.code, color: '#8B5CF6' },
  ];

  return (
    <div style={{ padding: '24px 28px' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 6 }}>Coupon Analytics</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '.85rem', marginBottom: 24 }}>Track coupon performance and optimize promotions</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '16px 18px', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: s.color, fontFamily: typeof s.value === 'string' && s.value.startsWith('$') ? 'monospace' : 'inherit' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue per coupon chart */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: '.92rem', marginBottom: 16 }}>Revenue by Coupon</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
          {coupons.map((c, i) => {
            const maxRev = Math.max(...coupons.map(x => x.revenue));
            const height = (c.revenue / maxRev) * 140;
            const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '.68rem', fontWeight: 700 }}>${c.revenue}</span>
                <div style={{ width: '100%', height, borderRadius: '6px 6px 0 0', background: `${colors[i]}90`, transition: 'height .5s' }} />
                <span style={{ fontSize: '.62rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', textAlign: 'center' }}>{c.code}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coupons Table */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            {['Coupon', 'Type', 'Usage', 'Revenue', 'Conversion', 'Expires', 'Status'].map(h => (
              <th key={h} style={{ padding: '12px 16px', fontSize: '.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr key={i} style={{ borderBottom: i < coupons.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary)' }}>{c.code}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: c.type === 'percentage' ? 'rgba(99,102,241,.1)' : 'rgba(16,185,129,.1)', color: c.type === 'percentage' ? '#6366F1' : '#10B981' }}>{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</span></td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--color-bg-tertiary)', maxWidth: 80 }}>
                      <div style={{ height: '100%', borderRadius: 3, background: 'var(--color-primary)', width: `${(c.uses / c.maxUses) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: '.78rem' }}>{c.uses}/{c.maxUses}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace' }}>${c.revenue}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ fontWeight: 700, color: c.conversion > 40 ? '#10B981' : c.conversion > 25 ? '#F59E0B' : '#EF4444' }}>{c.conversion}%</span></td>
                <td style={{ padding: '12px 16px', fontSize: '.82rem', color: 'var(--color-text-muted)' }}>{c.expires}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 10, background: c.active ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)', color: c.active ? '#10B981' : '#EF4444' }}>{c.active ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
