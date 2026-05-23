'use client';
import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
      setShowTop(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Progress Bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: 3,
        zIndex: 9999, background: 'transparent', pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%', borderRadius: '0 2px 2px 0',
          background: 'linear-gradient(90deg, var(--color-primary, #E67E22), #F39C12, #E74C3C)',
          width: `${progress}%`, transition: 'width .1s linear',
          boxShadow: progress > 0 ? '0 0 8px rgba(230,126,34,.5)' : 'none',
        }} />
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 1000,
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary, #E67E22), #F39C12)',
          border: 'none', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(230,126,34,.4)',
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          transition: 'all .3s cubic-bezier(.4,0,.2,1)',
          pointerEvents: showTop ? 'auto' : 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* Scroll percentage tooltip */}
      {showTop && (
        <div style={{
          position: 'fixed', bottom: 138, right: 24, zIndex: 1000,
          fontSize: '.6rem', fontWeight: 800, color: 'var(--color-text-muted)',
          textAlign: 'center', width: 44, opacity: progress > 5 ? .7 : 0,
          transition: 'opacity .3s',
        }}>
          {Math.round(progress)}%
        </div>
      )}
    </>
  );
}
