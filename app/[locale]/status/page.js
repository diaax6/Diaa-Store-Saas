'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const services = [
  { name: 'Store Website', status: 'operational', uptime: 99.98, latency: 45 },
  { name: 'Payment Processing', status: 'operational', uptime: 99.99, latency: 120 },
  { name: 'Auto Delivery Engine', status: 'operational', uptime: 99.95, latency: 230 },
  { name: 'Customer Dashboard', status: 'operational', uptime: 99.97, latency: 88 },
  { name: 'API Gateway', status: 'operational', uptime: 99.96, latency: 55 },
  { name: 'Telegram Bot', status: 'degraded', uptime: 98.50, latency: 450 },
  { name: 'Email Notifications', status: 'operational', uptime: 99.90, latency: 200 },
];

const incidents = [
  { date: '2025-05-20', title: 'Telegram Bot Slow Response', status: 'monitoring', services: ['Telegram Bot'],
    updates: [
      { time: '15:30', text: 'We are investigating reports of slow response times from the Telegram bot.' },
      { time: '16:00', text: 'Root cause identified: API rate limiting from Telegram. Implementing workaround.' },
      { time: '16:45', text: 'Fix deployed. Monitoring for stability.' },
    ]},
  { date: '2025-05-15', title: 'Scheduled Maintenance', status: 'resolved', services: ['Store Website', 'API Gateway'],
    updates: [
      { time: '02:00', text: 'Maintenance started. Database migration in progress.' },
      { time: '02:30', text: 'Maintenance completed. All systems operational.' },
    ]},
];

const statusConfig = {
  operational: { color: '#10B981', label: 'Operational', icon: '●' },
  degraded: { color: '#F59E0B', label: 'Degraded', icon: '▲' },
  outage: { color: '#EF4444', label: 'Major Outage', icon: '✕' },
  maintenance: { color: '#6366F1', label: 'Maintenance', icon: '◆' },
};

const incidentStatus = {
  investigating: { color: '#EF4444', label: 'Investigating' },
  identified: { color: '#F59E0B', label: 'Identified' },
  monitoring: { color: '#3B82F6', label: 'Monitoring' },
  resolved: { color: '#10B981', label: 'Resolved' },
};

// Generate 90-day uptime grid
function UptimeGrid({ uptime }) {
  const days = Array.from({ length: 90 }, (_, i) => {
    const rand = Math.random();
    if (rand > 0.02) return 'operational';
    if (rand > 0.005) return 'degraded';
    return 'outage';
  });
  return (
    <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
      {days.map((d, i) => (
        <div key={i} style={{
          width: 3, height: 24, borderRadius: 1,
          background: statusConfig[d].color,
          opacity: d === 'operational' ? 0.4 : 1,
        }} title={`Day ${90 - i}: ${statusConfig[d].label}`} />
      ))}
    </div>
  );
}

export default function StatusPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [expandedIncident, setExpandedIncident] = useState(0);
  const allOperational = services.every(s => s.status === 'operational');
  const overallStatus = allOperational ? 'operational' : services.some(s => s.status === 'outage') ? 'outage' : 'degraded';
  const cfg = statusConfig[overallStatus];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      {/* Overall Status */}
      <div style={{
        background: `${cfg.color}08`, border: `1px solid ${cfg.color}25`,
        borderRadius: 16, padding: '24px 28px', marginBottom: 30, textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', margin: '0 auto 12px',
          background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {overallStatus === 'operational' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          )}
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem', marginBottom: 4 }}>
          {allOperational ? (isAr ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All Systems Operational') : (isAr ? 'تدهور جزئي في النظام' : 'Partial System Degradation')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '.88rem' }}>
          {isAr ? 'آخر تحديث: ' : 'Last updated: '}{new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US')}
        </p>
      </div>

      {/* Services */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, overflow: 'hidden', marginBottom: 30,
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>{isAr ? 'الخدمات' : 'Services'}</h2>
        </div>
        {services.map((s, i) => {
          const sc = statusConfig[s.status];
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', borderBottom: i < services.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color }} />
                <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{s.uptime}%</span>
                <span style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{s.latency}ms</span>
                <span style={{
                  fontSize: '.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                  background: sc.color + '15', color: sc.color,
                }}>{sc.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 90-Day Uptime */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 20, marginBottom: 30,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontWeight: 700, fontSize: '.95rem' }}>{isAr ? 'وقت التشغيل 90 يوم' : '90-Day Uptime'}</h3>
          <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#10B981' }}>{isAr ? '99.96% متوسط' : '99.96% average'}</span>
        </div>
        <UptimeGrid uptime={99.96} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: '.62rem', color: 'var(--color-text-muted)' }}>{isAr ? 'منذ 90 يوم' : '90 days ago'}</span>
          <span style={{ fontSize: '.62rem', color: 'var(--color-text-muted)' }}>{isAr ? 'اليوم' : 'Today'}</span>
        </div>
      </div>

      {/* Incidents */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>{isAr ? 'الحوادث الأخيرة' : 'Recent Incidents'}</h2>
        </div>
        {incidents.map((inc, i) => {
          const ic = incidentStatus[inc.status];
          return (
            <div key={i} style={{ borderBottom: i < incidents.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <button onClick={() => setExpandedIncident(expandedIncident === i ? -1 : i)} style={{
                width: '100%', padding: '14px 20px', background: 'transparent', border: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', color: 'var(--color-text)', textAlign: 'left',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{inc.title}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--color-text-muted)' }}>{inc.date}</div>
                </div>
                <span style={{
                  fontSize: '.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                  background: ic.color + '15', color: ic.color,
                }}>{ic.label}</span>
              </button>
              {expandedIncident === i && (
                <div style={{ padding: '0 20px 16px 20px' }}>
                  {inc.updates.map((u, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: j > 0 ? '1px solid var(--color-border)' : 'none' }}>
                      <span style={{ fontSize: '.72rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', minWidth: 40 }}>{u.time}</span>
                      <span style={{ fontSize: '.82rem', color: 'var(--color-text-muted)' }}>{u.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: '.72rem', color: 'var(--color-text-muted)' }}>
        {isAr ? 'اشترك في تحديثات الحالة عبر ' : 'Subscribe to status updates via '}<a href="#" style={{ color: 'var(--color-primary)' }}>{isAr ? 'البريد' : 'email'}</a>{isAr ? ' أو ' : ' or '}<a href="#" style={{ color: 'var(--color-primary)' }}>{isAr ? 'تليجرام' : 'Telegram'}</a>
      </div>
    </div>
  );
}
