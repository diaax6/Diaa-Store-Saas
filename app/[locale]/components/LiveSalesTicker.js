'use client';
import { useState, useEffect } from 'react';

const names = ['Ahmed M.','Sara A.','Omar H.','Mona K.','Youssef T.','Fatma N.','Khaled M.','Nour E.','Hassan A.','Layla S.'];
const products = ['ChatGPT Plus','Adobe CC','Spotify Premium','Netflix Premium','Gemini Advanced','Microsoft 365'];
const timeTextsEn = ['just now','1 min ago','2 min ago','3 min ago','5 min ago'];
const timeTextsAr = ['الآن','منذ دقيقة','منذ دقيقتين','منذ 3 دقائق','منذ 5 دقائق'];

export default function LiveSalesTicker({ locale = 'en' }) {
  const isAr = locale === 'ar';
  const timeTexts = isAr ? timeTextsAr : timeTextsEn;
  const [visible, setVisible] = useState(false);
  const [sale, setSale] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const show = () => {
      const name = names[Math.floor(Math.random()*names.length)];
      const product = products[Math.floor(Math.random()*products.length)];
      const time = timeTexts[Math.floor(Math.random()*timeTexts.length)];
      setSale({name, product, time});
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };
    const initial = setTimeout(show, 4000);
    const interval = setInterval(show, 25000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [dismissed]);

  if (dismissed || !visible || !sale) return null;

  return (
    <div style={{position:'fixed',bottom:24,[isAr?'right':'left']:24,zIndex:100,animation:'slideInLeft .4s ease',maxWidth:320}}>
      <div style={{background:'var(--color-bg-secondary,#1a1a2e)',border:'1px solid var(--color-border,rgba(255,255,255,.1))',borderRadius:14,padding:'14px 18px',boxShadow:'0 10px 30px rgba(0,0,0,.3)',display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--color-primary,#E67E22),#F39C12)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.85rem',flexShrink:0}}>
          {sale.name.charAt(0)}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:'.82rem',fontWeight:600}}>
            <span style={{color:'var(--color-text,#fff)'}}>{sale.name}</span>
            <span style={{color:'var(--color-text-muted,#999)'}}>{isAr ? ' اشترى' : ' purchased'}</span>
          </div>
          <div style={{fontSize:'.85rem',fontWeight:700,color:'var(--color-primary,#E67E22)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sale.product}</div>
          <div style={{fontSize:'.68rem',color:'var(--color-text-muted,#777)',marginTop:2}}>{sale.time}</div>
        </div>
        <button onClick={()=>{setVisible(false);setDismissed(true)}} style={{background:'none',border:'none',cursor:'pointer',color:'var(--color-text-muted,#666)',padding:4,flexShrink:0}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <style jsx>{`
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-100px); }
          to { opacity:1; transform:translateX(0); }
        }
      `}</style>
    </div>
  );
}
