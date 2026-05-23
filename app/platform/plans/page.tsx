'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react'

interface Feature { key: string; name: string }
interface Plan {
  id: string; name: string; nameAr?: string; description?: string;
  price: number; billingCycle: string; maxProducts: number; maxOrders: number;
  maxStaff: number; maxCategories: number; storageGB: number; features: string;
  isActive: boolean; sortOrder: number
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const emptyForm = {
    name: '', nameAr: '', description: '', price: 0, billingCycle: 'MONTHLY',
    maxProducts: 20, maxOrders: 100, maxStaff: 2, maxCategories: 5, storageGB: 1,
    features: [] as string[],
  }
  const [form, setForm] = useState(emptyForm)

  const loadData = async () => {
    setLoading(true)
    const [plansRes, featuresRes] = await Promise.all([
      fetch('/api/platform/plans').then(r => r.json()),
      fetch('/api/platform/features').then(r => r.json()).catch(() => ({ features: [] })),
    ])
    setPlans(plansRes.plans || [])
    setFeatures(featuresRes.features || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const url = editingId ? `/api/platform/plans/${editingId}` : '/api/platform/plans'
    const method = editingId ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    loadData()
  }

  const handleEdit = (plan: Plan) => {
    setForm({
      name: plan.name, nameAr: plan.nameAr || '', description: plan.description || '',
      price: plan.price, billingCycle: plan.billingCycle,
      maxProducts: plan.maxProducts, maxOrders: plan.maxOrders,
      maxStaff: plan.maxStaff, maxCategories: plan.maxCategories, storageGB: plan.storageGB,
      features: JSON.parse(plan.features || '[]'),
    })
    setEditingId(plan.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخطة؟')) return
    await fetch(`/api/platform/plans/${id}`, { method: 'DELETE' })
    loadData()
  }

  const toggleFeature = (key: string) => {
    setForm(f => ({
      ...f,
      features: f.features.includes(key)
        ? f.features.filter(k => k !== key)
        : [...f.features, key],
    }))
  }

  if (loading) return <div className="text-dark-200 text-center py-12">جاري التحميل...</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة الخطط</h1>
          <p className="text-dark-200 text-sm mt-1">أنشئ وعدّل خطط الاشتراكات</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }}
          className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> خطة جديدة
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">
          <h2 className="font-bold text-white">{editingId ? '✏️ تعديل الخطة' : '➕ خطة جديدة'}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">الاسم (English)</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Basic" required />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">الاسم (عربي)</label>
              <input className="input-field" value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                placeholder="أساسية" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-200 mb-1">الوصف</label>
            <input className="input-field" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="وصف مختصر للخطة" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">السعر (ج.م)</label>
              <input className="input-field" type="number" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} required />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">دورة الفوترة</label>
              <select className="input-field" value={form.billingCycle}
                onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value }))}>
                <option value="MONTHLY">شهرياً</option>
                <option value="YEARLY">سنوياً</option>
                <option value="LIFETIME">مدى الحياة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">التخزين (GB)</label>
              <input className="input-field" type="number" value={form.storageGB}
                onChange={e => setForm(f => ({ ...f, storageGB: parseFloat(e.target.value) || 1 }))} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">حد المنتجات</label>
              <input className="input-field" type="number" value={form.maxProducts}
                onChange={e => setForm(f => ({ ...f, maxProducts: parseInt(e.target.value) || 0 }))}
                title="-1 = غير محدود" />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">حد الطلبات/شهر</label>
              <input className="input-field" type="number" value={form.maxOrders}
                onChange={e => setForm(f => ({ ...f, maxOrders: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">حد الموظفين</label>
              <input className="input-field" type="number" value={form.maxStaff}
                onChange={e => setForm(f => ({ ...f, maxStaff: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">حد الأقسام</label>
              <input className="input-field" type="number" value={form.maxCategories}
                onChange={e => setForm(f => ({ ...f, maxCategories: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>

          {/* Features toggle */}
          {features.length > 0 && (
            <div>
              <label className="block text-sm text-dark-200 mb-2">الميزات المتاحة</label>
              <div className="flex flex-wrap gap-2">
                {features.map(f => (
                  <button key={f.key} type="button" onClick={() => toggleFeature(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.features.includes(f.key)
                        ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                        : 'bg-dark-600 text-dark-200 border border-white/5 hover:border-white/10'
                    }`}>
                    {form.features.includes(f.key) ? <Check className="w-3 h-3 inline mr-1" /> : null}
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editingId ? 'حفظ التعديلات' : 'إنشاء الخطة'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-secondary">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => {
          const planFeatures = JSON.parse(plan.features || '[]') as string[]
          return (
            <div key={plan.id} className="card-base p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                  {plan.nameAr && <div className="text-xs text-dark-200">{plan.nameAr}</div>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(plan)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-dark-200 hover:text-brand-300 transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(plan.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-200 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-2xl font-bold text-brand-300">
                {plan.price} <span className="text-sm text-dark-200">ج.م / {plan.billingCycle === 'MONTHLY' ? 'شهر' : plan.billingCycle === 'YEARLY' ? 'سنة' : 'مدى الحياة'}</span>
              </div>

              {plan.description && <p className="text-sm text-dark-200">{plan.description}</p>}

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-dark-200">
                  <span>المنتجات</span>
                  <span className="text-white">{plan.maxProducts === -1 ? '∞' : plan.maxProducts}</span>
                </div>
                <div className="flex justify-between text-dark-200">
                  <span>الطلبات/شهر</span>
                  <span className="text-white">{plan.maxOrders === -1 ? '∞' : plan.maxOrders}</span>
                </div>
                <div className="flex justify-between text-dark-200">
                  <span>الموظفين</span>
                  <span className="text-white">{plan.maxStaff === -1 ? '∞' : plan.maxStaff}</span>
                </div>
                <div className="flex justify-between text-dark-200">
                  <span>التخزين</span>
                  <span className="text-white">{plan.storageGB} GB</span>
                </div>
              </div>

              {planFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                  {planFeatures.map(f => (
                    <span key={f} className="badge-blue text-xs">{f}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {plans.length === 0 && (
          <div className="col-span-full text-center py-12 text-dark-200">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد خطط بعد. أنشئ أول خطة!</p>
          </div>
        )}
      </div>
    </div>
  )
}
