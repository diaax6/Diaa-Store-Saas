'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import '../products/products-admin.css';

const statusColors = { COMPLETED:'#10B981', PROCESSING:'#3B82F6', PENDING:'#F59E0B', FAILED:'#EF4444', REFUNDED:'#8B5CF6', CANCELLED:'#6B7280' };
const statusIcons = {
  COMPLETED: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  PROCESSING: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  PENDING: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  FAILED: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  REFUNDED: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
};

const demoOrders = [
  { id:'1', orderNumber:'ORD-001', customer:{name:'Ahmed Mohamed',email:'ahmed@test.com',avatar:'A'}, product:'ChatGPT Plus', total:12, status:'COMPLETED', paymentMethod:'wallet', paymentStatus:'PAID', createdAt:'2025-05-22T14:00:00Z', deliveryData:'user@email.com:pass123', timeline:[{status:'CREATED',time:'2025-05-22T14:00:00Z'},{status:'PAID',time:'2025-05-22T14:00:05Z'},{status:'COMPLETED',time:'2025-05-22T14:01:00Z'}] },
  { id:'2', orderNumber:'ORD-002', customer:{name:'Sara Ali',email:'sara@test.com',avatar:'S'}, product:'Adobe CC', total:25, status:'PENDING', paymentMethod:'card', paymentStatus:'PENDING', createdAt:'2025-05-22T13:30:00Z', timeline:[{status:'CREATED',time:'2025-05-22T13:30:00Z'}] },
  { id:'3', orderNumber:'ORD-003', customer:{name:'Omar Hassan',email:'omar@test.com',avatar:'O'}, product:'Spotify Premium', total:8, status:'COMPLETED', paymentMethod:'wallet', paymentStatus:'PAID', createdAt:'2025-05-22T12:00:00Z', deliveryData:'spotify@email.com:sp123', timeline:[{status:'CREATED',time:'2025-05-22T12:00:00Z'},{status:'PAID',time:'2025-05-22T12:00:10Z'},{status:'COMPLETED',time:'2025-05-22T12:02:00Z'}] },
  { id:'4', orderNumber:'ORD-004', customer:{name:'Mona Khaled',email:'mona@test.com',avatar:'M'}, product:'Netflix Premium', total:10, status:'PROCESSING', paymentMethod:'card', paymentStatus:'PAID', createdAt:'2025-05-22T10:00:00Z', timeline:[{status:'CREATED',time:'2025-05-22T10:00:00Z'},{status:'PAID',time:'2025-05-22T10:01:00Z'},{status:'PROCESSING',time:'2025-05-22T10:02:00Z'}] },
  { id:'5', orderNumber:'ORD-005', customer:{name:'Youssef Tarek',email:'youssef@test.com',avatar:'Y'}, product:'Microsoft 365', total:13, status:'COMPLETED', paymentMethod:'wallet', paymentStatus:'PAID', createdAt:'2025-05-21T18:00:00Z', deliveryData:'ms365@email.com:msPass', timeline:[{status:'CREATED',time:'2025-05-21T18:00:00Z'},{status:'PAID',time:'2025-05-21T18:00:30Z'},{status:'COMPLETED',time:'2025-05-21T18:03:00Z'}] },
  { id:'6', orderNumber:'ORD-006', customer:{name:'Fatma Nour',email:'fatma@test.com',avatar:'F'}, product:'Gemini Advanced', total:15, status:'FAILED', paymentMethod:'card', paymentStatus:'FAILED', createdAt:'2025-05-21T16:00:00Z', timeline:[{status:'CREATED',time:'2025-05-21T16:00:00Z'},{status:'FAILED',time:'2025-05-21T16:00:30Z',note:'Card declined'}] },
  { id:'7', orderNumber:'ORD-007', customer:{name:'Khaled Mostafa',email:'khaled@test.com',avatar:'K'}, product:'YouTube Premium', total:7, status:'REFUNDED', paymentMethod:'wallet', paymentStatus:'REFUNDED', createdAt:'2025-05-20T14:00:00Z', timeline:[{status:'CREATED',time:'2025-05-20T14:00:00Z'},{status:'PAID',time:'2025-05-20T14:01:00Z'},{status:'COMPLETED',time:'2025-05-20T14:05:00Z'},{status:'REFUNDED',time:'2025-05-20T16:00:00Z',note:'Customer requested refund'}] },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(demoOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewOrder, setViewOrder] = useState(null);
  const toast = useToast();

  const stats = { total:orders.length, completed:orders.filter(o=>o.status==='COMPLETED').length, pending:orders.filter(o=>o.status==='PENDING').length, processing:orders.filter(o=>o.status==='PROCESSING').length };
  const totalRevenue = orders.filter(o=>o.status==='COMPLETED').reduce((s,o)=>s+o.total,0);

  const filtered = orders.filter(o => {
    const ms = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus==='all' || o.status===filterStatus;
    return ms && mf;
  });

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const newTimeline = [...(o.timeline||[]), {status, time: new Date().toISOString()}];
      return {...o, status, timeline: newTimeline};
    }));
    toast.success(`Order updated to ${status}`);
    if (viewOrder?.id===id) setViewOrder(prev => ({...prev, status, timeline: [...(prev.timeline||[]), {status, time: new Date().toISOString()}]}));
  };

  const timeAgo = (d) => { const m=Math.floor((Date.now()-new Date(d).getTime())/60000); return m<60?`${m}m ago`:m<1440?`${Math.floor(m/60)}h ago`:`${Math.floor(m/1440)}d ago`; };
  const formatDate = (d) => new Date(d).toLocaleString('en-US', {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});

  const exportCSV = () => {
    const header = 'Order,Customer,Email,Product,Amount,Status,Payment,Date\n';
    const rows = orders.map(o => `${o.orderNumber},${o.customer.name},${o.customer.email},${o.product},$${o.total},${o.status},${o.paymentMethod},${new Date(o.createdAt).toLocaleDateString()}`).join('\n');
    const blob = new Blob([header+rows], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='orders.csv'; a.click();
    toast.success('Orders exported to CSV');
  };

  return (
    <div className="ap-page">
      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[
          {label:'Total Orders',value:stats.total,color:'#6366F1',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>},
          {label:'Revenue',value:`$${totalRevenue}`,color:'#10B981',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>},
          {label:'Pending',value:stats.pending,color:'#F59E0B',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
          {label:'Completed',value:stats.completed,color:'#059669',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>},
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:'16px 18px',display:'flex',alignItems:'center',gap:14,borderLeft:`3px solid ${s.color}`}}>
            <div style={{width:42,height:42,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color}}>{s.icon}</div>
            <div><div style={{fontSize:'.72rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>{s.label}</div><div style={{fontSize:'1.5rem',fontWeight:800,color:s.color}}>{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Orders
          </h1>
          <p className="ap-subtitle">{stats.total} orders · ${totalRevenue} revenue</p>
        </div>
        <div className="ap-header-actions">
          <button className="btn btn-ghost" onClick={exportCSV} style={{display:'flex',alignItems:'center',gap:6}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {[['all',`All (${stats.total})`],['COMPLETED',`Completed (${stats.completed})`],['PENDING',`Pending (${stats.pending})`],['PROCESSING',`Processing (${stats.processing})`]].map(([k,l])=>(
            <button key={k} className={`ap-filter-tab ${filterStatus===k?'active':''}`} onClick={()=>setFilterStatus(k)}>{l}</button>
          ))}
        </div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search orders..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr>
            <th>Order</th><th>Customer</th><th>Product</th><th>Amount</th><th>Payment</th><th>Status</th><th>Time</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(order=>(
              <tr key={order.id}>
                <td><span style={{color:'var(--color-primary)',fontWeight:700,fontSize:'0.85rem',fontFamily:'monospace'}}>#{order.orderNumber}</span></td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--color-primary),#F39C12)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'0.78rem',flexShrink:0}}>{order.customer.avatar||order.customer.name.charAt(0)}</div>
                    <div><div style={{fontWeight:600,fontSize:'0.88rem'}}>{order.customer.name}</div><div style={{fontSize:'0.72rem',color:'var(--color-text-muted)'}}>{order.customer.email}</div></div>
                  </div>
                </td>
                <td style={{fontWeight:500,fontSize:'0.88rem'}}>{order.product}</td>
                <td><span style={{fontWeight:700,fontSize:'0.9rem',fontFamily:'monospace'}}>${order.total}</span></td>
                <td><span className="ap-cat-badge">{order.paymentMethod}</span></td>
                <td><span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:20,fontSize:'0.72rem',fontWeight:700,background:`${statusColors[order.status]}15`,color:statusColors[order.status]}}>{statusIcons[order.status]}{order.status}</span></td>
                <td style={{color:'var(--color-text-muted)',fontSize:'0.82rem',whiteSpace:'nowrap'}}>{timeAgo(order.createdAt)}</td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" onClick={()=>setViewOrder(order)} title="View Details">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    {order.status==='PENDING'&&<button className="ap-action-btn" style={{color:'#10B981',borderColor:'rgba(16,185,129,.3)'}} onClick={()=>updateStatus(order.id,'PROCESSING')} title="Start Processing">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>}
                    {order.status==='PROCESSING'&&<button className="ap-action-btn" style={{color:'#10B981',borderColor:'rgba(16,185,129,.3)'}} onClick={()=>updateStatus(order.id,'COMPLETED')} title="Mark Complete">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="ap-empty"><p>No orders found</p></div>}
      </div>

      {/* Order Detail Modal with Timeline */}
      {viewOrder&&(
        <div className="ap-modal-overlay" onClick={()=>setViewOrder(null)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
            <div className="ap-modal-header">
              <h2 style={{display:'flex',alignItems:'center',gap:8}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Order #{viewOrder.orderNumber}
              </h2>
              <button className="ap-modal-close" onClick={()=>setViewOrder(null)}>✕</button>
            </div>
            <div className="ap-modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
                <div style={{background:'var(--color-bg-tertiary)',padding:14,borderRadius:10}}>
                  <div style={{fontSize:'.72rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.05em',fontWeight:600,marginBottom:4}}>Customer</div>
                  <div style={{fontWeight:700}}>{viewOrder.customer.name}</div>
                  <div style={{fontSize:'0.82rem',color:'var(--color-text-muted)'}}>{viewOrder.customer.email}</div>
                </div>
                <div style={{background:'var(--color-bg-tertiary)',padding:14,borderRadius:10}}>
                  <div style={{fontSize:'.72rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.05em',fontWeight:600,marginBottom:4}}>Payment</div>
                  <div style={{fontWeight:700,fontSize:'1.3rem',color:'var(--color-primary)'}}>${viewOrder.total}</div>
                  <div style={{display:'flex',gap:6,marginTop:4}}><span className="ap-cat-badge">{viewOrder.paymentMethod}</span><span className="ap-cat-badge">{viewOrder.paymentStatus}</span></div>
                </div>
              </div>

              {/* Delivery Data */}
              {viewOrder.deliveryData&&(
                <div style={{background:'var(--color-bg-tertiary)',padding:14,borderRadius:10,marginBottom:20}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:'.72rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.05em',fontWeight:600}}>Delivery Data</span>
                    <button onClick={()=>{navigator.clipboard.writeText(viewOrder.deliveryData);toast.success('Copied!')}} style={{background:'none',border:'1px solid var(--color-border)',borderRadius:6,padding:'4px 10px',cursor:'pointer',color:'var(--color-text-muted)',fontSize:'.75rem',fontWeight:600,display:'flex',alignItems:'center',gap:4}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy
                    </button>
                  </div>
                  <code style={{fontFamily:'monospace',fontSize:'0.88rem',wordBreak:'break-all',color:'#22D3EE'}}>{viewOrder.deliveryData}</code>
                </div>
              )}

              {/* Order Timeline */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:'.72rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.05em',fontWeight:600,marginBottom:12}}>Order Timeline</div>
                <div style={{display:'flex',flexDirection:'column',gap:0,paddingLeft:16,borderLeft:'2px solid var(--color-border)'}}>
                  {(viewOrder.timeline||[]).map((t,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,paddingBottom:16,position:'relative'}}>
                      <div style={{position:'absolute',left:-23,width:12,height:12,borderRadius:'50%',background:statusColors[t.status]||'var(--color-border)',border:'2px solid var(--color-bg-secondary)'}}/>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontWeight:700,fontSize:'.85rem',color:statusColors[t.status]||'var(--color-text)'}}>{t.status}</span>
                          <span style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>{formatDate(t.time)}</span>
                        </div>
                        {t.note&&<div style={{fontSize:'.78rem',color:'var(--color-text-muted)',marginTop:2}}>{t.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status */}
              <div>
                <div style={{fontSize:'.72rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.05em',fontWeight:600,marginBottom:8}}>Update Status</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {['PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED'].map(s=>(
                    <button key={s} onClick={()=>updateStatus(viewOrder.id,s)} style={{
                      padding:'6px 14px',borderRadius:8,border:'1px solid',fontSize:'.78rem',fontWeight:600,cursor:'pointer',transition:'.15s',display:'flex',alignItems:'center',gap:4,
                      background:viewOrder.status===s?`${statusColors[s]}20`:'transparent',
                      borderColor:viewOrder.status===s?statusColors[s]:'var(--color-border)',
                      color:viewOrder.status===s?statusColors[s]:'var(--color-text-muted)',
                    }}>{statusIcons[s]}{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setViewOrder(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
