import { platformPrisma } from '@/src/lib/platform-prisma'
import { FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  const payments = await platformPrisma.payment.findMany({
    include: { tenant: true },
    orderBy: { createdAt: 'desc' },
  })

  const statusBadge = (s: string) => {
    const m: Record<string, { c: string; l: string }> = {
      PENDING: { c: 'badge-yellow', l: 'في الانتظار' },
      APPROVED: { c: 'badge-green', l: 'مقبول' },
      REJECTED: { c: 'badge-red', l: 'مرفوض' },
    }
    const b = m[s] || { c: 'badge-gray', l: s }
    return <span className={b.c}>{b.l}</span>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">مراجعة المدفوعات</h1>
      <div className="card-base overflow-hidden">
        {payments.length === 0 ? (
          <div className="text-center py-16 text-dark-200">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد مدفوعات</p>
          </div>
        ) : (
          <table className="table-base">
            <thead><tr><th>المتجر</th><th>النوع</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td className="text-white font-medium">{p.tenant.name}</td>
                  <td className="text-sm">{p.type === 'SUBSCRIPTION' ? 'اشتراك' : 'خدمة إضافية'}</td>
                  <td className="text-white">{p.amount} ج.م</td>
                  <td>{statusBadge(p.status)}</td>
                  <td className="text-dark-200 text-sm">{new Date(p.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    {p.status === 'PENDING' && (
                      <div className="flex gap-1">
                        <form action={`/api/platform/payments/${p.id}/approve`} method="POST">
                          <button className="px-2 py-1 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">✓ قبول</button>
                        </form>
                        <form action={`/api/platform/payments/${p.id}/reject`} method="POST">
                          <button className="px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30">✗ رفض</button>
                        </form>
                      </div>
                    )}
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
