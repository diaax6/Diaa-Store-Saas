'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Pause, Play, Trash2, Loader2 } from 'lucide-react'

export function TenantActions({ tenantId, status }: { tenantId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState('')

  const handleAction = async (action: string) => {
    if (action === 'delete' && !confirm('⚠️ هل أنت متأكد؟ سيتم حذف المتجر وكل بياناته نهائياً!')) return
    setLoading(action)

    await fetch(`/api/platform/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })

    setLoading('')
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {status === 'ACTIVE' || status === 'TRIAL' ? (
        <button onClick={() => handleAction('suspend')} disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20 transition-all">
          {loading === 'suspend' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}
          إيقاف
        </button>
      ) : status === 'SUSPENDED' ? (
        <button onClick={() => handleAction('reactivate')} disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-all">
          {loading === 'reactivate' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          تفعيل
        </button>
      ) : null}

      <button onClick={() => handleAction('delete')} disabled={!!loading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
        {loading === 'delete' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        حذف
      </button>
    </div>
  )
}
