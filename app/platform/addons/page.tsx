'use client'

import { useState, useEffect } from 'react'
import { Puzzle, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'

interface AddOn {
  id: string; name: string; nameAr?: string; description?: string;
  price: number; billingType: string; activationType: string;
  featureKey?: string; isActive: boolean
}

export default function AddOnsPage() {
  const [addons, setAddons] = useState<AddOn[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const emptyForm = {
    name: '', nameAr: '', description: '', price: 0,
    billingType: 'MONTHLY', activationType: 'MANUAL', featureKey: '',
  }
  const [form, setForm] = useState(emptyForm)

  const loadData = async () => {
    setLoading(true)
    const res = await fetch('/api/platform/addons').then(r => r.json())
    setAddons(res.addons || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const url = editingId ? `/api/platform/addons/${editingId}` : '/api/platform/addons'
    await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه الخدمة الإضافية؟')) return
    await fetch(`/api/platform/addons/${id}`, { method: 'DELETE' })
    loadData()
  }

  if (loading) return <div className="text-dark-200 text-center py-12">جاري التحميل...</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">الخدمات الإضافية</h1>
          <p className="text-dark-200 text-sm mt-1">خدمات يشتريها صاحب المتجر</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }}
          className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> خدمة جديدة
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">
          <h2 className="font-bold text-white">{editingId ? '✏️ تعديل' : '➕ خدمة جديدة'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">الاسم (English)</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">الاسم (عربي)</label>
              <input className="input-field" value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-dark-200 mb-1">الوصف</label>
            <input className="input-field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">السعر (ج.م)</label>
              <input className="input-field" type="number" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} required />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">نوع الفوترة</label>
              <select className="input-field" value={form.billingType}
                onChange={e => setForm(f => ({ ...f, billingType: e.target.value }))}>
                <option value="MONTHLY">شهري</option>
                <option value="YEARLY">سنوي</option>
                <option value="ONE_TIME">مرة واحدة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">نوع التفعيل</label>
              <select className="input-field" value={form.activationType}
                onChange={e => setForm(f => ({ ...f, activationType: e.target.value }))}>
                <option value="MANUAL">يدوي</option>
                <option value="AUTO">تلقائي</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? '⏳' : editingId ? 'حفظ' : 'إنشاء'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">إلغاء</button>
          </div>
        </form>
      )}

      <div className="card-base overflow-hidden">
        {addons.length === 0 ? (
          <div className="text-center py-12 text-dark-200">
            <Puzzle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد خدمات إضافية بعد</p>
          </div>
        ) : (
          <table className="table-base">
            <thead>
              <tr><th>الخدمة</th><th>السعر</th><th>الفوترة</th><th>التفعيل</th><th>إجراءات</th></tr>
            </thead>
            <tbody>
              {addons.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="font-medium text-white">{a.name}</div>
                    {a.nameAr && <div className="text-xs text-dark-200">{a.nameAr}</div>}
                  </td>
                  <td className="text-white">{a.price} ج.م</td>
                  <td>
                    <span className="badge-blue text-xs">
                      {a.billingType === 'MONTHLY' ? 'شهري' : a.billingType === 'YEARLY' ? 'سنوي' : 'مرة واحدة'}
                    </span>
                  </td>
                  <td>
                    <span className={a.activationType === 'AUTO' ? 'badge-green text-xs' : 'badge-yellow text-xs'}>
                      {a.activationType === 'AUTO' ? 'تلقائي' : 'يدوي'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => { setForm({ name: a.name, nameAr: a.nameAr || '', description: a.description || '', price: a.price, billingType: a.billingType, activationType: a.activationType, featureKey: a.featureKey || '' }); setEditingId(a.id); setShowForm(true) }}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-dark-200 hover:text-brand-300">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(a.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-200 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
