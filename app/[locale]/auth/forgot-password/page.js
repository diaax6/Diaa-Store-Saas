'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../login/auth.css';

export default function ForgotPasswordPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      setSent(true);
    } catch {
      setSent(true); // Show success anyway (security)
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-gradient-1"></div><div className="auth-gradient-2"></div></div>
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <Link href={`/${locale}`} className="auth-logo">
            <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> Diaa Store
          </Link>
          <h1 className="auth-title">{isAr ? 'نسيت كلمة المرور' : 'Forgot Password'}</h1>
          <p className="text-secondary">
            {isAr ? 'أدخل بريدك الإلكتروني وهنبعتلك رابط إعادة التعيين' : 'Enter your email and we\'ll send you a reset link'}
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto 20px', width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <p className="text-secondary" style={{ marginBottom: 24, lineHeight: 1.6 }}>
              {isAr
                ? 'لو البريد ده مسجل عندنا، هتلاقي رسالة إعادة التعيين في صندوق الوارد.'
                : 'If that email is registered, you\'ll find a reset link in your inbox.'}
            </p>
            <Link href={`/${locale}/auth/login`} className="btn btn-primary w-full btn-lg">
              {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
              {loading ? '⏳...' : isAr ? 'إرسال رابط التعيين' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          {isAr ? 'تذكرت كلمة المرور؟' : 'Remember your password?'}{' '}
          <Link href={`/${locale}/auth/login`} className="text-primary" style={{ fontWeight: 600 }}>{isAr ? 'تسجيل الدخول' : 'Sign In'}</Link>
        </p>
      </div>
    </div>
  );
}
