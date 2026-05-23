'use client';
import { useState } from 'react';

export default function FloatingSupport({ locale = 'en' }) {
  const [expanded, setExpanded] = useState(false);
  const isAr = locale === 'ar';

  const channels = [
    { name: isAr ? 'تليجرام' : 'Telegram', color: '#0088CC', href: 'https://t.me/diaastore',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.492-1.302.48-.428-.012-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
    { name: isAr ? 'واتساب' : 'WhatsApp', color: '#25D366', href: 'https://wa.me/201234567890',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
    { name: isAr ? 'البريد الإلكتروني' : 'Email', color: '#EA4335', href: 'mailto:support@diaastore.com',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 24, [isAr ? 'left' : 'right']: 24, zIndex: 1001 }}>
      {/* Channel Buttons */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: 8,
        opacity: expanded ? 1 : 0,
        transform: expanded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all .3s cubic-bezier(.4,0,.2,1)',
        pointerEvents: expanded ? 'auto' : 'none',
      }}>
        {channels.map((ch, i) => (
          <a key={ch.name} href={ch.href} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px 10px 12px', borderRadius: 12,
              background: 'rgba(15,20,25,.95)', backdropFilter: 'blur(10px)',
              border: `1px solid ${ch.color}30`, color: '#fff',
              textDecoration: 'none', fontSize: '.82rem', fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0,0,0,.3)',
              transition: 'all .2s', transitionDelay: `${i * 50}ms`,
              transform: expanded ? 'translateX(0)' : 'translateX(60px)',
              opacity: expanded ? 1 : 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ch.color; e.currentTarget.style.background = `${ch.color}15`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${ch.color}30`; e.currentTarget.style.background = 'rgba(15,20,25,.95)'; }}
          >
            <span style={{ color: ch.color, display: 'flex' }}>{ch.icon}</span>
            {ch.name}
          </a>
        ))}
      </div>

      {/* Main Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: expanded
            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
            : 'linear-gradient(135deg, #10B981, #059669)',
          border: 'none', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: expanded
            ? '0 4px 20px rgba(239,68,68,.4)'
            : '0 4px 20px rgba(16,185,129,.4)',
          transition: 'all .3s cubic-bezier(.4,0,.2,1)',
          transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        {expanded ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Pulse animation for attention */}
      {!expanded && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: 52, height: 52,
          borderRadius: '50%', border: '2px solid #10B981',
          animation: 'supportPulse 2s infinite', pointerEvents: 'none',
        }} />
      )}

      <style>{`
        @keyframes supportPulse {
          0% { transform: scale(1); opacity: .6; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
