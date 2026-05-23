'use client';

import { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../login/auth.css';

function ResetPasswordContent() {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isAr = locale === 'ar';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(isAr ? 'كلمة المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, locale }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error);
      }
    } catch {
      setError(isAr ? 'حدث خطأ' : 'Something went wrong');
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-bg"><div className="auth-gradient-1"></div><div className="auth-gradient-2"></div></div>
        <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
          <h1 className="auth-title">{isAr ? 'رابط غير صالح' : 'Invalid Link'}</h1>
          <p className="text-secondary" style={{ marginBottom: 24 }}>
            {isAr ? 'هذا الرابط غير صالح أو منتهي الصلاحية.' : 'This link is invalid or has expired.'}
          </p>
          <Link href={`/${locale}/auth/forgot-password`} className="btn btn-primary w-full btn-lg">
            {isAr ? 'طلب رابط جديد' : 'Request New Link'}
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg"><div className="auth-gradient-1"></div><div className="auth-gradient-2"></div></div>
        <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto 20px', width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 className="auth-title">{isAr ? 'تم تغيير كلمة المرور!' : 'Password Changed!'}</h1>
          <p className="text-secondary" style={{ marginBottom: 24 }}>
            {isAr ? 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.' : 'You can now sign in with your new password.'}
          </p>
          <Link href={`/${locale}/auth/login`} className="btn btn-primary w-full btn-lg">
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
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
          <h1 className="auth-title">{isAr ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}</h1>
          <p className="text-secondary">{isAr ? 'أدخل كلمة المرور الجديدة' : 'Enter your new password'}</p>
        </div>

        {error && <div className="alert-item alert-danger" style={{ marginBottom: 16 }}><span>❌</span><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
          </div>
          <div className="form-group">
            <label className="form-label">{isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
            <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
            {loading ? '⏳...' : isAr ? 'تغيير كلمة المرور' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card">Loading...</div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
