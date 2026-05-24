import { platformPrisma } from '@/src/lib/platform-prisma'

export const dynamic = 'force-dynamic'

export default async function FeaturesPage() {
  let features: any[] = []
  try {
    features = await platformPrisma.platformFeature.findMany({ orderBy: { category: 'asc' } })
  } catch (e) {}

  const categoryMap: Record<string, { label: string; icon: string }> = {
    GENERAL: { label: 'عام', icon: '📦' },
    DELIVERY: { label: 'التوصيل', icon: '🚚' },
    COMMUNICATION: { label: 'التواصل', icon: '💬' },
    ADVANCED: { label: 'متقدم', icon: '⚡' },
  }

  const grouped = features.reduce((acc: Record<string, any[]>, f) => {
    if (!acc[f.category]) acc[f.category] = []
    acc[f.category].push(f)
    return acc
  }, {})

  return (
    <div>
      <div className="pf-page-header">
        <h1 className="pf-page-title">إدارة الميزات</h1>
        <p className="pf-page-subtitle">جميع الميزات المتاحة للخطط ({features.length} ميزة)</p>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="pf-card" style={{ marginBottom: 20 }}>
          <div className="pf-card-header">
            <h3 className="pf-card-title">{categoryMap[cat]?.icon} {categoryMap[cat]?.label || cat}</h3>
            <span className="pf-badge blue">{(items as any[]).length} ميزة</span>
          </div>
          <div className="pf-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {(items as any[]).map(f => (
                <div key={f.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{f.nameAr || f.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{f.key}</div>
                  </div>
                  <span className={`pf-badge ${f.isActive ? 'green' : 'red'}`}>
                    {f.isActive ? 'مفعلة' : 'معطلة'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
