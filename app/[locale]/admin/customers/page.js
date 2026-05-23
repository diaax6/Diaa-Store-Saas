'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';

const demoCustomers = [
  { id:'1', name:'Ahmed Mohamed', email:'ahmed@gmail.com', phone:'+201012345678', totalSpent:245, orders:12, isVip:true, emailVerified:true, language:'ar', createdAt:'2025-03-15T10:00:00Z', walletBalance:50, telegramUsername:'@ahmed_m' },
  { id:'2', name:'Sara Ali', email:'sara@gmail.com', phone:'+201098765432', totalSpent:180, orders:8, isVip:false, emailVerified:true, language:'en', createdAt:'2025-04-02T14:30:00Z', walletBalance:25, telegramUsername:'' },
  { id:'3', name:'Omar Hassan', email:'omar@hotmail.com', phone:'+201155556666', totalSpent:560, orders:22, isVip:true, emailVerified:true, language:'ar', createdAt:'2025-01-10T08:00:00Z', walletBalance:120, telegramUsername:'@omar_h' },
  { id:'4', name:'Mona Khaled', email:'mona@yahoo.com', phone:'+201234567890', totalSpent:35, orders:2, isVip:false, emailVerified:false, language:'ar', createdAt:'2025-05-18T16:00:00Z', walletBalance:0, telegramUsername:'' },
  { id:'5', name:'Youssef Tarek', email:'youssef@gmail.com', phone:'+201111222333', totalSpent:89, orders:5, isVip:false, emailVerified:true, language:'en', createdAt:'2025-04-20T12:00:00Z', walletBalance:15, telegramUsername:'@youssef_t' },
  { id:'6', name:'Fatma Nour', email:'fatma@outlook.com', phone:'', totalSpent:420, orders:18, isVip:true, emailVerified:true, language:'en', createdAt:'2025-02-28T09:00:00Z', walletBalance:75, telegramUsername:'@fatma_n' },
];

