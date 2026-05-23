'use client';
import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import '../products/products-admin.css';

const demoAffiliates = [
  { id:'a1', name:'Ahmed Mohamed', email:'ahmed@test.com', code:'AHMED15', commission:5, totalEarned:124.50, pendingPayout:24.50, totalReferrals:42, activeReferrals:18, clicks:890, conversions:42, status:'active', createdAt:'2025-01-15' },
  { id:'a2', name:'Sara Ali', email:'sara@test.com', code:'SARA10', commission:5, totalEarned:89.00, pendingPayout:15.00, totalReferrals:28, activeReferrals:12, clicks:620, conversions:28, status:'active', createdAt:'2025-02-20' },
  { id:'a3', name:'Omar Hassan', email:'omar@test.com', code:'OMAR20', commission:7, totalEarned:210.75, pendingPayout:45.75, totalReferrals:65, activeReferrals:30, clicks:1420, conversions:65, status:'active', createdAt:'2024-12-01' },
  { id:'a4', name:'Mona Khaled', email:'mona@test.com', code:'MONA5', commission:5, totalEarned:12.00, pendingPayout:12.00, totalReferrals:4, activeReferrals:2, clicks:120, conversions:4, status:'paused', createdAt:'2025-04-10' },
];

const demoPayouts = [
  { id:'p1', affiliateId:'a1', amount:100, method:'wallet', status:'paid', date:'2025-05-20' },
  { id:'p2', affiliateId:'a2', amount:74, method:'wallet', status:'paid', date:'2025-05-18' },
  { id:'p3', affiliateId:'a3', amount:165, method:'bank', status:'paid', date:'2025-05-15' },
  { id:'p4', affiliateId:'a3', amount:45.75, method:'wallet', status:'pending', date:'2025-05-22' },
];

