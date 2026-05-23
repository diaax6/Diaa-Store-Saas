'use client';
import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import '../products/products-admin.css';

const productsList = [
  { id:'p1', name:'ChatGPT Plus', price:12 }, { id:'p2', name:'Adobe CC', price:25 },
  { id:'p3', name:'Spotify Premium', price:8 }, { id:'p4', name:'Netflix Premium', price:10 },
  { id:'p5', name:'Gemini Advanced', price:15 }, { id:'p6', name:'Canva Pro', price:9 },
];

const demoBundles = [
  { id:'b1', name:'AI Power Pack', nameAr:'باقة القوة الذكية', products:['p1','p5'], originalPrice:27, bundlePrice:22, sales:48, status:'active', featured:true, validUntil:'2025-12-31' },
  { id:'b2', name:'Creative Suite', nameAr:'باقة الإبداع', products:['p2','p6'], originalPrice:34, bundlePrice:28, sales:32, status:'active', featured:false, validUntil:'2025-12-31' },
  { id:'b3', name:'Entertainment Bundle', nameAr:'باقة الترفيه', products:['p3','p4'], originalPrice:18, bundlePrice:14, sales:65, status:'active', featured:true, validUntil:'2025-12-31' },
  { id:'b4', name:'Ultimate Pack', nameAr:'الباقة الشاملة', products:['p1','p2','p3','p4'], originalPrice:55, bundlePrice:39, sales:15, status:'inactive', featured:false, validUntil:'2025-06-30' },
];

