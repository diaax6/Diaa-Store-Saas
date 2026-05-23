'use client';
import { useState, useEffect } from 'react';

const presets = [
  { id: 'chatgpt', name: 'ChatGPT Plus', nameAr: 'شات جي بي تي بلس', from: '$20', to: '$12', badge: '-40%', color: '#10B981', until: null },
  { id: 'adobe', name: 'Adobe CC', nameAr: 'أدوبي كريتيف كلاود', from: '$55', to: '$25', badge: '-55%', color: '#FF3366', until: null },
];

// Set dynamic end dates (24h from now for first, 48h for second)
presets[0].until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
presets[1].until = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

export default function FlashDealBanner({ locale = 'en' }) {
  const isAr = locale === 'ar';
  const [currentDeal, setCurrentDeal] = useState(0);
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const deal = presets[currentDeal];
      const diff = new Date(deal.until) - new Date();
      if (diff <= 0) {
        setCurrentDeal(prev => (prev + 1) % presets.length);
        return;
      }
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentDeal]);

  const deal = presets[currentDeal];
  const pad = n => String(n).padStart(2, '0');

  const timerLabels = isAr
    ? { h: 'ساعة', m: 'دقيقة', s: 'ثانية' }
    : { h: 'HRS', m: 'MIN', s: 'SEC' };

  return (
    <section style={{
      maxWidth: 1200, margin: '0 auto 30px', padding: '0 20px',
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${deal.color}15, transparent 60%)`,
        border: `1px solid ${deal.color}30`,
        borderRadius: 16, padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute', top: -40, [isAr ? 'left' : 'right']: -40, width: 150, height: 150,
          borderRadius: '50%', background: `${deal.color}10`, filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `${deal.color}20`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={deal.color} strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: '.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20,
                background: `${deal.color}20`, color: deal.color, textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}>{isAr ? 'عرض سريع' : 'Flash Deal'}</span>
              <span style={{
                fontSize: '.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                background: '#EF444420', color: '#EF4444',
              }}>{deal.badge}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              {isAr ? deal.nameAr : deal.name}
              <span style={{ margin: '0 10px', textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '.85rem', fontWeight: 400 }}>{deal.from}</span>
              <span style={{ color: deal.color, fontFamily: 'monospace' }}>{deal.to}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Countdown */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[['h', time.h], ['m', time.m], ['s', time.s]].map(([label, val]) => (
              <div key={label} style={{
                textAlign: 'center', minWidth: 44,
              }}>
                <div style={{
                  background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: '6px 8px',
                  fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800,
                  color: '#fff', border: '1px solid rgba(255,255,255,.08)',
                }}>
                  {pad(val)}
                </div>
                <div style={{ fontSize: '.58rem', color: 'var(--color-text-muted)', marginTop: 2, fontWeight: 600 }}>{timerLabels[label]}</div>
              </div>
            ))}
          </div>

          <a href={`/${locale}/products/${deal.id}`} style={{
            padding: '10px 22px', borderRadius: 10,
            background: `linear-gradient(135deg, ${deal.color}, ${deal.color}CC)`,
            color: '#fff', fontWeight: 700, fontSize: '.88rem',
            textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: `0 4px 15px ${deal.color}40`,
            transition: '.2s', display: 'flex', alignItems: 'center', gap: 6,
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isAr ? 'احصل على العرض' : 'Grab Deal'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isAr ? 'rotate(180deg)' : 'none' }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
