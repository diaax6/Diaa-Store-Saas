import { platformPrisma } from '@/src/lib/platform-prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TenantsPage() {
  let tenants: any[] = []
  try {
    tenants = await platformPrisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: { owner: true, subscriptions: { include: { plan: true }, take: 1, orderBy: { createdAt: 'desc' } } },
    })
  } catch (e) {}

  const statusMap: Record<string, { label: string; cls: string }> = {
    ACTIVE: { label: 'نشط', cls: 'green' },
    TRIAL: { label: 'تجريبي', cls: 'orange' },
    SUSPENDED: { label: 'معلق', cls: 'red' },
    CANCELLED: { label: 'ملغى', cls: 'red' },
  }

  return (
    <div>
      <div className="pf-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="pf-page-title">إدارة المتاجر</h1>
          <p className="pf-page-subtitle">عرض وإدارة جميع متاجر المنصة ({tenants.length} متجر)</p>
        </div>
        <Link href="/platform/tenants/new" className="pf-btn pf-btn-primary">➕ إنشاء متجر جديد</Link>
      </div>

      <div className="pf-card">
        <table className="pf-table">
          <thead>
            <tr>
              <th>المتجر</th>
              <th>المالك</th>
              <th>الخطة</th>
              <th>الحالة</th>
              <th>تاريخ الإنشاء</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="pf-empty">
                    <div className="pf-empty-icon">🏪</div>
                    <p className="pf-empty-text">لا توجد متاجر بعد</p>
                  </div>
                </td>
              </tr>
            ) : (
              tenants.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="pf-list-name">{t.name}</div>
                    <div className="pf-list-sub">{t.subdomain}.diaastore.cloud</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{t.owner?.name}</div>
                    <div className="pf-list-sub">{t.owner?.email}</div>
                  </td>
                  <td>
                    <span className="pf-badge purple">{t.subscriptions?.[0]?.plan?.name || 'بدون خطة'}</span>
                  </td>
                  <td>
                    <span className={`pf-badge ${statusMap[t.status]?.cls || 'blue'}`}>
                      {statusMap[t.status]?.label || t.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>
                    {new Date(t.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td>
                    <Link href={`/platform/tenants/${t.id}`} className="pf-btn pf-btn-ghost pf-btn-sm">عرض</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