export default function BundlesPage() {
  const [bundles, setBundles] = useState(demoBundles);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const toast = useToast();

  const openAdd = () => {
    setEdit({ name:'', nameAr:'', products:[], bundlePrice:0, status:'active', featured:false, validUntil:'' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!edit.name||edit.products.length<2) { toast.error('Name and at least 2 products required'); return; }
    const origPrice = edit.products.reduce((s,pid)=>{const p=productsList.find(x=>x.id===pid);return s+(p?p.price:0)},0);
    if (edit.id) {
      setBundles(prev=>prev.map(b=>b.id===edit.id?{...edit,originalPrice:origPrice}:b));
      toast.success('Bundle updated');
    } else {
      setBundles(prev=>[...prev,{...edit,id:`b-${Date.now()}`,originalPrice:origPrice,sales:0}]);
      toast.success('Bundle created');
    }
    setShowModal(false);
  };

  const toggleProduct = (pid) => {
    setEdit(prev=>({...prev, products:prev.products.includes(pid)?prev.products.filter(x=>x!==pid):[...prev.products,pid]}));
  };

  const calcOriginal = () => edit?edit.products.reduce((s,pid)=>{const p=productsList.find(x=>x.id===pid);return s+(p?p.price:0)},0):0;

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Product Bundles
          </h1>
          <p className="ap-subtitle">{bundles.length} bundles · {bundles.filter(b=>b.status==='active').length} active</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Bundle
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:16,marginTop:20}}>
        {bundles.map(b=>{
          const discount = Math.round((1-b.bundlePrice/b.originalPrice)*100);
          return (
            <div key={b.id} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:14,overflow:'hidden',position:'relative'}}>
              {b.featured&&<div style={{position:'absolute',top:12,right:12,fontSize:'.68rem',fontWeight:700,padding:'3px 10px',borderRadius:20,background:'rgba(245,158,11,.15)',color:'#F59E0B',border:'1px solid rgba(245,158,11,.3)'}}>FEATURED</div>}
              <div style={{padding:'20px 20px 0'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <span className={`db-status-badge ${b.status==='active'?'completed':'cancelled'}`} style={{fontSize:'.62rem'}}>{b.status.toUpperCase()}</span>
                </div>
                <h3 style={{fontWeight:800,fontSize:'1.1rem',marginBottom:2}}>{b.name}</h3>
                {b.nameAr&&<p style={{fontSize:'.78rem',color:'var(--color-text-muted)',direction:'rtl'}}>{b.nameAr}</p>}
              </div>
              <div style={{padding:'12px 20px'}}>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {b.products.map(pid=>{const p=productsList.find(x=>x.id===pid);return p?<span key={pid} className="ap-cat-badge">{p.name}</span>:null})}
                </div>
              </div>
              <div style={{padding:'0 20px',display:'flex',alignItems:'baseline',gap:10}}>
                <span style={{fontSize:'1.5rem',fontWeight:800,color:'var(--color-primary)'}}>${b.bundlePrice}</span>
                <span style={{fontSize:'.88rem',textDecoration:'line-through',color:'var(--color-text-muted)'}}>${b.originalPrice}</span>
                <span style={{fontSize:'.75rem',fontWeight:700,color:'#10B981',background:'rgba(16,185,129,.1)',padding:'2px 8px',borderRadius:20}}>-{discount}%</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',marginTop:12,borderTop:'1px solid var(--color-border)',background:'var(--color-bg-tertiary)'}}>
                <span style={{fontSize:'.78rem',color:'var(--color-text-muted)'}}>{b.sales} sales</span>
                <div className="ap-actions">
                  <button className="ap-action-btn" onClick={()=>{setEdit({...b});setShowModal(true)}} title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  <button className="ap-action-btn danger" onClick={()=>{setBundles(prev=>prev.filter(x=>x.id!==b.id));toast.success('Deleted')}} title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal&&edit&&(
        <div className="ap-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
            <div className="ap-modal-header"><h2>{edit.id?'Edit':'Create'} Bundle</h2><button className="ap-modal-close" onClick={()=>setShowModal(false)}>✕</button></div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                <div className="form-group"><label className="form-label">Bundle Name (EN) *</label><input className="form-input" value={edit.name} onChange={e=>setEdit(p=>({...p,name:e.target.value}))} placeholder="AI Power Pack"/></div>
                <div className="form-group"><label className="form-label">Name (AR)</label><input className="form-input" value={edit.nameAr} onChange={e=>setEdit(p=>({...p,nameAr:e.target.value}))} dir="rtl" placeholder="باقة القوة الذكية"/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Select Products (min 2) *</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                  {productsList.map(p=>(
                    <label key={p.id} onClick={()=>toggleProduct(p.id)} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:8,border:`1.5px solid ${edit.products.includes(p.id)?'var(--color-primary)':'var(--color-border)'}`,background:edit.products.includes(p.id)?'rgba(230,126,34,.08)':'transparent',cursor:'pointer',transition:'.15s'}}>
                      <input type="checkbox" checked={edit.products.includes(p.id)} readOnly style={{accentColor:'var(--color-primary)'}}/>
                      <span style={{fontWeight:600,fontSize:'.85rem'}}>{p.name}</span>
                      <span style={{marginLeft:'auto',fontFamily:'monospace',fontSize:'.78rem',color:'var(--color-text-muted)'}}>${p.price}</span>
                    </label>
                  ))}
                </div>
              </div>
              {edit.products.length>=2&&(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:8}}>
                  <div style={{background:'var(--color-bg-tertiary)',padding:14,borderRadius:10,textAlign:'center'}}>
                    <div style={{fontSize:'.68rem',color:'var(--color-text-muted)',textTransform:'uppercase',fontWeight:600}}>Original Price</div>
                    <div style={{fontSize:'1.3rem',fontWeight:800,textDecoration:'line-through',color:'var(--color-text-muted)'}}>${calcOriginal()}</div>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Bundle Price ($) *</label>
                    <input className="form-input" type="number" min="0" step="0.01" value={edit.bundlePrice} onChange={e=>setEdit(p=>({...p,bundlePrice:Number(e.target.value)}))} style={{fontSize:'1.2rem',fontWeight:800,textAlign:'center'}}/>
                    {edit.bundlePrice>0&&edit.bundlePrice<calcOriginal()&&(
                      <div style={{textAlign:'center',marginTop:4}}><span style={{fontSize:'.78rem',fontWeight:700,color:'#10B981'}}>Save {Math.round((1-edit.bundlePrice/calcOriginal())*100)}%</span></div>
                    )}
                  </div>
                </div>
              )}
              <div className="ap-form-grid" style={{marginTop:12}}>
                <div className="form-group"><label className="form-label">Valid Until</label><input className="form-input" type="date" value={edit.validUntil} onChange={e=>setEdit(p=>({...p,validUntil:e.target.value}))}/></div>
                <div className="form-group" style={{display:'flex',alignItems:'flex-end',gap:12}}>
                  <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}><input type="checkbox" checked={edit.featured} onChange={e=>setEdit(p=>({...p,featured:e.target.checked}))} style={{accentColor:'#F59E0B'}}/><span style={{fontSize:'.85rem',fontWeight:600}}>Featured</span></label>
                </div>
              </div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{edit.id?'Save':'Create Bundle'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
