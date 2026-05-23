'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import './auth.css';

function LoginPageContent() {
  const { locale } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const isAr = locale === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: isAdmin ? 'admin' : 'customer' }),
      });

      const data = await res.json();

      if (data.success) {
        if (isAdmin) {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}/account`);
        }
      } else {
        setError(data.error || (isAr ? 'بيانات غير صحيحة' : 'Invalid credentials'));
      }
    } catch (err) {
      setError(isAr ? 'خطأ في الشبكة' : 'Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-gradient-1"></div>
        <div className="auth-gradient-2"></div>
      </div>

      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <Link href={`/${locale}`} className="auth-logo">
            <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> Diaa Store
          </Link>
          <h1 className="auth-title">{isAr ? 'مرحباً بك' : 'Welcome Back'}</h1>
          <p className="text-secondary">{isAr ? 'سجل دخول لحسابك' : 'Sign in to your account'}</p>
        </div>

        {/* Toggle */}
        <div className="auth-toggle">
          <button className={`auth-toggle-btn ${!isAdmin ? 'active' : ''}`} onClick={() => setIsAdmin(false)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>{isAr ? 'عميل' : 'Customer'}</button>
          <button className={`auth-toggle-btn ${isAdmin ? 'active' : ''}`} onClick={() => setIsAdmin(true)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>{isAr ? 'أدمن' : 'Admin'}</button>
        </div>

        {verified === 'true' && (
          <div className="auth-success" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 16, fontSize: '0.88rem', color: '#10B981', fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {isAr ? 'تم تأكيد بريدك بنجاح! سجل الدخول الآن.' : 'Email verified! You can now sign in.'}
          </div>
        )}

        {error && (
          <div className="auth-error">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" style={{display:'inline',verticalAlign:'middle'}}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <Link href={`/${locale}/auth/forgot-password`} className="text-primary" style={{ fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </Link>
            </div>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
            {loading ? '...' : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>{isAr ? 'تسجيل الدخول' : 'Sign In'}</>}
          </button>
        </form>

        {isAdmin && (
          <div className="auth-hint">
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              admin@diaastore.com &nbsp;|&nbsp; admin123
            </span>
          </div>
        )}

        {!isAdmin && (
          <p className="auth-footer-text">
            {isAr ? 'معندكش حساب؟' : "Don't have an account?"}{' '}
            <Link href={`/${locale}/auth/register`} className="text-primary" style={{ fontWeight: 600 }}>{isAr ? 'سجل الآن' : 'Sign Up'}</Link>
          </p>
        )}
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:'center'}}>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
