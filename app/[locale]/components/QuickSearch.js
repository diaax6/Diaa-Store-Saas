'use client';
import { useState, useEffect, useRef } from 'react';

const products = [
  { id:'1', name:'ChatGPT Plus', category:'AI Tools', price:12, image:'/products/chatgpt.svg' },
  { id:'2', name:'Adobe Creative Cloud', category:'Design', price:25, image:'/products/adobe.svg' },
  { id:'3', name:'Spotify Premium', category:'Music', price:8, image:'/products/spotify.svg' },
  { id:'4', name:'Netflix Premium', category:'Streaming', price:10, image:'/products/netflix.svg' },
  { id:'5', name:'Gemini Advanced', category:'AI Tools', price:15, image:'/products/gemini.svg' },
  { id:'6', name:'Canva Pro', category:'Design', price:9, image:'/products/canva.svg' },
  { id:'7', name:'YouTube Premium', category:'Streaming', price:7, image:'/products/youtube.svg' },
  { id:'8', name:'Microsoft 365', category:'Productivity', price:11, image:'/products/microsoft.svg' },
];

export default function QuickSearch({ locale = 'en' }) {
  const isAr = locale === 'ar';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [open]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const recentSearches = ['ChatGPT Plus', 'Netflix', 'Adobe'];

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '12vh',
    }} onClick={() => setOpen(false)}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 580,
        background: 'var(--color-surface, #1a1a2e)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,.5)',
        animation: 'quickSearchIn .2s ease-out',
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.08)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن منتجات...' : 'Search products, categories...'}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: '#fff', fontSize: '1rem', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <kbd style={{
            fontSize: '.6rem', padding: '2px 6px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.4)',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
          {query.length === 0 && (
            <>
              <div style={{ padding: '8px 18px', fontSize: '.7rem', fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {isAr ? 'عمليات بحث سابقة' : 'Recent Searches'}
              </div>
              {recentSearches.map(rs => (
                <button key={rs} onClick={() => setQuery(rs)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 18px', background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,.7)', cursor: 'pointer', textAlign: 'left',
                  fontSize: '.88rem', transition: '.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {rs}
                </button>
              ))}
              <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '8px 18px' }} />
              <div style={{ padding: '8px 18px', fontSize: '.7rem', fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {isAr ? 'منتجات شائعة' : 'Popular Products'}
              </div>
            </>
          )}

          {query.length > 0 && filtered.length === 0 && (
            <div style={{ padding: '30px 18px', textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block', opacity: .4 }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              {isAr ? `لا توجد نتائج لـ "${query}"` : `No results for "${query}"`}
            </div>
          )}

          {(query.length > 0 ? filtered : products.slice(0, 5)).map(p => (
            <a key={p.id} href={`/${locale}/products/${p.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 18px', textDecoration: 'none', color: '#fff',
              transition: '.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(255,255,255,.06)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary, #E67E22)',
              }}>
                {p.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{p.name}</div>
                <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.4)' }}>{p.category}</div>
              </div>
              <span style={{
                fontWeight: 800, fontFamily: 'monospace', fontSize: '.9rem',
                color: 'var(--color-primary, #E67E22)',
              }}>${p.price}</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 12, fontSize: '.68rem', color: 'rgba(255,255,255,.3)' }}>
            <span><kbd style={{ padding: '1px 4px', borderRadius: 3, border: '1px solid rgba(255,255,255,.12)', marginRight: 3 }}>↑↓</kbd> {isAr ? 'تنقل' : 'Navigate'}</span>
            <span><kbd style={{ padding: '1px 4px', borderRadius: 3, border: '1px solid rgba(255,255,255,.12)', marginRight: 3 }}>↵</kbd> {isAr ? 'فتح' : 'Open'}</span>
          </div>
          <span style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.25)' }}>Powered by SubFlow</span>
        </div>
      </div>

      <style>{`
        @keyframes quickSearchIn {
          from { opacity: 0; transform: translateY(-20px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
