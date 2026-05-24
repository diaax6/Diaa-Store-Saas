'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlatformLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res?.error) {
        setError('بيانات الدخول غير صحيحة')
      } else {
        router.push('/platform')
      }
    } catch {
      setError('حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 60%), #080b14',
      fontFamily: "'Cairo', 'Inter', sans-serif",
      direction: 'rtl',
    }}>
      <div style={{
        width: 400,
        background: '#0f1322',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 40,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            margin: '0 auto 16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}>⚡</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>Super Admin</h1>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>لوحة تحكم المنصة</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 20,
              textAlign: 'center',
            }}>{error}</div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@diaastore.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#0a0e1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: '#f8fafc',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#0a0e1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: '#f8fafc',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '13px',
            background: loading ? '#374151' : 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(249,115,22,0.3)',
            transition: 'all 0.2s',
          }}>
            {loading ? '⏳ جاري الدخول...' : '🔐 تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
