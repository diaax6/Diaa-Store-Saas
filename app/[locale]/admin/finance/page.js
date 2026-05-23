'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';

const demoTransactions = [
  { id:'1', type:'ORDER', description:'Order #ORD-001 — ChatGPT Plus', amount:12, direction:'in', customer:'Ahmed Mohamed', date:'2025-05-22T14:00:00Z', reference:'ORD-001' },
  { id:'2', type:'ORDER', description:'Order #ORD-002 — Adobe CC', amount:25, direction:'in', customer:'Sara Ali', date:'2025-05-22T13:30:00Z', reference:'ORD-002' },
  { id:'3', type:'REFUND', description:'Refund #ORD-007 — YouTube Premium', amount:7, direction:'out', customer:'Khaled Mostafa', date:'2025-05-20T14:00:00Z', reference:'REF-001' },
  { id:'4', type:'ORDER', description:'Order #ORD-003 — Spotify Premium', amount:8, direction:'in', customer:'Omar Hassan', date:'2025-05-22T12:00:00Z', reference:'ORD-003' },
  { id:'5', type:'WALLET_DEPOSIT', description:'Wallet top-up', amount:50, direction:'in', customer:'Omar Hassan', date:'2025-05-21T10:00:00Z', reference:'DEP-001' },
  { id:'6', type:'ORDER', description:'Order #ORD-005 — Microsoft 365', amount:13, direction:'in', customer:'Youssef Tarek', date:'2025-05-21T18:00:00Z', reference:'ORD-005' },
  { id:'7', type:'SUBSCRIPTION', description:'SaaS Plan — Pro Monthly', amount:29, direction:'in', customer:'Platform', date:'2025-05-01T00:00:00Z', reference:'SUB-001' },
  { id:'8', type:'EXPENSE', description:'Server hosting — May 2025', amount:15, direction:'out', customer:'—', date:'2025-05-01T00:00:00Z', reference:'EXP-001' },
];

const typeColors = { ORDER:'#10B981', REFUND:'#EF4444', WALLET_DEPOSIT:'#3B82F6', SUBSCRIPTION:'#8B5CF6', EXPENSE:'#F59E0B', MANUAL:'#6B7280' };
const emptyTx = { id:'', type:'MANUAL', description:'', amount:0, direction:'in', customer:'', date:'', reference:'' };

