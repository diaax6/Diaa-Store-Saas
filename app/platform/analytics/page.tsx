import { platformPrisma } from '@/src/lib/platform-prisma'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  let stats = { tenants: 0, active: 0, trial: 0, totalPayments: 0, totalRevenue: 0, plans: 0 }

  try {
    const [tenants, active, trial, totalPayments, approved, plans] = await Promise.all([
      platformPrisma.tenant.count(),
      platformPrisma.tenant.count({ where: { status: 'ACTIVE' } }),
      platformPrisma.tenant.count({ where: { status: 'TRIAL' } }),
      platformPrisma.payment.count(),
      platformPrisma.payment.findMany({ where: { status: 'APPROVED' } }),
      platformPrisma.plan.count({ where: { isActive: true } }),
    ])
    stats = {
      tenants, active, trial, totalPayments, plans,
      totalRevenue: approved.reduce((sum: number, p) => sum + p.amount, 0)
    }
  } catch (e) {}

  return (
    <div>
      <div className="pf-page-header">
        <h1 className="pf-page-title">📊 إحصائيات المنصة</h1>
        <p className="pf-page-subtitle">نظرة شاملة على أداء المنصة</p>
      </div>

      <div className="pf-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'إجمالي المتاجر', value: stats.tenants, icon: '🏪', color: 'orange' },
          { label: 'متاجر نشطة', value: stats.active, icon: '✅', color: 'green' },
          { label: 'فترة تجريبية', value: stats.trial, icon: '⏳', color: 'blue' },
          { label: 'إجمالي المدفوعات', value: stats.totalPayments, icon: '💳', color: 'purple' },
          { label: 'إجمالي الإيرادات', value: `${stats.totalRevenue.toLocaleString('ar-EG')} ج.م`, icon: '💰', color: 'green' },
          { label: 'الخطط النشطة', value: stats.plans, icon: '📦', color: 'cyan' },
        ].map((s, i) => (
          <div key={i} className={`pf-stat-card ${s.color}`}>
            <div className={`pf-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="pf-stat-value">{s.value}</div>
            <div className="pf-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="pf-card">
        <div className="pf-card-body">
          <div className="pf-empty">
            <div className="pf-empty-icon">📊</div>
            <p className="pf-empty-text">رسوم بيانية متقدمة قريباً...</p>
            <p style={{ color: '#4b5563', fontSize: 12, marginTop: 4 }}>سيتم إضافة charts وتحليلات تفصيلية</p>
          </div>
        </div>
      </div>
    </div>
  )
}
