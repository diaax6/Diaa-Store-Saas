'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Trash2 } from 'lucide-react'

interface Feature { id: string; key: string; name: string; nameAr?: string; description?: string; category: string }

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ key: '', name: '', nameAr: '', description: '', category: 'GENERAL' })

  const loadData = async () => {
    const res = await fetch('/api/platform/features').then(r => r.json())
    setFeatures(res.features || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/platform/features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ key: '', name: '', nameAr: '', description: '', category: 'GENERAL' })
    loadData()
  }

  const categories: Record<string, string> = {
    GENERAL: 'عام', DELIVERY: 'تسليم', COMMUNICATION: 'تواصل', ADVANCED: 'متقدم',
  }

  if (loading) return <div className="text-dark-200 text-center py-12">جاري التحميل...</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">إدارة الميزات</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> ميزة جديدة
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">Key (بالإنجليزي)</label>
              <input className="input-field" value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))}
                placeholder="telegram_bot" required />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">الاسم</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Telegram Bot" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">الاسم (عربي)</label>
              <input className="input-field" value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">الفئة</label>
              <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="GENERAL">عام</option>
                <option value="DELIVERY">تسليم</option>
                <option value="COMMUNICATION">تواصل</option>
                <option value="ADVANCED">متقدم</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">إنشاء</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">إلغاء</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(categories).map(([catKey, catLabel]) => {
          const catFeatures = features.filter(f => f.category === catKey)
          if (catFeatures.length === 0) return null
          return (
            <div key={catKey} className="card-base p-6">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" /> {catLabel}
              </h2>
              <div className="space-y-2">
                {catFeatures.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2.5 rounded-xl bg-dark-600">
                    <div>
                      <div className="text-sm text-white">{f.name}</div>
                      <div className="text-xs text-dark-200 font-mono">{f.key}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
