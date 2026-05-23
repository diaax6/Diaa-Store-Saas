'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Store, ArrowRight } from 'lucide-react'

interface Plan { id: string; name: string; price: number; billingCycle: string }

export default function NewTenantPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    tenantName: '',
    slug: '',
    subdomain: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerPhone: '',
    planId: '',
    trialDays: 7,
  })

  useEffect(() => {
    fetch('/api/platform/plans').then(r => r.json()).then(d => setPlans(d.plans || []))
  }, [])

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
    setForm(f => ({ ...f, tenantName: name, slug, subdomain: slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/platform/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        setLoading(false)
        return
      }

      router.push('/platform/tenants')
    } catch (err) {
      setError('حدث خطأ في الاتصال')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">إنشاء متجر جديد</h1>
        <p className="text-dark-200 text-sm mt-1">أنشئ متجر جديد لعميل وحدد خطته</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Info */}
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-400" /> معلومات المتجر
          </h2>

          <div>
            <label className="block text-sm text-dark-200 mb-1.5">اسم المتجر</label>
            <input className="input-field" value={form.tenantName}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="مثال: متجر أحمد" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1.5">Slug</label>
              <input className="input-field" value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="ahmed-store" required />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1.5">Subdomain</label>
              <div className="flex items-center gap-2">
                <input className="input-field" value={form.subdomain}
                  onChange={e => setForm(f => ({ ...f, subdomain: e.target.value }))}
                  placeholder="ahmed" required />
                <span className="text-xs text-dark-200 whitespace-nowrap">.diaastore.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-white">👤 بيانات المالك</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1.5">الاسم</label>
              <input className="input-field" value={form.ownerName}
                onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
                placeholder="أحمد محمد" required />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1.5">رقم الهاتف</label>
              <input className="input-field" value={form.ownerPhone}
                onChange={e => setForm(f => ({ ...f, ownerPhone: e.target.value }))}
                placeholder="+201234567890" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-200 mb-1.5">البريد الإلكتروني</label>
            <input className="input-field" type="email" value={form.ownerEmail}
              onChange={e => setForm(f => ({ ...f, ownerEmail: e.target.value }))}
              placeholder="ahmed@example.com" required />
          </div>

          <div>
            <label className="block text-sm text-dark-200 mb-1.5">كلمة المرور</label>
            <input className="input-field" type="password" value={form.ownerPassword}
              onChange={e => setForm(f => ({ ...f, ownerPassword: e.target.value }))}
              placeholder="كلمة مرور قوية" required minLength={6} />
          </div>
        </div>

        {/* Plan */}
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-white">📋 الخطة والاشتراك</h2>

          <div>
            <label className="block text-sm text-dark-200 mb-1.5">الخطة</label>
            <select className="input-field" value={form.planId}
              onChange={e => setForm(f => ({ ...f, planId: e.target.value }))}>
              <option value="">بدون خطة (تجريبي)</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price} ج.م / {p.billingCycle === 'MONTHLY' ? 'شهرياً' : 'سنوياً'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-dark-200 mb-1.5">فترة تجريبية (أيام)</label>
            <input className="input-field" type="number" value={form.trialDays}
              onChange={e => setForm(f => ({ ...f, trialDays: parseInt(e.target.value) || 0 }))}
              min={0} max={90} />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? '⏳ جاري الإنشاء...' : '🚀 إنشاء المتجر'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}