export default function AdminFinancePage() {
  const [transactions, setTransactions] = useState(demoTransactions);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const toast = useToast();

  const income = transactions.filter(t=>t.direction==='in').reduce((s,t)=>s+t.amount,0);
  const expenses = transactions.filter(t=>t.direction==='out').reduce((s,t)=>s+t.amount,0);
  const net = income - expenses;

  const filtered = filter==='all'?transactions:transactions.filter(t=>t.type===filter);
  const timeAgo = (d) => { const m=Math.floor((Date.now()-new Date(d).getTime())/60000); return m<60?`${m}m ago`:m<1440?`${Math.floor(m/60)}h ago`:`${Math.floor(m/1440)}d ago`; };

  const openAdd = () => { setEditTx({...emptyTx, date:new Date().toISOString().slice(0,16)}); setShowModal(true); };
  const openEdit = (t) => { setEditTx({...t, date:t.date.slice(0,16)}); setShowModal(true); };

  const handleSave = () => {
    if (!editTx.description || !editTx.amount) { toast.error('Description and amount required'); return; }
    if (editTx.id) {
      setTransactions(prev => prev.map(t => t.id===editTx.id ? {...editTx, date:editTx.date+'Z'} : t));
      toast.success('Transaction updated');
    } else {
      setTransactions(prev => [{...editTx, id:Date.now().toString(), date:editTx.date+'Z'}, ...prev]);
      toast.success('Transaction added');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id!==id));
      toast.success('Transaction deleted');
    }
  };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Finance
          </h1>
          <p className="ap-subtitle">{transactions.length} transactions</p>
        </div>
        <div className="ap-header-actions">
          <button className="btn btn-primary" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20,borderLeft:'3px solid #10B981'}}>
          <div style={{fontSize:'0.75rem',color:'var(--color-text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Total Income</div>
          <div style={{fontSize:'1.8rem',fontWeight:800,color:'#10B981',marginTop:4}}>${income}</div>
        </div>
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20,borderLeft:'3px solid #EF4444'}}>
          <div style={{fontSize:'0.75rem',color:'var(--color-text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Expenses / Refunds</div>
          <div style={{fontSize:'1.8rem',fontWeight:800,color:'#EF4444',marginTop:4}}>-${expenses}</div>
        </div>
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20,borderLeft:'3px solid var(--color-primary)'}}>
          <div style={{fontSize:'0.75rem',color:'var(--color-text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Net Revenue</div>
          <div style={{fontSize:'1.8rem',fontWeight:800,color:'var(--color-primary)',marginTop:4}}>${net}</div>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {[['all','All'],['ORDER','Orders'],['REFUND','Refunds'],['WALLET_DEPOSIT','Deposits'],['SUBSCRIPTION','Subscriptions'],['EXPENSE','Expenses']].map(([k,l])=>(
            <button key={k} className={`ap-filter-tab ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Type</th><th>Description</th><th>Reference</th><th>Customer</th><th>Amount</th><th>Time</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.id}>
                <td><span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:20,fontSize:'0.72rem',fontWeight:700,background:`${typeColors[t.type]||'#6B7280'}15`,color:typeColors[t.type]||'#6B7280'}}>{t.type.replace('_',' ')}</span></td>
                <td style={{fontSize:'0.88rem',maxWidth:250}}>{t.description}</td>
                <td><code style={{fontSize:'0.78rem',background:'var(--color-bg-tertiary)',padding:'2px 6px',borderRadius:4}}>{t.reference||'—'}</code></td>
                <td style={{fontSize:'0.82rem',color:'var(--color-text-muted)'}}>{t.customer}</td>
                <td style={{fontWeight:700,fontSize:'0.9rem',color:t.direction==='in'?'#10B981':'#EF4444'}}>{t.direction==='in'?'+':'-'}${t.amount}</td>
                <td style={{fontSize:'0.8rem',color:'var(--color-text-muted)',whiteSpace:'nowrap'}}>{timeAgo(t.date)}</td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" onClick={()=>openEdit(t)} title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button className="ap-action-btn danger" onClick={()=>handleDelete(t.id)} title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Modal */}
      {showModal&&editTx&&(
        <div className="ap-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:500}}>
            <div className="ap-modal-header"><h2>{editTx.id?'Edit Transaction':'Add Transaction'}</h2><button className="ap-modal-close" onClick={()=>setShowModal(false)}>✕</button></div>
            <div className="ap-modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Type</label>
                  <select className="form-input" value={editTx.type} onChange={e=>setEditTx(p=>({...p,type:e.target.value}))}>
                    <option value="ORDER">Order</option><option value="REFUND">Refund</option><option value="WALLET_DEPOSIT">Wallet Deposit</option><option value="SUBSCRIPTION">Subscription</option><option value="EXPENSE">Expense</option><option value="MANUAL">Manual</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Direction</label>
                  <select className="form-input" value={editTx.direction} onChange={e=>setEditTx(p=>({...p,direction:e.target.value}))}>
                    <option value="in">Income (+)</option><option value="out">Expense (-)</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Description *</label><input className="form-input" value={editTx.description} onChange={e=>setEditTx(p=>({...p,description:e.target.value}))} placeholder="Order #ORD-001 — ChatGPT Plus"/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Amount ($) *</label><input className="form-input" type="number" step="0.01" value={editTx.amount} onChange={e=>setEditTx(p=>({...p,amount:Number(e.target.value)}))}/></div>
                <div className="form-group"><label className="form-label">Reference</label><input className="form-input" value={editTx.reference} onChange={e=>setEditTx(p=>({...p,reference:e.target.value}))} placeholder="ORD-001"/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Customer</label><input className="form-input" value={editTx.customer} onChange={e=>setEditTx(p=>({...p,customer:e.target.value}))} placeholder="Customer name"/></div>
                <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="datetime-local" value={editTx.date} onChange={e=>setEditTx(p=>({...p,date:e.target.value}))}/></div>
              </div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editTx.id?'Save':'Add'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
