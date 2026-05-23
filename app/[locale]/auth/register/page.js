'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../login/auth.css';

export default function RegisterPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ['', isAr ? 'ضعيفة' : 'Weak', isAr ? 'متوسطة' : 'Fair', isAr ? 'جيدة' : 'Good', isAr ? 'قوية' : 'Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(isAr ? 'كلمة المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, locale }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error);
      }
    } catch {
      setError(isAr ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg"><div className="auth-gradient-1"></div><div className="auth-gradient-2"></div></div>
        <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto 20px', width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 className="auth-title">{isAr ? 'تحقق من بريدك' : 'Check your email'}</h1>
          <p className="text-secondary" style={{ margin: '8px 0 24px', lineHeight: 1.6 }}>
            {isAr
              ? `أرسلنا رابط التأكيد إلى ${email}. اضغط عليه لتفعيل حسابك.`
              : `We've sent a verification link to ${email}. Click it to activate your account.`}
          </p>
          <Link href={`/${locale}/auth/login`} className="btn btn-primary w-full btn-lg">
            {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-gradient-1"></div><div className="auth-gradient-2"></div></div>
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <Link href={`/${locale}`} className="auth-logo">
            <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> Diaa Store
          </Link>
          <h1 className="auth-title">{isAr ? 'إنشاء حساب' : 'Create Account'}</h1>
          <p className="text-secondary">{isAr ? 'ابدأ رحلتك مع Diaa Store' : 'Start your journey with Diaa Store'}</p>
        </div>

        {error && <div className="alert-item alert-danger" style={{ marginBottom: 16 }}><span>❌</span><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder={isAr ? 'أحمد محمد' : 'Ahmed Mohamed'} required />
          </div>

          <div className="form-group">
            <label className="form-label">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">{isAr ? 'كلمة المرور' : 'Password'}</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                </svg>
              </button>
            </div>
            {password && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= passwordStrength ? strengthColor[passwordStrength] : 'var(--color-border)', transition: '0.2s' }} />
                  ))}
                </div>
                <span style={{ color: strengthColor[passwordStrength], fontSize: '0.72rem', fontWeight: 700, minWidth: 40 }}>
                  {strengthLabel[passwordStrength]}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
            <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
            {confirmPassword && confirmPassword !== password && (
              <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                {isAr ? 'كلمة المرور غير متطابقة' : 'Passwords do not match'}
              </span>
            )}
          </div>

          <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading || (confirmPassword && confirmPassword !== password)}>
            {loading ? '⏳...' : `🚀 ${isAr ? 'إنشاء الحساب' : 'Create Account'}`}
          </button>
        </form>

        <p className="auth-footer-text">
          {isAr ? 'عندك حساب؟' : 'Already have an account?'}{' '}
          <Link href={`/${locale}/auth/login`} className="text-primary" style={{ fontWeight: 600 }}>{isAr ? 'سجل دخول' : 'Sign In'}</Link>
        </p>
      </div>
    </div>
  );
}
