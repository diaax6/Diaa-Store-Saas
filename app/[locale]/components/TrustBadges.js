'use client';

export default function TrustBadges({ locale = 'en' }) {
  const isAr = locale === 'ar';

  const badges = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
      title: isAr ? 'توصيل فوري' : 'Instant Delivery',
      desc: isAr ? 'يتم التوصيل في ثوانٍ' : 'Delivered in seconds',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
      title: isAr ? 'دفع آمن' : 'Secure Payment',
      desc: isAr ? 'تشفير 256 بت' : '256-bit encryption',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      title: isAr ? 'دعم على مدار الساعة' : '24/7 Support',
      desc: isAr ? 'فريق الدعم دائماً متاح' : 'Always here for you',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
      title: isAr ? 'ضمان استرداد' : 'Money Back',
      desc: isAr ? 'ضمان 100%' : '100% guarantee',
    },
  ];

  return (
    <section style={{padding:'40px 0',background:'transparent'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
        {badges.map((b,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'20px 24px',background:'var(--color-surface,rgba(255,255,255,.03))',border:'1px solid var(--color-border,rgba(255,255,255,.08))',borderRadius:14,transition:'all .25s',cursor:'default'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='var(--color-primary,#E67E22)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='var(--color-border,rgba(255,255,255,.08))'}}>
            <div style={{width:48,height:48,borderRadius:12,background:'rgba(255,255,255,.05)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{b.icon}</div>
            <div>
              <div style={{fontWeight:700,fontSize:'.92rem'}}>{b.title}</div>
              <div style={{fontSize:'.78rem',color:'var(--color-text-muted,#999)',marginTop:2}}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media(max-width:768px) {
          section > div { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:480px) {
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
