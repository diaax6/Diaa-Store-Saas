import { platformPrisma } from '@/src/lib/platform-prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlatformDashboard() {
  let stats = { tenants: 0, active: 0, trial: 0, pendingPayments: 0 }
  let recentTenants: any[] = []
  let recentPayments: any[] = []

  try {
    const [tenants, active, trial, pendingPayments, rt, rp] = await Promise.all([
      platformPrisma.tenant.count(),
      platformPrisma.tenant.count({ where: { status: 'ACTIVE' } }),
      platformPrisma.tenant.count({ where: { status: 'TRIAL' } }),
      platformPrisma.payment.count({ where: { status: 'PENDING' } }),
      platformPrisma.tenant.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { owner: true } }),
      platformPrisma.payment.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { tenant: true } }),
    ])
    stats = { tenants, active, trial, pendingPayments }
    recentTenants = rt
    recentPayments = rp
  } catch (e) { /* DB not ready */ }

  return (
    <div style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: 0 }}>لوحة تحكم المنصة</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>مرحباً بك في لوحة Super Admin — إدارة كاملة لجميع المتاجر</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'إجمالي المتاجر', value: stats.tenants, icon: '🏪', gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.05))', border: 'rgba(99,102,241,0.25)', iconBg: 'rgba(99,102,241,0.2)' },
          { label: 'متاجر نشطة', value: stats.active, icon: '📈', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.05))', border: 'rgba(16,185,129,0.25)', iconBg: 'rgba(16,185,129,0.2)' },
          { label: 'فترة تجريبية', value: stats.trial, icon: '⏳', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.05))', border: 'rgba(245,158,11,0.25)', iconBg: 'rgba(245,158,11,0.2)' },
          { label: 'مدفوعات معلقة', value: stats.pendingPayments, icon: '💳', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(248,113,113,0.05))', border: 'rgba(239,68,68,0.25)', iconBg: 'rgba(239,68,68,0.2)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.gradient,
            border: `1px solid ${s.border}`,
            borderRadius: 16,
            padding: '24px 20px',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Recent Tenants */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 700, margin: 0 }}>🏪 أحدث المتاجر</h3>
            <Link href="/platform/tenants" style={{ color: '#818cf8', fontSize: 13, textDecoration: 'none' }}>عرض الكل ←</Link>
          </div>
          <div style={{ padding: 20 }}>
            {recentTenants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
                <p style={{ margin: 0 }}>لا توجد متاجر بعد</p>
                <Link href="/platform/tenants/new" style={{ color: '#818cf8', fontSize: 13, marginTop: 8, display: 'inline-block' }}>+ إنشاء أول متجر</Link>
              </div>
            ) : (
              recentTenants.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{t.owner?.email}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: t.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: t.status === 'ACTIVE' ? '#10b981' : '#f59e0b' }}>
                    {t.status === 'ACTIVE' ? 'نشط' : t.status === 'TRIAL' ? 'تجريبي' : t.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 700, margin: 0 }}>💳 أحدث المدفوعات</h3>
            <Link href="/platform/payments" style={{ color: '#818cf8', fontSize: 13, textDecoration: 'none' }}>عرض الكل ←</Link>
          </div>
          <div style={{ padding: 20 }}>
            {recentPayments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
                <p style={{ margin: 0 }}>لا توجد مدفوعات بعد</p>
              </div>
            ) : (
              recentPayments.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 14 }}>{p.tenant?.name || 'متجر'}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{p.type}</div>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: 14 }}>{p.amount} ج.م</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
        <h3 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 700, margin: '0 0 16px 0' }}>⚡ إجراءات سريعة</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { href: '/platform/tenants/new', label: '+ إنشاء متجر جديد', bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
            { href: '/platform/plans', label: '📦 إدارة الخطط', bg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
            { href: '/platform/payments', label: '💰 مراجعة المدفوعات', bg: 'linear-gradient(135deg, #10b981, #059669)' },
            { href: '/platform/analytics', label: '📊 الإحصائيات', bg: 'linear-gradient(135deg, #ec4899, #be185d)' },
          ].map((a, i) => (
            <Link key={i} href={a.href} style={{
              background: a.bg,
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>{a.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
