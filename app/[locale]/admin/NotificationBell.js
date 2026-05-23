'use client';
import { useState, useRef, useEffect } from 'react';

const demoNotifications = [
  { id:1, type:'order', title:'New order received', desc:'Ahmed Mohamed ordered ChatGPT Plus — $12', time: new Date(Date.now()-120000).toISOString(), read:false },
  { id:2, type:'stock', title:'Low stock alert', desc:'Gmail Accounts (New) — only 1 remaining', time: new Date(Date.now()-3600000).toISOString(), read:false },
  { id:3, type:'customer', title:'New customer registered', desc:'Youssef Tarek signed up', time: new Date(Date.now()-7200000).toISOString(), read:false },
  { id:4, type:'order', title:'Order completed', desc:'Spotify Premium delivered to Omar Hassan', time: new Date(Date.now()-86400000).toISOString(), read:true },
  { id:5, type:'payment', title:'Payment received', desc:'$25 received via card — Sara Ali', time: new Date(Date.now()-172800000).toISOString(), read:true },
];

const typeStyles = {
  order:   { color:'#6366F1', bg:'rgba(99,102,241,.12)',  icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
  stock:   { color:'#F59E0B', bg:'rgba(245,158,11,.12)',  icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  customer:{ color:'#10B981', bg:'rgba(16,185,129,.12)',   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  payment: { color:'#3B82F6', bg:'rgba(59,130,246,.12)',   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const ref = useRef(null);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({...n, read:true})));
  const timeAgo = (d) => { const m=Math.floor((Date.now()-new Date(d).getTime())/60000); return m<60?`${m}m`:m<1440?`${Math.floor(m/60)}h`:`${Math.floor(m/1440)}d`; };

  return (
    <div ref={ref} style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} className="header-btn" style={{position:'relative'}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {unread > 0 && (
          <span style={{position:'absolute',top:-2,right:-2,width:18,height:18,borderRadius:'50%',background:'#EF4444',color:'#fff',fontSize:'.65rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid var(--color-bg)'}}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,width:360,background:'var(--color-bg-secondary)',border:'1px solid var(--color-border)',borderRadius:14,boxShadow:'0 15px 40px rgba(0,0,0,.3)',zIndex:100,overflow:'hidden',animation:'modalIn 150ms ease'}}>
          {/* Header */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderBottom:'1px solid var(--color-border)'}}>
            <span style={{fontWeight:700,fontSize:'.92rem'}}>Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{background:'none',border:'none',color:'var(--color-primary)',fontSize:'.78rem',fontWeight:600,cursor:'pointer'}}>Mark all read</button>
            )}
          </div>
          {/* List */}
          <div style={{maxHeight:380,overflowY:'auto'}}>
            {notifications.map(n => {
              const st = typeStyles[n.type] || typeStyles.order;
              return (
                <div key={n.id} style={{display:'flex',gap:10,padding:'12px 16px',borderBottom:'1px solid var(--color-border)',background:n.read?'transparent':'rgba(99,102,241,.04)',cursor:'pointer',transition:'background .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--color-bg-tertiary)'}
                  onMouseLeave={e=>e.currentTarget.style.background=n.read?'transparent':'rgba(99,102,241,.04)'}
                  onClick={()=>setNotifications(prev=>prev.map(x=>x.id===n.id?{...x,read:true}:x))}>
                  <div style={{width:32,height:32,borderRadius:8,background:st.bg,color:st.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{st.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontWeight:n.read?500:700,fontSize:'.82rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.title}</span>
                      {!n.read && <span style={{width:6,height:6,borderRadius:'50%',background:'var(--color-primary)',flexShrink:0}}/>}
                    </div>
                    <div style={{fontSize:'.75rem',color:'var(--color-text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.desc}</div>
                    <div style={{fontSize:'.68rem',color:'var(--color-text-muted)',marginTop:2}}>{timeAgo(n.time)} ago</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
