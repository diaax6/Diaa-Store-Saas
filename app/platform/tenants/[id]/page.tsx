import { platformPrisma } from '@/src/lib/platform-prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Store, User, CreditCard, Globe, Clock, Shield, ArrowRight } from 'lucide-react'
import { TenantActions } from '@/src/components/platform/tenant-actions'

export const dynamic = 'force-dynamic'

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const tenant = await platformPrisma.tenant.findUnique({
    where: { id },
    include: {
      owner: true,
      subscriptions: { include: { plan: true }, orderBy: { createdAt: 'desc' } },
      tenantAddOns: { include: { addOn: true } },
      payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      domains: true,
    },
  })

  if (!tenant) return notFound()

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      ACTIVE:    { class: 'badge-green', label: 'نشط' },
      TRIAL:     { class: 'badge-yellow', label: 'تجريبي' },
      SUSPENDED: { class: 'badge-red', label: 'موقوف' },
      CANCELLED: { class: 'badge-gray', label: 'ملغي' },
      PENDING:   { class: 'badge-yellow', label: 'في الانتظار' },
      APPROVED:  { class: 'badge-green', label: 'مقبول' },
      REJECTED:  { class: 'badge-red', label: 'مرفوض' },
      PENDING_PAYMENT: { class: 'badge-yellow', label: 'في انتظار الدفع' },
      EXPIRED:   { class: 'badge-red', label: 'منتهي' },
    }
    const b = map[status] || { class: 'badge-gray', label: status }
    return <span className={b.class}>{b.label}</span>
  }

  const currentPlan = tenant.subscriptions[0]?.plan

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 text-sm text-dark-200">
        <Link href="/platform/tenants" className="hover:text-brand-300 transition-colors">المتاجر</Link>
        <ArrowRight className="w-3 h-3 rotate-180" />
        <span className="text-white">{tenant.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-brand-300"
            style={{ background: `linear-gradient(135deg, ${tenant.primaryColor}30, ${tenant.accentColor}20)` }}>
            {tenant.name[0]}
          </div>
          <div>
            <h1 className="page-title">{tenant.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-dark-200">{tenant.subdomain}.diaastore.com</span>
              {statusBadge(tenant.status)}
            </div>
          </div>
        </div>
        <TenantActions tenantId={tenant.id} status={tenant.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner */}
          <div className="card-base p-6">
            <h2 className="font-bold text-white flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-brand-400" /> المالك
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-dark-200">الاسم:</span> <span className="text-white mr-2">{tenant.owner.name}</span></div>
              <div><span className="text-dark-200">البريد:</span> <span className="text-white mr-2">{tenant.owner.email}</span></div>
              <div><span className="text-dark-200">الهاتف:</span> <span className="text-white mr-2">{tenant.owner.phone || '—'}</span></div>
              <div><span className="text-dark-200">تاريخ الإنشاء:</span> <span className="text-white mr-2">{new Date(tenant.createdAt).toLocaleDateString('ar-EG')}</span></div>
            </div>
          </div>

          {/* Domains */}
          <div className="card-base p-6">
            <h2 className="font-bold text-white flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-brand-400" /> الدومينات
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-600">
                <div className="text-sm">
                  <span className="text-white">{tenant.subdomain}.diaastore.com</span>
                  <span className="badge-blue text-xs mr-2">Subdomain</span>
                </div>
                <span className="badge-green text-xs">مفعل</span>
              </div>
              {tenant.domains.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-600">
                  <div className="text-sm">
                    <span className="text-white">{d.domain}</span>
                    <span className="badge-purple text-xs mr-2">Custom</span>
                  </div>
                  {d.isVerified ? <span className="badge-green text-xs">مفعل</span> : <span className="badge-yellow text-xs">في الانتظار</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Payments */}
          <div className="card-base p-6">
            <h2 className="font-bold text-white flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-brand-400" /> المدفوعات
            </h2>
            {tenant.payments.length === 0 ? (
              <p className="text-dark-200 text-sm text-center py-4">لا توجد مدفوعات</p>
            ) : (
              <table className="table-base">
                <thead><tr><th>النوع</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th></tr></thead>
                <tbody>
                  {tenant.payments.map(p => (
                    <tr key={p.id}>
                      <td className="text-sm">{p.type === 'SUBSCRIPTION' ? 'اشتراك' : 'خدمة إضافية'}</td>
                      <td className="text-sm text-white">{p.amount} ج.م</td>
                      <td>{statusBadge(p.status)}</td>
                      <td className="text-sm text-dark-200">{new Date(p.createdAt).toLocaleDateString('ar-EG')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="card-base p-6">
            <h2 className="font-bold text-white flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-brand-400" /> الخطة الحالية
            </h2>
            {currentPlan ? (
              <div>
                <div className="text-xl font-bold text-brand-300 mb-1">{currentPlan.name}</div>
                <div className="text-sm text-dark-200 mb-3">{currentPlan.price} ج.م / شهر</div>
                <div className="space-y-1.5 text-xs text-dark-200">
                  <div className="flex justify-between"><span>المنتجات</span><span className="text-white">{currentPlan.maxProducts === -1 ? '∞' : currentPlan.maxProducts}</span></div>
                  <div className="flex justify-between"><span>الطلبات</span><span className="text-white">{currentPlan.maxOrders === -1 ? '∞' : currentPlan.maxOrders}</span></div>
                  <div className="flex justify-between"><span>الموظفين</span><span className="text-white">{currentPlan.maxStaff === -1 ? '∞' : currentPlan.maxStaff}</span></div>
                </div>
              </div>
            ) : (
              <p className="text-dark-200 text-sm">بدون خطة</p>
            )}
          </div>

          {/* Add-ons */}
          <div className="card-base p-6">
            <h2 className="font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-brand-400" /> الخدمات الإضافية
            </h2>
            {tenant.tenantAddOns.length === 0 ? (
              <p className="text-dark-200 text-sm">لا توجد خدمات إضافية</p>
            ) : (
              <div className="space-y-2">
                {tenant.tenantAddOns.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-dark-600">
                    <span className="text-sm text-white">{a.addOn.name}</span>
                    {statusBadge(a.status)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="card-base p-6">
            <h2 className="font-bold text-white mb-4">📋 معلومات سريعة</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-dark-200">
                <span>Database</span>
                <span className="text-white font-mono text-xs">{tenant.dbName}</span>
              </div>
              <div className="flex justify-between text-dark-200">
                <span>Slug</span>
                <span className="text-white">{tenant.slug}</span>
              </div>
              {tenant.trialEndsAt && (
                <div className="flex justify-between text-dark-200">
                  <span>انتهاء التجربة</span>
                  <span className="text-white">{new Date(tenant.trialEndsAt).toLocaleDateString('ar-EG')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