export default function AffiliatePage() {
  const [affiliates, setAffiliates] = useState(demoAffiliates);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAffiliate, setEditAffiliate] = useState(null);
  const [showPayouts, setShowPayouts] = useState(null);
  const toast = useToast();

  const totals = {
    earned: affiliates.reduce((s,a)=>s+a.totalEarned,0),
    pending: affiliates.reduce((s,a)=>s+a.pendingPayout,0),
    referrals: affiliates.reduce((s,a)=>s+a.totalReferrals,0),
    clicks: affiliates.reduce((s,a)=>s+a.clicks,0),
  };

  const filtered = affiliates.filter(a=>a.name.toLowerCase().includes(search.toLowerCase())||a.code.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditAffiliate({ name:'', email:'', code:'', commission:5, status:'active' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editAffiliate.name||!editAffiliate.code) { toast.error('Name and code required'); return; }
    if (editAffiliate.id) {
      setAffiliates(prev=>prev.map(a=>a.id===editAffiliate.id?{...a,...editAffiliate}:a));
      toast.success('Affiliate updated');
    } else {
      setAffiliates(prev=>[...prev, {...editAffiliate, id:`a-${Date.now()}`, totalEarned:0, pendingPayout:0, totalReferrals:0, activeReferrals:0, clicks:0, conversions:0, createdAt:new Date().toISOString().split('T')[0]}]);
      toast.success('Affiliate created');
    }
    setShowModal(false);
  };

  const payOut = (aff) => {
    if (aff.pendingPayout<=0) { toast.error('No pending payout'); return; }
    setAffiliates(prev=>prev.map(a=>a.id===aff.id?{...a,pendingPayout:0}:a));
    toast.success(`$${aff.pendingPayout.toFixed(2)} paid out to ${aff.name}`);
  };

  const copyLink = (code) => {
    navigator.clipboard?.writeText(`https://store.diaa.com/?ref=${code}`);
    toast.success('Referral link copied!');
  };

  return (
    <div className="ap-page">
      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[
          { label:'Total Earned', value:`$${totals.earned.toFixed(0)}`, color:'#10B981', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
          { label:'Pending Payouts', value:`$${totals.pending.toFixed(0)}`, color:'#F59E0B', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label:'Total Referrals', value:totals.referrals, color:'#6366F1', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> },
          { label:'Total Clicks', value:totals.clicks.toLocaleString(), color:'#E67E22', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:'16px 18px',borderLeft:`3px solid ${s.color}`}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color}}>{s.icon}</div>
              <div>
                <div style={{fontSize:'.68rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>{s.label}</div>
                <div style={{fontSize:'1.3rem',fontWeight:800,color:s.color}}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Affiliate Program
          </h1>
          <p className="ap-subtitle">Manage referral partners, commissions, and payouts</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Affiliate
        </button>
      </div>

      <div className="ap-toolbar">
        <div></div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search affiliates..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Affiliate</th><th>Code</th><th>Commission</th><th>Clicks</th><th>Conversions</th><th>Conv. Rate</th><th>Earned</th><th>Pending</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(a=>(
              <tr key={a.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.78rem'}}>{a.name.charAt(0)}</div>
                    <div><div style={{fontWeight:600,fontSize:'.85rem'}}>{a.name}</div><div style={{fontSize:'.68rem',color:'var(--color-text-muted)'}}>{a.email}</div></div>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:4}}>
                    <span style={{fontFamily:'monospace',fontWeight:700,fontSize:'.85rem',background:'var(--color-bg-tertiary)',padding:'3px 8px',borderRadius:6}}>{a.code}</span>
                    <button onClick={()=>copyLink(a.code)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--color-text-muted)',padding:2}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </td>
                <td><span style={{fontWeight:700,color:'var(--color-primary)'}}>{a.commission}%</span></td>
                <td style={{fontFamily:'monospace'}}>{a.clicks.toLocaleString()}</td>
                <td style={{fontFamily:'monospace'}}>{a.conversions}</td>
                <td><span style={{fontWeight:700,color:a.clicks>0&&(a.conversions/a.clicks*100)>=4?'#10B981':'var(--color-text-muted)'}}>{a.clicks>0?(a.conversions/a.clicks*100).toFixed(1):'0.0'}%</span></td>
                <td style={{fontFamily:'monospace',fontWeight:700,color:'#10B981'}}>${a.totalEarned.toFixed(2)}</td>
                <td><span style={{fontFamily:'monospace',fontWeight:700,color:a.pendingPayout>0?'#F59E0B':'var(--color-text-muted)'}}>${a.pendingPayout.toFixed(2)}</span></td>
                <td><span className={`db-status-badge ${a.status==='active'?'completed':'cancelled'}`}>{a.status.toUpperCase()}</span></td>
                <td>
                  <div className="ap-actions">
                    {a.pendingPayout>0&&<button className="ap-action-btn" style={{color:'#10B981',borderColor:'rgba(16,185,129,.3)'}} onClick={()=>payOut(a)} title="Pay Out"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></button>}
                    <button className="ap-action-btn" onClick={()=>{setEditAffiliate({...a});setShowModal(true)}} title="Edit"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal&&editAffiliate&&(
        <div className="ap-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
            <div className="ap-modal-header"><h2>{editAffiliate.id?'Edit':'New'} Affiliate</h2><button className="ap-modal-close" onClick={()=>setShowModal(false)}>✕</button></div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={editAffiliate.name} onChange={e=>setEditAffiliate(p=>({...p,name:e.target.value}))} placeholder="Ahmed Mohamed"/></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={editAffiliate.email} onChange={e=>setEditAffiliate(p=>({...p,email:e.target.value}))} placeholder="ahmed@test.com"/></div>
              </div>
              <div className="ap-form-grid">
                <div className="form-group"><label className="form-label">Referral Code *</label><input className="form-input" value={editAffiliate.code} onChange={e=>setEditAffiliate(p=>({...p,code:e.target.value.toUpperCase()}))} placeholder="AHMED15" style={{fontFamily:'monospace',fontWeight:700}}/></div>
                <div className="form-group"><label className="form-label">Commission %</label><input className="form-input" type="number" min="1" max="50" value={editAffiliate.commission} onChange={e=>setEditAffiliate(p=>({...p,commission:Number(e.target.value)}))}/></div>
              </div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-input" value={editAffiliate.status} onChange={e=>setEditAffiliate(p=>({...p,status:e.target.value}))}>
                  <option value="active">Active</option><option value="paused">Paused</option>
                </select>
              </div>
              {!editAffiliate.id&&(
                <div style={{background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.2)',borderRadius:10,padding:12,marginTop:8}}>
                  <div style={{fontSize:'.78rem',color:'var(--color-text-muted)'}}>Referral Link Preview:</div>
                  <div style={{fontFamily:'monospace',fontSize:'.82rem',fontWeight:600,marginTop:4}}>https://store.diaa.com/?ref={editAffiliate.code||'CODE'}</div>
                </div>
              )}
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editAffiliate.id?'Save':'Create'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
