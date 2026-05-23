'use client';
import { useState } from 'react';

const segments = [
  { id: 's1', name: 'VIP Customers', color: '#F59E0B', count: 23, criteria: 'Spent > $200', avgSpend: 312, lastOrder: '< 7 days', growth: '+12%' },
  { id: 's2', name: 'Active Buyers', color: '#10B981', count: 87, criteria: 'Ordered in last 30 days', avgSpend: 45, lastOrder: '< 30 days', growth: '+8%' },
  { id: 's3', name: 'New Customers', color: '#3B82F6', count: 34, criteria: 'Registered < 7 days', avgSpend: 15, lastOrder: '< 7 days', growth: '+22%' },
  { id: 's4', name: 'At Risk', color: '#F97316', count: 18, criteria: 'No order in 30-60 days', avgSpend: 28, lastOrder: '30-60 days', growth: '-5%' },
  { id: 's5', name: 'Churned', color: '#EF4444', count: 42, criteria: 'No order in 60+ days', avgSpend: 22, lastOrder: '60+ days', growth: '-15%' },
  { id: 's6', name: 'Wholesale', color: '#8B5CF6', count: 8, criteria: 'Bulk orders > 5 units', avgSpend: 180, lastOrder: '< 14 days', growth: '+3%' },
];

const customers = [
  { name: 'Ahmed M.', email: 'ahmed@test.com', segment: 'VIP Customers', totalSpent: 450, orders: 12, lastOrder: '2025-05-22' },
  { name: 'Sara A.', email: 'sara@test.com', segment: 'Active Buyers', totalSpent: 85, orders: 3, lastOrder: '2025-05-20' },
  { name: 'Omar H.', email: 'omar@test.com', segment: 'New Customers', totalSpent: 12, orders: 1, lastOrder: '2025-05-22' },
  { name: 'Mona K.', email: 'mona@test.com', segment: 'VIP Customers', totalSpent: 320, orders: 9, lastOrder: '2025-05-21' },
  { name: 'Youssef T.', email: 'youssef@test.com', segment: 'At Risk', totalSpent: 45, orders: 2, lastOrder: '2025-04-15' },
  { name: 'Layla S.', email: 'layla@test.com', segment: 'Churned', totalSpent: 30, orders: 1, lastOrder: '2025-03-10' },
  { name: 'Ali R.', email: 'ali@test.com', segment: 'Wholesale', totalSpent: 850, orders: 15, lastOrder: '2025-05-19' },
  { name: 'Nour M.', email: 'nour@test.com', segment: 'Active Buyers', totalSpent: 67, orders: 4, lastOrder: '2025-05-18' },
];

export default function SegmentationPage() {
  const [activeSegment, setActiveSegment] = useState(null);
  const filtered = activeSegment ? customers.filter(c => c.segment === activeSegment) : customers;
  const totalCustomers = segments.reduce((s, seg) => s + seg.count, 0);

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Customer Segmentation</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>{totalCustomers} total customers across {segments.length} segments</p>
      </div>

      {/* Segment Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        {segments.map(s => (
          <button key={s.id} onClick={() => setActiveSegment(activeSegment === s.name ? null : s.name)} style={{
            background: activeSegment === s.name ? `${s.color}12` : 'var(--color-surface)',
            border: `1px solid ${activeSegment === s.name ? s.color + '40' : 'var(--color-border)'}`,
            borderRadius: 12, padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
            transition: '.15s', borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--color-text)' }}>{s.name}</span>
              <span style={{ fontSize: '.68rem', fontWeight: 700, color: s.growth.startsWith('+') ? '#10B981' : '#EF4444' }}>{s.growth}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color, marginBottom: 4 }}>{s.count}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--color-text-muted)' }}>{s.criteria}</div>
            <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: 'var(--color-bg-tertiary)' }}>
              <div style={{ height: '100%', borderRadius: 2, background: s.color, width: `${(s.count / totalCustomers) * 100}%` }} />
            </div>
          </button>
        ))}
      </div>

      {/* Segment Distribution */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, marginBottom: 24, padding: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: '.92rem', marginBottom: 14 }}>Distribution</h3>
        <div style={{ display: 'flex', height: 28, borderRadius: 8, overflow: 'hidden', gap: 2 }}>
          {segments.map(s => (
            <div key={s.id} style={{
              width: `${(s.count / totalCustomers) * 100}%`, background: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.58rem', fontWeight: 700, color: '#fff', minWidth: 20,
            }} title={`${s.name}: ${s.count}`}>
              {((s.count / totalCustomers) * 100).toFixed(0)}%
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
          {segments.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.72rem', color: 'var(--color-text-muted)' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} /> {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '.92rem' }}>
            {activeSegment ? `${activeSegment} (${filtered.length})` : `All Customers (${filtered.length})`}
          </h3>
          {activeSegment && <button onClick={() => setActiveSegment(null)} style={{ fontSize: '.78rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>Show All</button>}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            {['Customer', 'Segment', 'Total Spent', 'Orders', 'Last Order'].map(h => (
              <th key={h} style={{ padding: '10px 16px', fontSize: '.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((c, i) => {
              const seg = segments.find(s => s.name === c.segment);
              return (
                <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${seg?.color || '#666'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: seg?.color, fontWeight: 700, fontSize: '.72rem' }}>{c.name.charAt(0)}</div>
                      <div><div style={{ fontWeight: 600, fontSize: '.88rem' }}>{c.name}</div><div style={{ fontSize: '.72rem', color: 'var(--color-text-muted)' }}>{c.email}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 10, background: `${seg?.color}15`, color: seg?.color }}>{c.segment}</span></td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', fontSize: '.9rem' }}>${c.totalSpent}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.88rem' }}>{c.orders}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.82rem', color: 'var(--color-text-muted)' }}>{c.lastOrder}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
