'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';

const demoProducts = ['ChatGPT Plus','Adobe Creative Cloud','Spotify Premium','Netflix Premium','Gemini Advanced','Microsoft 365','YouTube Premium','Canva Pro'];
const demoCategories = ['AI Tools','Design','Streaming','Music','Productivity'];

const demoCoupons = [
  { id:'1', code:'WELCOME10', type:'PERCENTAGE', value:10, minOrder:0, maxDiscount:0, scope:'ALL', scopeTargets:[], maxUses:100, usedCount:34, isActive:true, expiresAt:null, createdAt:'2025-05-01T00:00:00Z' },
  { id:'2', code:'SAVE5', type:'FIXED', value:5, minOrder:10, maxDiscount:0, scope:'ALL', scopeTargets:[], maxUses:50, usedCount:12, isActive:true, expiresAt:'2025-12-31', createdAt:'2025-05-10T00:00:00Z' },
  { id:'3', code:'VIP20', type:'PERCENTAGE', value:20, minOrder:0, maxDiscount:50, scope:'CATEGORY', scopeTargets:['AI Tools','Design'], maxUses:10, usedCount:10, isActive:false, expiresAt:null, createdAt:'2025-04-15T00:00:00Z' },
  { id:'4', code:'SUMMER15', type:'PERCENTAGE', value:15, minOrder:0, maxDiscount:30, scope:'ALL', scopeTargets:[], maxUses:200, usedCount:0, isActive:true, expiresAt:'2025-08-31', createdAt:'2025-05-20T00:00:00Z' },
  { id:'5', code:'CHATGPT25', type:'PERCENTAGE', value:25, minOrder:0, maxDiscount:0, scope:'PRODUCT', scopeTargets:['ChatGPT Plus'], maxUses:50, usedCount:8, isActive:true, expiresAt:null, createdAt:'2025-05-18T00:00:00Z' },
];

