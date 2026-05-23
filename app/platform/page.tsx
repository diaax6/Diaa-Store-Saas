import { platformPrisma } from '@/src/lib/platform-prisma'
import { Store, Users, CreditCard, TrendingUp, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlatformDashboard() {
  const [
    totalTenants,
    activeTenants,
    trialTenants,
    suspendedTenants,
    totalPayments,
    pendingPayments,
    recentTenants,
    recentPayments,
  ] = await Promise.all([
    platformPrisma.tenant.count(),
    platformPrisma.tenant.count({ where: { status: 'ACTIVE' } }),
    platformPrisma.tenant.count({ where: { status: 'TRIAL' } }),
    platformPrisma.tenant.count({ where: { status: 'SUSPENDED' } }),
    platformPrisma.payment.count({ where: { status: 'APPROVED' } }),
    platformPrisma.payment.count({ where: { status: 'PENDING' } }),
    platformPrisma.tenant.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
      include: { owner: true, subscriptions: { include: { plan: true }, take: 1, orderBy: { createdAt: 'desc' } } },
    }),
    platformPrisma.payment.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
      include: { tenant: true },
    }),
  ])

  const stats = [
    { label: 'إجمالي المتاجر', value: totalTenants, icon: Store, color: 'brand' },
    { label: 'متاجر نشطة', value: activeTenants, icon: TrendingUp, color: 'emerald' },
    { label: 'فترة تجريبية', value: trialTenants, icon: Clock, color: 'amber' },
    { label: 'مدفوعات معلقة', value: pendingPayments, icon: CreditCard, color: 'red' },
  ]

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      ACTIVE:    { class: 'badge-green', label: 'نشط' },
      TRIAL:     { class: 'badge-yellow', label: 'تجريبي' },
      SUSPENDED: { class: 'badge-red', label: 'موقوف' },
      CANCELLED: { class: 'badge-gray', label: 'ملغي' },
      PENDING:   { class: 'badge-yellow', label: 'في الانتظار' },
      APPROVED:  { class: 'badge-green', label: 'مقبول' },
      REJECTED:  { class: 'badge-red', label: 'مرفوض' },
    }
    const b = map[status] || { class: 'badge-gray', label: status }
    return <span className={b.class}>{b.label}</span>
  }

  const colorMap: Record<string, string> = {
    brand: 'from-brand-500/20 to-brand-600/10 border-brand-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
    amber: 'from-amber-400/20 to-amber-500/10 border-amber-400/20',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20',
  }

  const iconColorMap: Record<string, string> = {
    brand: 'text-brand-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">لوحة تحكم المنصة</h1>
        <p className="text-dark-200 text-sm mt-1">مرحباً بك في لوحة Super Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label}
              className={`stat-card bg-gradient-to-br ${colorMap[stat.color]} border`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${iconColorMap[stat.color]}`} />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-dark-200 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenants */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-brand-400" /> أحدث المتاجر
            </h2>
            <Link href="/platform/tenants" className="text-xs text-brand-400 hover:text-brand-300">
              عرض الكل ←
            </Link>
          </div>
          <div className="space-y-3">
            {recentTenants.length === 0 ? (
              <p className="text-dark-200 text-sm text-center py-8">لا توجد متاجر بعد</p>
            ) : recentTenants.map(t => (
              <Link key={t.id} href={`/platform/tenants/${t.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center text-sm font-bold text-brand-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-dark-200">{t.subdomain}.diaastore.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(t.status)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-400" /> أحدث المدفوعات
            </h2>
            <Link href="/platform/payments" className="text-xs text-brand-400 hover:text-brand-300">
              عرض الكل ←
            </Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-dark-200 text-sm text-center py-8">لا توجد مدفوعات بعد</p>
            ) : recentPayments.map(p => (
              <div key={p.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-all"
              >
                <div>
                  <div className="text-sm font-medium text-white">{p.tenant.name}</div>
                  <div className="text-xs text-dark-200">{p.type} — {p.amount} ج.م</div>
                </div>
                {statusBadge(p.status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-base p-6">
        <h2 className="font-bold text-white mb-4">⚡ إجراءات سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/platform/tenants/new" className="btn-primary flex items-center gap-2">
            <Store className="w-4 h-4" /> إنشاء متجر جديد
          </Link>
          <Link href="/platform/plans" className="btn-secondary flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> إدارة الخطط
          </Link>
          <Link href="/platform/payments" className="btn-secondary flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> مدفوعات معلقة ({pendingPayments})
          </Link>
        </div>
      </div>
    </div>
  )
}