const emptyCustomer = { id:'', name:'', email:'', phone:'', isVip:false, emailVerified:false, language:'en', walletBalance:0, telegramUsername:'', password:'' };

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(demoCustomers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [walletAction, setWalletAction] = useState(null);
  const [walletAmount, setWalletAmount] = useState('');
  const toast = useToast();

  const stats = { total:customers.length, vip:customers.filter(c=>c.isVip).length, verified:customers.filter(c=>c.emailVerified).length };
  const totalRevenue = customers.reduce((s,c)=>s+c.totalSpent,0);

  const filtered = customers.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || (c.phone && c.phone.includes(search));
    const mf = filter==='all' || (filter==='vip'&&c.isVip) || (filter==='unverified'&&!c.emailVerified);
    return ms && mf;
  });

  const openAdd = () => { setEditCustomer({...emptyCustomer}); setShowModal(true); };
  const openEdit = (c) => { setEditCustomer({...c, password:''}); setShowModal(true); };

  const handleSave = () => {
    if (!editCustomer.name || !editCustomer.email) { toast.error('Name and email are required'); return; }
    if (!editCustomer.id && !editCustomer.password) { toast.error('Password required for new customer'); return; }
    if (editCustomer.id) {
      setCustomers(prev => prev.map(c => c.id===editCustomer.id ? {...editCustomer, totalSpent:c.totalSpent, orders:c.orders} : c));
      toast.success('Customer updated');
    } else {
      setCustomers(prev => [...prev, {...editCustomer, id:Date.now().toString(), totalSpent:0, orders:0, createdAt:new Date().toISOString()}]);
      toast.success('Customer added');
    }
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete "${name}"? This will remove their account and data.`)) {
      setCustomers(prev => prev.filter(c => c.id!==id));
      toast.success(`"${name}" deleted`);
    }
  };

  const toggleVip = (id) => setCustomers(prev => prev.map(c => c.id===id ? {...c, isVip:!c.isVip} : c));

  const handleWalletAction = (customerId) => {
    const amount = Number(walletAmount);
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      if (walletAction === 'add') return {...c, walletBalance: c.walletBalance + amount};
      if (walletAction === 'deduct') return {...c, walletBalance: Math.max(0, c.walletBalance - amount)};
      if (walletAction === 'set') return {...c, walletBalance: amount};
      return c;
    }));
    toast.success(`Wallet ${walletAction === 'add' ? 'credited' : walletAction === 'deduct' ? 'debited' : 'set to'} $${amount}`);
    setWalletAction(null); setWalletAmount('');
  };

  const timeAgo = (d) => { const m=Math.floor((Date.now()-new Date(d).getTime())/60000); return m<60?`${m}m`:m<1440?`${Math.floor(m/60)}h`:m<43200?`${Math.floor(m/1440)}d`:`${Math.floor(m/43200)}mo`; };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Customers
          </h1>
          <p className="ap-subtitle">{stats.total} customers · ${totalRevenue} revenue · {stats.vip} VIP</p>
        </div>
        <div className="ap-header-actions">
          <button className="btn btn-primary" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Customer
          </button>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {[['all',`All (${stats.total})`],['vip',`VIP (${stats.vip})`],['unverified',`Unverified (${stats.total-stats.verified})`]].map(([k,l])=>(
            <button key={k} className={`ap-filter-tab ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>{l}</button>
          ))}
        </div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search name, email, phone..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Orders</th><th>Spent</th><th>Wallet</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--color-primary),#F39C12)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'0.78rem',flexShrink:0}}>{c.name.charAt(0)}</div><div><div style={{fontWeight:600,fontSize:'0.88rem'}}>{c.name}</div>{c.isVip&&<span style={{fontSize:'0.65rem',background:'rgba(245,158,11,0.12)',color:'#F59E0B',padding:'1px 6px',borderRadius:10,fontWeight:700}}>⭐ VIP</span>}</div></div></td>
                <td style={{fontSize:'0.82rem'}}>{c.email}</td>
                <td style={{fontSize:'0.82rem',color:'var(--color-text-muted)'}}>{c.phone||'—'}</td>
                <td style={{fontWeight:600,textAlign:'center'}}>{c.orders}</td>
                <td style={{fontWeight:700,color:'var(--color-primary)'}}>${c.totalSpent}</td>
                <td><button onClick={()=>{setWalletAction('add');setEditCustomer(c);setWalletAmount('')}} style={{fontWeight:600,background:'none',border:'none',cursor:'pointer',color:'#10B981',fontSize:'0.88rem'}}>${c.walletBalance}</button></td>
                <td>{c.emailVerified?<span style={{color:'#10B981',fontSize:'0.75rem',fontWeight:600}}>✓ Verified</span>:<span style={{color:'#EF4444',fontSize:'0.75rem',fontWeight:600}}>✗ Unverified</span>}</td>
                <td style={{fontSize:'0.78rem',color:'var(--color-text-muted)'}}>{timeAgo(c.createdAt)}</td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" onClick={()=>toggleVip(c.id)} title={c.isVip?'Remove VIP':'Make VIP'} style={{color:c.isVip?'#F59E0B':'var(--color-text-muted)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill={c.isVip?'#F59E0B':'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
                    <button className="ap-action-btn" onClick={()=>openEdit(c)} title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button className="ap-action-btn danger" onClick={()=>handleDelete(c.id,c.name)} title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="ap-empty"><p>No customers found</p></div>}
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal&&editCustomer&&!walletAction&&(
        <div className="ap-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
            <div className="ap-modal-header"><h2>{editCustomer.id?'Edit Customer':'Add Customer'}</h2><button className="ap-modal-close" onClick={()=>setShowModal(false)}>✕</button></div>
            <div className="ap-modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={editCustomer.name} onChange={e=>setEditCustomer(p=>({...p,name:e.target.value}))} placeholder="Ahmed Mohamed"/></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={editCustomer.email} onChange={e=>setEditCustomer(p=>({...p,email:e.target.value}))} placeholder="ahmed@gmail.com"/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={editCustomer.phone} onChange={e=>setEditCustomer(p=>({...p,phone:e.target.value}))} placeholder="+201012345678"/></div>
                <div className="form-group"><label className="form-label">Telegram</label><input className="form-input" value={editCustomer.telegramUsername} onChange={e=>setEditCustomer(p=>({...p,telegramUsername:e.target.value}))} placeholder="@username"/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Language</label>
                  <select className="form-input" value={editCustomer.language} onChange={e=>setEditCustomer(p=>({...p,language:e.target.value}))}><option value="en">English</option><option value="ar">العربية</option></select>
                </div>
                <div className="form-group"><label className="form-label">{editCustomer.id?'New Password':'Password *'}</label><input className="form-input" type="password" value={editCustomer.password} onChange={e=>setEditCustomer(p=>({...p,password:e.target.value}))} placeholder={editCustomer.id?'Leave blank to keep':'••••••••'}/></div>
              </div>
              <div style={{display:'flex',gap:20,padding:'12px 0'}}>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.88rem'}}><input type="checkbox" checked={editCustomer.isVip} onChange={e=>setEditCustomer(p=>({...p,isVip:e.target.checked}))}/> ⭐ VIP Customer</label>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.88rem'}}><input type="checkbox" checked={editCustomer.emailVerified} onChange={e=>setEditCustomer(p=>({...p,emailVerified:e.target.checked}))}/> ✓ Email Verified</label>
              </div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editCustomer.id?'Save':'Add Customer'}</button></div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {walletAction&&editCustomer&&(
        <div className="ap-modal-overlay" onClick={()=>setWalletAction(null)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
            <div className="ap-modal-header"><h2>💰 Wallet — {editCustomer.name}</h2><button className="ap-modal-close" onClick={()=>setWalletAction(null)}>✕</button></div>
            <div className="ap-modal-body">
              <div style={{textAlign:'center',padding:'16px 0'}}>
                <div style={{fontSize:'0.78rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Current Balance</div>
                <div style={{fontSize:'2rem',fontWeight:800,color:'#10B981'}}>${editCustomer.walletBalance}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Action</label>
                <div style={{display:'flex',gap:6}}>
                  {[['add','+ Add'],['deduct','- Deduct'],['set','= Set']].map(([k,l])=>(
                    <button key={k} className={`btn btn-sm ${walletAction===k?'btn-primary':'btn-ghost'}`} onClick={()=>setWalletAction(k)} style={{flex:1}}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input className="form-input" type="number" step="0.01" min="0" value={walletAmount} onChange={e=>setWalletAmount(e.target.value)} placeholder="0.00" style={{fontSize:'1.2rem',fontWeight:700,textAlign:'center'}} autoFocus/>
              </div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setWalletAction(null)}>Cancel</button><button className="btn btn-primary" onClick={()=>handleWalletAction(editCustomer.id)}>Apply</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
