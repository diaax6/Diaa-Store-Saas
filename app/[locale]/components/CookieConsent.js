'use client';
import { useState, useEffect } from 'react';

export default function CookieConsent({ locale = 'en' }) {
  const isAr = locale === 'ar';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie_consent');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9998,
      background: 'rgba(15,20,25,.97)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,.08)',
      padding: '16px 24px',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform .4s cubic-bezier(.4,0,.2,1)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 280 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(230,126,34,.12)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="1.8">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <circle cx="8" cy="10" r="1" fill="#E67E22" />
              <circle cx="12" cy="15" r="1" fill="#E67E22" />
              <circle cx="16" cy="11" r="1" fill="#E67E22" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff', marginBottom: 2 }}>
              {isAr ? 'نستخدم ملفات تعريف الارتباط' : 'We use cookies'}
            </div>
            <div style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.4 }}>
              {isAr
                ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة المرور وتخصيص المحتوى. بالنقر على "قبول الكل"، توافق على استخدامنا لملفات تعريف الارتباط.'
                : 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={decline} style={{
            padding: '8px 18px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,.15)',
            background: 'transparent', color: 'rgba(255,255,255,.6)',
            fontSize: '.82rem', fontWeight: 600, cursor: 'pointer',
            transition: '.15s',
          }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,.3)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,.15)'}
          >
            {isAr ? 'رفض' : 'Decline'}
          </button>
          <button onClick={accept} style={{
            padding: '8px 22px', borderRadius: 8,
            border: 'none', background: 'linear-gradient(135deg, #E67E22, #F39C12)',
            color: '#fff', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(230,126,34,.3)', transition: '.15s',
          }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            {isAr ? 'قبول الكل' : 'Accept All'}
          </button>
        </div>
      </div>
    </div>
  );
}