const emptyCoupon = { id:'', code:'', type:'PERCENTAGE', value:0, minOrder:0, maxDiscount:0, scope:'ALL', scopeTargets:[], maxUses:100, usedCount:0, isActive:true, expiresAt:'' };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(demoCoupons);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const filtered = coupons.filter(c => !search || c.code.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditCoupon({...emptyCoupon}); setShowModal(true); };
  const openEdit = (c) => { setEditCoupon({...c, scopeTargets:[...c.scopeTargets]}); setShowModal(true); };

  const handleSave = () => {
    if (!editCoupon.code) { toast.error('Coupon code is required'); return; }
    if (!editCoupon.value) { toast.error('Discount value is required'); return; }
    if (editCoupon.scope !== 'ALL' && editCoupon.scopeTargets.length === 0) { toast.error(`Select at least one ${editCoupon.scope.toLowerCase()}`); return; }
    if (editCoupon.id) {
      setCoupons(prev => prev.map(c => c.id===editCoupon.id ? editCoupon : c));
      toast.success('Coupon updated');
    } else {
      setCoupons(prev => [...prev, {...editCoupon, id:Date.now().toString(), createdAt:new Date().toISOString()}]);
      toast.success('Coupon created');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { if (confirm('Delete this coupon?')) { setCoupons(prev => prev.filter(c => c.id!==id)); toast.success('Coupon deleted'); }};
  const toggleActive = (id) => setCoupons(prev => prev.map(c => c.id===id ? {...c, isActive:!c.isActive} : c));
  const handleDuplicate = (c) => {
    setCoupons(prev => [...prev, {...c, id:Date.now().toString(), code:c.code+'_COPY', usedCount:0}]);
    toast.success('Coupon duplicated');
  };

  const toggleScopeTarget = (target) => {
    setEditCoupon(prev => ({
      ...prev,
      scopeTargets: prev.scopeTargets.includes(target) ? prev.scopeTargets.filter(t=>t!==target) : [...prev.scopeTargets, target]
    }));
  };

  const scopeLabel = (c) => {
    if (c.scope === 'ALL') return 'All Products';
    return c.scopeTargets.join(', ');
  };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Coupons
          </h1>
          <p className="ap-subtitle">{coupons.length} coupons · {coupons.filter(c=>c.isActive).length} active</p>
        </div>
        <div className="ap-header-actions">
          <button className="btn btn-primary" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Coupon
          </button>
        </div>
      </div>

      <div className="ap-toolbar">
        <div></div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search coupons..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Code</th><th>Discount</th><th>Scope</th><th>Min Order</th><th>Usage</th><th>Status</th><th>Expires</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id} style={{opacity:c.isActive?1:0.55}}>
                <td><code style={{fontWeight:700,fontSize:'0.9rem',background:'var(--color-bg-tertiary)',padding:'4px 12px',borderRadius:6,fontFamily:'monospace',letterSpacing:'0.05em'}}>{c.code}</code></td>
                <td><span style={{fontWeight:700,fontSize:'0.95rem',color:'var(--color-primary)'}}>{c.type==='PERCENTAGE'?`${c.value}%`:`$${c.value}`}</span>{c.maxDiscount>0&&<span style={{fontSize:'0.72rem',color:'var(--color-text-muted)',marginLeft:4}}>(max ${c.maxDiscount})</span>}</td>
                <td><div style={{maxWidth:180}}><span style={{fontSize:'0.78rem',display:'inline-flex',alignItems:'center',gap:4}}>
                  <span style={{padding:'2px 8px',borderRadius:12,fontSize:'0.7rem',fontWeight:600,background:c.scope==='ALL'?'rgba(16,185,129,0.1)':c.scope==='CATEGORY'?'rgba(139,92,246,0.1)':'rgba(59,130,246,0.1)',color:c.scope==='ALL'?'#10B981':c.scope==='CATEGORY'?'#8B5CF6':'#3B82F6'}}>{c.scope}</span>
                  {c.scope!=='ALL'&&<span style={{fontSize:'0.72rem',color:'var(--color-text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:100}}>{c.scopeTargets.join(', ')}</span>}
                </span></div></td>
                <td style={{fontSize:'0.85rem'}}>{c.minOrder>0?`$${c.minOrder}`:'—'}</td>
                <td><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{flex:1,height:6,background:'var(--color-bg-tertiary)',borderRadius:3,overflow:'hidden',maxWidth:80}}><div style={{height:'100%',background:c.usedCount>=c.maxUses?'#EF4444':'#10B981',width:`${Math.min(100,(c.usedCount/c.maxUses)*100)}%`,borderRadius:3,transition:'0.3s'}}></div></div><span style={{fontSize:'0.75rem',color:'var(--color-text-muted)'}}>{c.usedCount}/{c.maxUses}</span></div></td>
                <td><label className="toggle" style={{transform:'scale(0.8)'}}><input type="checkbox" checked={c.isActive} onChange={()=>toggleActive(c.id)}/><span className="toggle-slider"></span></label></td>
                <td style={{fontSize:'0.8rem',color:'var(--color-text-muted)'}}>{c.expiresAt||'Never'}</td>
                <td><div className="ap-actions">
                  <button className="ap-action-btn" onClick={()=>openEdit(c)} title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  <button className="ap-action-btn" onClick={()=>handleDuplicate(c)} title="Duplicate"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                  <button className="ap-action-btn danger" onClick={()=>handleDelete(c.id)} title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coupon Modal */}
      {showModal&&editCoupon&&(
        <div className="ap-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
            <div className="ap-modal-header"><h2>{editCoupon.id?'Edit Coupon':'Create Coupon'}</h2><button className="ap-modal-close" onClick={()=>setShowModal(false)}>✕</button></div>
            <div className="ap-modal-body">
              {/* Code */}
              <div className="form-group"><label className="form-label">Coupon Code *</label><input className="form-input" value={editCoupon.code} onChange={e=>setEditCoupon(p=>({...p,code:e.target.value.toUpperCase().replace(/\s+/g,'')}))} placeholder="e.g. SAVE20" style={{fontFamily:'monospace',fontWeight:700,fontSize:'1rem',letterSpacing:'0.05em'}}/></div>
              
              {/* Discount Type & Value */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Discount Type</label>
                  <select className="form-input" value={editCoupon.type} onChange={e=>setEditCoupon(p=>({...p,type:e.target.value}))}><option value="PERCENTAGE">Percentage (%)</option><option value="FIXED">Fixed Amount ($)</option></select>
                </div>
                <div className="form-group"><label className="form-label">Value *</label>
                  <div style={{display:'flex',alignItems:'center',gap:0}}>
                    <input className="form-input" type="number" min="0" step={editCoupon.type==='PERCENTAGE'?'1':'0.01'} value={editCoupon.value} onChange={e=>setEditCoupon(p=>({...p,value:Number(e.target.value)}))} style={{borderRadius:'8px 0 0 8px'}}/>
                    <span style={{padding:'8px 12px',background:'var(--color-bg-tertiary)',border:'1px solid var(--color-border)',borderLeft:'none',borderRadius:'0 8px 8px 0',fontWeight:700,color:'var(--color-text-muted)'}}>{editCoupon.type==='PERCENTAGE'?'%':'$'}</span>
                  </div>
                </div>
              </div>
              {editCoupon.type==='PERCENTAGE'&&(
                <div className="form-group"><label className="form-label">Max Discount ($)</label><input className="form-input" type="number" min="0" step="0.01" value={editCoupon.maxDiscount} onChange={e=>setEditCoupon(p=>({...p,maxDiscount:Number(e.target.value)}))} placeholder="0 = unlimited"/></div>
              )}

              {/* Scope */}
              <div className="form-group">
                <label className="form-label">Applies To</label>
                <div style={{display:'flex',gap:8,marginBottom:editCoupon.scope!=='ALL'?12:0}}>
                  {[['ALL','🌐 All Products'],['CATEGORY','📁 Specific Categories'],['PRODUCT','📦 Specific Products']].map(([k,l])=>(
                    <button key={k} className={`btn btn-sm ${editCoupon.scope===k?'btn-primary':'btn-ghost'}`} onClick={()=>setEditCoupon(p=>({...p,scope:k,scopeTargets:[]}))} style={{flex:1}}>{l}</button>
                  ))}
                </div>
                {editCoupon.scope==='CATEGORY'&&(
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:12,background:'var(--color-bg-secondary)',borderRadius:8,border:'1px solid var(--color-border)'}}>
                    {demoCategories.map(cat=>(
                      <button key={cat} onClick={()=>toggleScopeTarget(cat)} style={{
                        padding:'5px 12px',borderRadius:20,border:'1px solid',fontSize:'0.78rem',fontWeight:600,cursor:'pointer',transition:'0.15s',
                        background:editCoupon.scopeTargets.includes(cat)?'rgba(139,92,246,0.15)':'transparent',
                        borderColor:editCoupon.scopeTargets.includes(cat)?'#8B5CF6':'var(--color-border)',
                        color:editCoupon.scopeTargets.includes(cat)?'#8B5CF6':'var(--color-text-muted)',
                      }}>{editCoupon.scopeTargets.includes(cat)?'✓ ':''}{cat}</button>
                    ))}
                  </div>
                )}
                {editCoupon.scope==='PRODUCT'&&(
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:12,background:'var(--color-bg-secondary)',borderRadius:8,border:'1px solid var(--color-border)'}}>
                    {demoProducts.map(prod=>(
                      <button key={prod} onClick={()=>toggleScopeTarget(prod)} style={{
                        padding:'5px 12px',borderRadius:20,border:'1px solid',fontSize:'0.78rem',fontWeight:600,cursor:'pointer',transition:'0.15s',
                        background:editCoupon.scopeTargets.includes(prod)?'rgba(59,130,246,0.15)':'transparent',
                        borderColor:editCoupon.scopeTargets.includes(prod)?'#3B82F6':'var(--color-border)',
                        color:editCoupon.scopeTargets.includes(prod)?'#3B82F6':'var(--color-text-muted)',
                      }}>{editCoupon.scopeTargets.includes(prod)?'✓ ':''}{prod}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Limits */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Min Order ($)</label><input className="form-input" type="number" min="0" value={editCoupon.minOrder} onChange={e=>setEditCoupon(p=>({...p,minOrder:Number(e.target.value)}))}/></div>
                <div className="form-group"><label className="form-label">Max Uses</label><input className="form-input" type="number" min="1" value={editCoupon.maxUses} onChange={e=>setEditCoupon(p=>({...p,maxUses:Number(e.target.value)}))}/></div>
                <div className="form-group"><label className="form-label">Expires</label><input className="form-input" type="date" value={editCoupon.expiresAt||''} onChange={e=>setEditCoupon(p=>({...p,expiresAt:e.target.value}))}/></div>
              </div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editCoupon.id?'Save':'Create'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
