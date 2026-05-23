import { platformPrisma } from '@/src/lib/platform-prisma'
import { CreditCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SubscriptionsPage() {
  const subscriptions = await platformPrisma.subscription.findMany({
    include: { tenant: true, plan: true },
    orderBy: { createdAt: 'desc' },
  })

  const statusBadge = (s: string) => {
    const m: Record<string, { c: string; l: string }> = {
      ACTIVE: { c: 'badge-green', l: 'نشط' }, EXPIRED: { c: 'badge-red', l: 'منتهي' },
      CANCELLED: { c: 'badge-gray', l: 'ملغي' }, SUSPENDED: { c: 'badge-yellow', l: 'موقوف' },
    }
    const b = m[s] || { c: 'badge-gray', l: s }
    return <span className={b.c}>{b.l}</span>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">إدارة الاشتراكات</h1>
      <div className="card-base overflow-hidden">
        {subscriptions.length === 0 ? (
          <div className="text-center py-16 text-dark-200">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد اشتراكات</p>
          </div>
        ) : (
          <table className="table-base">
            <thead><tr><th>المتجر</th><th>الخطة</th><th>الحالة</th><th>تاريخ البداية</th><th>تاريخ الانتهاء</th></tr></thead>
            <tbody>
              {subscriptions.map(s => (
                <tr key={s.id}>
                  <td className="text-white font-medium">{s.tenant.name}</td>
                  <td><span className="badge-blue">{s.plan.name}</span></td>
                  <td>{statusBadge(s.status)}</td>
                  <td className="text-dark-200 text-sm">{new Date(s.startDate).toLocaleDateString('ar-EG')}</td>
                  <td className="text-dark-200 text-sm">{s.endDate ? new Date(s.endDate).toLocaleDateString('ar-EG') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
