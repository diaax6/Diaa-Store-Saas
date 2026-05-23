import { platformPrisma } from '@/src/lib/platform-prisma'
import { BarChart3, Store, CreditCard, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const [totalTenants, activeTenants, totalPayments, approvedPayments] = await Promise.all([
    platformPrisma.tenant.count(),
    platformPrisma.tenant.count({ where: { status: 'ACTIVE' } }),
    platformPrisma.payment.count(),
    platformPrisma.payment.findMany({ where: { status: 'APPROVED' } }),
  ])

  const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">إحصائيات المنصة</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20">
          <Store className="w-5 h-5 text-brand-400 mb-3" />
          <div className="text-2xl font-bold text-white">{totalTenants}</div>
          <div className="text-xs text-dark-200">إجمالي المتاجر</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20">
          <TrendingUp className="w-5 h-5 text-emerald-400 mb-3" />
          <div className="text-2xl font-bold text-white">{activeTenants}</div>
          <div className="text-xs text-dark-200">متاجر نشطة</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/20">
          <CreditCard className="w-5 h-5 text-amber-400 mb-3" />
          <div className="text-2xl font-bold text-white">{totalPayments}</div>
          <div className="text-xs text-dark-200">إجمالي المدفوعات</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20">
          <BarChart3 className="w-5 h-5 text-purple-400 mb-3" />
          <div className="text-2xl font-bold text-white">{totalRevenue.toLocaleString('ar-EG')} ج.م</div>
          <div className="text-xs text-dark-200">إجمالي الإيرادات</div>
        </div>
      </div>

      <div className="card-base p-8 text-center text-dark-200">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="text-lg">رسوم بيانية متقدمة قريباً...</p>
        <p className="text-sm mt-2">سيتم إضافة charts وتحليلات تفصيلية</p>
      </div>
    </div>
  )
}
