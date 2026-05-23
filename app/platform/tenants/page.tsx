import { platformPrisma } from '@/src/lib/platform-prisma'
import Link from 'next/link'
import { Store, Plus, Search, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TenantsPage() {
  const tenants = await platformPrisma.tenant.findMany({
    include: {
      owner: true,
      subscriptions: {
        include: { plan: true },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      ACTIVE:    { class: 'badge-green', label: 'نشط' },
      TRIAL:     { class: 'badge-yellow', label: 'تجريبي' },
      SUSPENDED: { class: 'badge-red', label: 'موقوف' },
      CANCELLED: { class: 'badge-gray', label: 'ملغي' },
    }
    const b = map[status] || { class: 'badge-gray', label: status }
    return <span className={b.class}>{b.label}</span>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة المتاجر</h1>
          <p className="text-dark-200 text-sm mt-1">{tenants.length} متجر مسجل</p>
        </div>
        <Link href="/platform/tenants/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> إنشاء متجر جديد
        </Link>
      </div>

      <div className="card-base overflow-hidden">
        {tenants.length === 0 ? (
          <div className="text-center py-16">
            <Store className="w-12 h-12 mx-auto mb-4 text-dark-200 opacity-30" />
            <p className="text-dark-200">لا توجد متاجر بعد</p>
            <Link href="/platform/tenants/new" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> إنشاء أول متجر
            </Link>
          </div>
        ) : (
          <table className="table-base">
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
              {tenants.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center text-sm font-bold text-brand-300">
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">{t.name}</div>
                        <div className="text-xs text-dark-200">{t.subdomain}.diaastore.com</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-white">{t.owner.name}</div>
                    <div className="text-xs text-dark-200">{t.owner.email}</div>
                  </td>
                  <td>
                    <span className="badge-blue">
                      {t.subscriptions[0]?.plan?.name || 'بدون خطة'}
                    </span>
                  </td>
                  <td>{statusBadge(t.status)}</td>
                  <td className="text-sm text-dark-200">
                    {new Date(t.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/platform/tenants/${t.id}`}
                        className="px-3 py-1.5 text-xs rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 transition-all"
                      >
                        تفاصيل
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
