import { platformPrisma } from '@/src/lib/platform-prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlatformDashboard() {
  let stats = { tenants: 0, active: 0, trial: 0, pendingPayments: 0, totalRevenue: 0, plans: 0 }
  let recentTenants: any[] = []
  let recentPayments: any[] = []

  try {
    const [tenants, active, trial, pendingPayments, plans, approved, rt, rp] = await Promise.all([
      platformPrisma.tenant.count(),
      platformPrisma.tenant.count({ where: { status: 'ACTIVE' } }),
      platformPrisma.tenant.count({ where: { status: 'TRIAL' } }),
      platformPrisma.payment.count({ where: { status: 'PENDING' } }),
      platformPrisma.plan.count({ where: { isActive: true } }),
      platformPrisma.payment.findMany({ where: { status: 'APPROVED' } }),
      platformPrisma.tenant.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { owner: true } }),
      platformPrisma.payment.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { tenant: true } }),
    ])
    stats = {
      tenants, active, trial, pendingPayments, plans,
      totalRevenue: approved.reduce((sum: number, p) => sum + p.amount, 0)
    }
    recentTenants = rt
    recentPayments = rp
  } catch (e) { /* DB not ready */ }

  const statusMap: Record<string, { label: string; cls: string }> = {
    ACTIVE: { label: 'نشط', cls: 'green' },
    TRIAL: { label: 'تجريبي', cls: 'orange' },
    SUSPENDED: { label: 'معلق', cls: 'red' },
    CANCELLED: { label: 'ملغى', cls: 'red' },
    PENDING: { label: 'معلقة', cls: 'orange' },
    APPROVED: { label: 'مقبولة', cls: 'green' },
    REJECTED: { label: 'مرفوضة', cls: 'red' },
  }

  return (
    <div>
      {/* Header */}
      <div className="pf-page-header">
        <h1 className="pf-page-title">لوحة تحكم المنصة</h1>
        <p className="pf-page-subtitle">مرحباً بك — إدارة شاملة لجميع المتاجر والاشتراكات</p>
      </div>

      {/* Stats */}
      <div className="pf-stats-grid">
        {[
          { label: 'إجمالي المتاجر', value: stats.tenants, icon: '🏪', color: 'orange' },
          { label: 'متاجر نشطة', value: stats.active, icon: '📈', color: 'green' },
          { label: 'فترة تجريبية', value: stats.trial, icon: '⏳', color: 'blue' },
          { label: 'مدفوعات معلقة', value: stats.pendingPayments, icon: '💳', color: 'red' },
        ].map((s, i) => (
          <div key={i} className={`pf-stat-card ${s.color}`}>
            <div className={`pf-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="pf-stat-value">{s.value}</div>
            <div className="pf-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two Column */}
      <div className="pf-grid-2">
        {/* Recent Tenants */}
        <div className="pf-card">
          <div className="pf-card-header">
            <h3 className="pf-card-title">🏪 أحدث المتاجر</h3>
            <Link href="/platform/tenants" className="pf-card-link">عرض الكل ←</Link>
          </div>
          <div className="pf-card-body">
            {recentTenants.length === 0 ? (
              <div className="pf-empty">
                <div className="pf-empty-icon">🏪</div>
                <p className="pf-empty-text">لا توجد متاجر بعد</p>
                <Link href="/platform/tenants/new" className="pf-card-link" style={{ marginTop: 8, display: 'inline-block' }}>+ إنشاء أول متجر</Link>
              </div>
            ) : (
              recentTenants.map((t) => (
                <div key={t.id} className="pf-list-item">
                  <div>
                    <div className="pf-list-name">{t.name}</div>
                    <div className="pf-list-sub">{t.owner?.email || t.subdomain}</div>
                  </div>
                  <span className={`pf-badge ${statusMap[t.status]?.cls || 'blue'}`}>
                    {statusMap[t.status]?.label || t.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="pf-card">
          <div className="pf-card-header">
            <h3 className="pf-card-title">💳 أحدث المدفوعات</h3>
            <Link href="/platform/payments" className="pf-card-link">عرض الكل ←</Link>
          </div>
          <div className="pf-card-body">
            {recentPayments.length === 0 ? (
              <div className="pf-empty">
                <div className="pf-empty-icon">💳</div>
                <p className="pf-empty-text">لا توجد مدفوعات بعد</p>
              </div>
            ) : (
              recentPayments.map((p) => (
                <div key={p.id} className="pf-list-item">
                  <div>
                    <div className="pf-list-name">{p.tenant?.name || 'متجر'}</div>
                    <div className="pf-list-sub">{p.type === 'SUBSCRIPTION' ? 'اشتراك' : 'إضافة'}</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: 14 }}>{p.amount} ج.م</div>
                    <span className={`pf-badge ${statusMap[p.status]?.cls || 'blue'}`} style={{ fontSize: 10 }}>
                      {statusMap[p.status]?.label || p.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pf-card">
        <div className="pf-card-header">
          <h3 className="pf-card-title">⚡ إجراءات سريعة</h3>
        </div>
        <div className="pf-card-body">
          <div className="pf-quick-actions">
            <Link href="/platform/tenants/new" className="pf-quick-btn">➕ إنشاء متجر جديد</Link>
            <Link href="/platform/plans" className="pf-quick-btn">📦 إدارة الخطط</Link>
            <Link href="/platform/payments" className="pf-quick-btn">💰 مراجعة المدفوعات</Link>
            <Link href="/platform/analytics" className="pf-quick-btn">📊 الإحصائيات</Link>
            <Link href="/platform/features" className="pf-quick-btn">🛡️ إدارة الميزات</Link>
            <Link href="/platform/settings" className="pf-quick-btn">⚙️ الإعدادات</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
