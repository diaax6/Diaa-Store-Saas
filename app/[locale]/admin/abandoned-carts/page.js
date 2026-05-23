'use client';
import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import '../products/products-admin.css';

const demoCarts = [
  { id:'c1', customer:'Ahmed Mohamed', email:'ahmed@test.com', items:[{name:'ChatGPT Plus',price:12},{name:'Gemini Advanced',price:15}], total:27, createdAt:'2025-05-22T18:30:00Z', status:'pending', reminders:0 },
  { id:'c2', customer:'Sara Ali', email:'sara@test.com', items:[{name:'Netflix Premium',price:10}], total:10, createdAt:'2025-05-22T16:00:00Z', status:'reminded', reminders:1 },
  { id:'c3', customer:'Omar Hassan', email:'omar@test.com', items:[{name:'Adobe CC',price:25},{name:'Canva Pro',price:9}], total:34, createdAt:'2025-05-22T14:00:00Z', status:'pending', reminders:0 },
  { id:'c4', customer:'Guest', email:'guest123@gmail.com', items:[{name:'Spotify Premium',price:8}], total:8, createdAt:'2025-05-22T10:00:00Z', status:'expired', reminders:2 },
  { id:'c5', customer:'Youssef Tarek', email:'youssef@test.com', items:[{name:'ChatGPT Plus',price:12}], total:12, createdAt:'2025-05-21T20:00:00Z', status:'recovered', reminders:1 },
  { id:'c6', customer:'Mona Khaled', email:'mona@test.com', items:[{name:'Gemini Advanced',price:15},{name:'Spotify Premium',price:8}], total:23, createdAt:'2025-05-21T15:00:00Z', status:'pending', reminders:0 },
];

const statusConfig = {
  pending:   { color:'#F59E0B', bg:'rgba(245,158,11,.1)', label:'Pending' },
  reminded:  { color:'#3B82F6', bg:'rgba(59,130,246,.1)', label:'Reminded' },
  recovered: { color:'#10B981', bg:'rgba(16,185,129,.1)', label:'Recovered' },
  expired:   { color:'#6B7280', bg:'rgba(107,114,128,.1)', label:'Expired' },
};

export default function AbandonedCartPage() {
  const [carts, setCarts] = useState(demoCarts);
  const [filter, setFilter] = useState('all');
  const [autoRemind, setAutoRemind] = useState(true);
  const [remindAfterHours, setRemindAfterHours] = useState(1);
  const toast = useToast();

  const stats = {
    total: carts.length,
    pending: carts.filter(c=>c.status==='pending').length,
    recovered: carts.filter(c=>c.status==='recovered').length,
    potentialRevenue: carts.filter(c=>c.status==='pending').reduce((s,c)=>s+c.total,0),
    recoveredRevenue: carts.filter(c=>c.status==='recovered').reduce((s,c)=>s+c.total,0),
  };

  const filtered = carts.filter(c=>filter==='all'||c.status===filter);
  const timeAgo = d => {const h=Math.floor((Date.now()-new Date(d))/3600000);return h<1?'Just now':h<24?`${h}h ago`:`${Math.floor(h/24)}d ago`};

  const sendReminder = (id) => {
    setCarts(prev=>prev.map(c=>c.id===id?{...c,status:'reminded',reminders:c.reminders+1}:c));
    toast.success('Reminder email sent!');
  };

  const markRecovered = (id) => {
    setCarts(prev=>prev.map(c=>c.id===id?{...c,status:'recovered'}:c));
    toast.success('Cart marked as recovered!');
  };

  return (
    <div className="ap-page">
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[
          { label:'Abandoned Carts', value:stats.total, color:'#F59E0B', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
          { label:'Pending Recovery', value:stats.pending, color:'#EF4444', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label:'Recovered', value:stats.recovered, color:'#10B981', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
          { label:'Recoverable Revenue', value:`$${stats.potentialRevenue}`, color:'#6366F1', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:'16px 18px',borderLeft:`3px solid ${s.color}`}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color}}>{s.icon}</div>
              <div><div style={{fontSize:'.68rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>{s.label}</div><div style={{fontSize:'1.3rem',fontWeight:800,color:s.color}}>{s.value}</div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Abandoned Carts
          </h1>
          <p className="ap-subtitle">Recover lost sales with automated reminders</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:10,padding:'8px 14px'}}>
            <span style={{fontSize:'.78rem',fontWeight:600}}>Auto Remind</span>
            <div onClick={()=>setAutoRemind(!autoRemind)} style={{width:40,height:22,borderRadius:11,background:autoRemind?'#10B981':'var(--color-border)',cursor:'pointer',position:'relative',transition:'.2s'}}>
              <div style={{width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:autoRemind?21:3,transition:'.2s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
            </div>
            <span style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>after {remindAfterHours}h</span>
          </div>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {[['all',`All (${stats.total})`],['pending','Pending'],['reminded','Reminded'],['recovered','Recovered'],['expired','Expired']].map(([k,l])=>(
            <button key={k} className={`ap-filter-tab ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Customer</th><th>Cart Items</th><th>Total</th><th>Abandoned</th><th>Reminders</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c=>{
              const cfg = statusConfig[c.status];
              return (
                <tr key={c.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#F59E0B,#EF4444)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.72rem'}}>{c.customer.charAt(0)}</div>
                      <div><div style={{fontWeight:600,fontSize:'.85rem'}}>{c.customer}</div><div style={{fontSize:'.68rem',color:'var(--color-text-muted)'}}>{c.email}</div></div>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      {c.items.map((item,i)=><span key={i} style={{fontSize:'.82rem'}}>{item.name} <span style={{color:'var(--color-text-muted)',fontSize:'.72rem'}}>${item.price}</span></span>)}
                    </div>
                  </td>
                  <td style={{fontWeight:800,fontFamily:'monospace',color:'var(--color-primary)',fontSize:'1rem'}}>${c.total}</td>
                  <td style={{color:'var(--color-text-muted)',fontSize:'.82rem'}}>{timeAgo(c.createdAt)}</td>
                  <td style={{textAlign:'center'}}><span style={{background:'var(--color-bg-tertiary)',padding:'3px 10px',borderRadius:20,fontWeight:700,fontSize:'.78rem'}}>{c.reminders}</span></td>
                  <td><span style={{fontSize:'.72rem',fontWeight:700,padding:'3px 10px',borderRadius:20,background:cfg.bg,color:cfg.color}}>{cfg.label}</span></td>
                  <td>
                    <div className="ap-actions">
                      {c.status==='pending'&&<button className="ap-action-btn" style={{color:'#3B82F6',borderColor:'rgba(59,130,246,.3)'}} onClick={()=>sendReminder(c.id)} title="Send Reminder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></button>}
                      {(c.status==='pending'||c.status==='reminded')&&<button className="ap-action-btn" style={{color:'#10B981',borderColor:'rgba(16,185,129,.3)'}} onClick={()=>markRecovered(c.id)} title="Mark Recovered"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recovery Stats */}
      {stats.recoveredRevenue>0&&(
        <div style={{marginTop:16,background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:12}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          <div><span style={{fontWeight:700,color:'#10B981'}}>Revenue Recovered: ${stats.recoveredRevenue}</span><span style={{fontSize:'.78rem',color:'var(--color-text-muted)',marginLeft:8}}>from {stats.recovered} cart{stats.recovered>1?'s':''}</span></div>
        </div>
      )}
    </div>
  );
}
