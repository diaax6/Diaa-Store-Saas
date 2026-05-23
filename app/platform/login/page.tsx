'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlatformLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('platform-admin', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('بيانات الدخول غلط')
      setLoading(false)
    } else {
      router.push('/platform')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', direction: 'rtl',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, padding: '2.5rem',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 1rem',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)',
          }}>⚡</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
            Super Admin
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: 4 }}>
            لوحة تحكم المنصة
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6 }}>
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="admin@diaastore.com"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6 }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1rem',
              color: '#f87171', fontSize: '0.85rem', textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            {loading ? '⏳ جاري الدخول...' : '🔐 تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
