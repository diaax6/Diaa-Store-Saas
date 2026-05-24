import { platformPrisma } from '@/src/lib/platform-prisma'

export const dynamic = 'force-dynamic'

export default async function PlansPage() {
  let plans: any[] = []
  try {
    plans = await platformPrisma.plan.findMany({ orderBy: { sortOrder: 'asc' } })
  } catch (e) {}

  return (
    <div>
      <div className="pf-page-header">
        <h1 className="pf-page-title">الخطط والأسعار</h1>
        <p className="pf-page-subtitle">إدارة خطط الاشتراك المتاحة للمتاجر</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {plans.map(p => {
          const features = JSON.parse(p.features || '[]')
          return (
            <div key={p.id} className="pf-card" style={{ borderTop: `3px solid ${p.isDefault ? '#f97316' : 'transparent'}` }}>
              <div className="pf-card-body" style={{ textAlign: 'center' }}>
                {p.isDefault && <span className="pf-badge orange" style={{ marginBottom: 12, display: 'inline-block' }}>الافتراضية</span>}
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>{p.nameAr || p.name}</h3>
                <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 20px 0' }}>{p.description}</p>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#f97316', marginBottom: 4 }}>
                  {p.price} <span style={{ fontSize: 14, color: '#64748b' }}>ج.م / شهر</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '20px 0', padding: '20px 0 0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'start', fontSize: 13 }}>
                    <div style={{ color: '#94a3b8' }}>📦 المنتجات:</div>
                    <div style={{ color: '#f8fafc', fontWeight: 600 }}>{p.maxProducts === -1 ? 'غير محدود' : p.maxProducts}</div>
                    <div style={{ color: '#94a3b8' }}>📋 الطلبات:</div>
                    <div style={{ color: '#f8fafc', fontWeight: 600 }}>{p.maxOrders === -1 ? 'غير محدود' : p.maxOrders}</div>
                    <div style={{ color: '#94a3b8' }}>👥 الموظفين:</div>
                    <div style={{ color: '#f8fafc', fontWeight: 600 }}>{p.maxStaff === -1 ? 'غير محدود' : p.maxStaff}</div>
                    <div style={{ color: '#94a3b8' }}>💾 التخزين:</div>
                    <div style={{ color: '#f8fafc', fontWeight: 600 }}>{p.storageGB} GB</div>
                  </div>
                </div>
                <div style={{ textAlign: 'start', fontSize: 12, color: '#64748b' }}>
                  <div style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>الميزات ({features.length}):</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {features.map((f: string) => (
                      <span key={f} className="pf-badge blue" style={{ fontSize: 10 }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
