'use client';
import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import '../products/products-admin.css';

const demoCustomers = [
  { id:'1', name:'Ahmed Mohamed', email:'ahmed@test.com', balance:45.50, totalDeposits:200, totalSpent:154.50, lastDeposit:'2025-05-22', tier:'Gold' },
  { id:'2', name:'Sara Ali', email:'sara@test.com', balance:120.00, totalDeposits:300, totalSpent:180, lastDeposit:'2025-05-21', tier:'Platinum' },
  { id:'3', name:'Omar Hassan', email:'omar@test.com', balance:8.25, totalDeposits:50, totalSpent:41.75, lastDeposit:'2025-05-20', tier:'Silver' },
  { id:'4', name:'Mona Khaled', email:'mona@test.com', balance:0, totalDeposits:80, totalSpent:80, lastDeposit:'2025-05-18', tier:'Bronze' },
  { id:'5', name:'Youssef Tarek', email:'youssef@test.com', balance:67.00, totalDeposits:150, totalSpent:83, lastDeposit:'2025-05-22', tier:'Gold' },
];

const demoTransactions = [
  { id:'t1', customerId:'1', type:'deposit', amount:50, method:'card', status:'completed', note:'Manual top-up', createdAt:'2025-05-22T14:00:00Z' },
  { id:'t2', customerId:'1', type:'purchase', amount:-12, method:'wallet', status:'completed', note:'ChatGPT Plus — ORD-001', createdAt:'2025-05-22T14:05:00Z' },
  { id:'t3', customerId:'2', type:'deposit', amount:100, method:'crypto', status:'completed', note:'USDT deposit', createdAt:'2025-05-21T10:00:00Z' },
  { id:'t4', customerId:'2', type:'bonus', amount:5, method:'system', status:'completed', note:'Deposit bonus (5%)', createdAt:'2025-05-21T10:00:01Z' },
  { id:'t5', customerId:'3', type:'purchase', amount:-15, method:'wallet', status:'completed', note:'Gemini Advanced — ORD-003', createdAt:'2025-05-20T16:00:00Z' },
  { id:'t6', customerId:'5', type:'refund', amount:10, method:'system', status:'completed', note:'Refund for ORD-005', createdAt:'2025-05-22T12:00:00Z' },
  { id:'t7', customerId:'4', type:'deposit', amount:30, method:'bank', status:'pending', note:'Bank transfer — awaiting confirmation', createdAt:'2025-05-22T18:00:00Z' },
];

const tierColors = { Bronze:'#CD7F32', Silver:'#C0C0C0', Gold:'#FFD700', Platinum:'#E5E4E2' };
const typeConfig = {
  deposit:  { color:'#10B981', bg:'rgba(16,185,129,.1)',  label:'Deposit',  icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
  purchase: { color:'#6366F1', bg:'rgba(99,102,241,.1)',  label:'Purchase', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
  bonus:    { color:'#F59E0B', bg:'rgba(245,158,11,.1)',  label:'Bonus',    icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  refund:   { color:'#8B5CF6', bg:'rgba(139,92,246,.1)',  label:'Refund',   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> },
};

export default function WalletPage() {
  const [customers, setCustomers] = useState(demoCustomers);
  const [transactions, setTransactions] = useState(demoTransactions);
  const [search, setSearch] = useState('');
  const [showDeposit, setShowDeposit] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');
  const [bonusPercent, setBonusPercent] = useState(5);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const toast = useToast();

  const totalBalance = customers.reduce((s,c) => s+c.balance, 0);
  const totalDeposits = customers.reduce((s,c) => s+c.totalDeposits, 0);
  const pendingDeposits = transactions.filter(t=>t.status==='pending').length;

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search));

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    const bonus = Math.round(amount * bonusPercent / 100 * 100) / 100;
    const customer = customers.find(c=>c.id===showDeposit);

    setCustomers(prev => prev.map(c => c.id===showDeposit ? {...c, balance: c.balance+amount+bonus, totalDeposits: c.totalDeposits+amount+bonus, lastDeposit: new Date().toISOString().split('T')[0]} : c));

    const newTx = { id:`t-${Date.now()}`, customerId:showDeposit, type:'deposit', amount, method:'manual', status:'completed', note:depositNote||'Admin deposit', createdAt:new Date().toISOString() };
    const txList = [newTx];
    if (bonus > 0) {
      txList.push({ id:`t-${Date.now()}-b`, customerId:showDeposit, type:'bonus', amount:bonus, method:'system', status:'completed', note:`Deposit bonus (${bonusPercent}%)`, createdAt:new Date().toISOString() });
    }
    setTransactions(prev => [...txList, ...prev]);
    toast.success(`$${amount} deposited to ${customer?.name}${bonus>0?` + $${bonus} bonus`:''}`);
    setShowDeposit(null); setDepositAmount(''); setDepositNote('');
  };

  const customerTxs = viewCustomer ? transactions.filter(t=>t.customerId===viewCustomer.id) : [];
  const formatDate = d => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});

  return (
    <div className="ap-page">
      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[
          {label:'Total Balance',value:`$${totalBalance.toFixed(2)}`,color:'#10B981',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>},
          {label:'Total Deposits',value:`$${totalDeposits.toFixed(0)}`,color:'#6366F1',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>},
          {label:'Active Wallets',value:customers.filter(c=>c.balance>0).length,color:'#F59E0B',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
          {label:'Pending',value:pendingDeposits,color:'#EF4444',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:'16px 18px',display:'flex',alignItems:'center',gap:14,borderLeft:`3px solid ${s.color}`}}>
            <div style={{width:42,height:42,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color}}>{s.icon}</div>
            <div><div style={{fontSize:'.72rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>{s.label}</div><div style={{fontSize:'1.4rem',fontWeight:800,color:s.color}}>{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Customer Wallets
          </h1>
          <p className="ap-subtitle">Manage customer balances, deposits, and bonuses</p>
        </div>
      </div>

      <div className="ap-toolbar">
        <div></div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search customers..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Customer</th><th>Balance</th><th>Total Deposits</th><th>Total Spent</th><th>Tier</th><th>Last Deposit</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,var(--color-primary),#F39C12)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.78rem'}}>{c.name.charAt(0)}</div>
                    <div><div style={{fontWeight:600,fontSize:'.88rem'}}>{c.name}</div><div style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>{c.email}</div></div>
                  </div>
                </td>
                <td><span style={{fontWeight:800,fontSize:'1rem',color:c.balance>0?'#10B981':'var(--color-text-muted)',fontFamily:'monospace'}}>${c.balance.toFixed(2)}</span></td>
                <td style={{fontFamily:'monospace',fontWeight:600}}>${c.totalDeposits}</td>
                <td style={{fontFamily:'monospace',fontWeight:600,color:'#6366F1'}}>${c.totalSpent}</td>
                <td><span style={{fontSize:'.72rem',fontWeight:700,padding:'3px 10px',borderRadius:20,background:`${tierColors[c.tier]}20`,color:tierColors[c.tier],border:`1px solid ${tierColors[c.tier]}40`}}>{c.tier}</span></td>
                <td style={{color:'var(--color-text-muted)',fontSize:'.82rem'}}>{c.lastDeposit}</td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" style={{color:'#10B981',borderColor:'rgba(16,185,129,.3)'}} onClick={()=>{setShowDeposit(c.id);setDepositAmount('');setDepositNote('')}} title="Add Deposit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <button className="ap-action-btn" onClick={()=>setViewCustomer(c)} title="View History">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deposit Modal */}
      {showDeposit&&(
        <div className="ap-modal-overlay" onClick={()=>setShowDeposit(null)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
            <div className="ap-modal-header"><h2>Add Deposit</h2><button className="ap-modal-close" onClick={()=>setShowDeposit(null)}>✕</button></div>
            <div className="ap-modal-body">
              <div style={{textAlign:'center',marginBottom:20}}>
                <div style={{fontSize:'.78rem',color:'var(--color-text-muted)',marginBottom:4}}>Depositing to</div>
                <div style={{fontWeight:700,fontSize:'1.1rem'}}>{customers.find(c=>c.id===showDeposit)?.name}</div>
              </div>
              <div className="form-group"><label className="form-label">Amount ($)</label><input className="form-input" type="number" min="0.01" step="0.01" value={depositAmount} onChange={e=>setDepositAmount(e.target.value)} placeholder="50.00" style={{fontSize:'1.5rem',fontWeight:800,textAlign:'center',fontFamily:'monospace'}}/></div>
              <div className="form-group"><label className="form-label">Bonus %</label>
                <div style={{display:'flex',gap:6}}>
                  {[0,3,5,10,15].map(p=><button key={p} onClick={()=>setBonusPercent(p)} style={{flex:1,padding:'6px 0',borderRadius:8,border:bonusPercent===p?'2px solid var(--color-primary)':'1px solid var(--color-border)',background:bonusPercent===p?'rgba(230,126,34,.1)':'transparent',color:bonusPercent===p?'var(--color-primary)':'var(--color-text-muted)',fontWeight:700,fontSize:'.82rem',cursor:'pointer'}}>{p}%</button>)}
                </div>
              </div>
              {depositAmount && Number(depositAmount)>0 && bonusPercent>0 && (
                <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.2)',borderRadius:10,padding:12,textAlign:'center',marginBottom:12}}>
                  <span style={{fontSize:'.78rem',color:'var(--color-text-muted)'}}>Customer receives: </span>
                  <span style={{fontWeight:800,color:'#10B981',fontSize:'1.1rem'}}>${(Number(depositAmount)*(1+bonusPercent/100)).toFixed(2)}</span>
                  <span style={{fontSize:'.72rem',color:'#10B981',marginLeft:6}}>(+${(Number(depositAmount)*bonusPercent/100).toFixed(2)} bonus)</span>
                </div>
              )}
              <div className="form-group"><label className="form-label">Note</label><input className="form-input" value={depositNote} onChange={e=>setDepositNote(e.target.value)} placeholder="Optional note..."/></div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setShowDeposit(null)}>Cancel</button><button className="btn btn-primary" onClick={handleDeposit}>Confirm Deposit</button></div>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {viewCustomer&&(
        <div className="ap-modal-overlay" onClick={()=>setViewCustomer(null)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
            <div className="ap-modal-header"><h2>Wallet History — {viewCustomer.name}</h2><button className="ap-modal-close" onClick={()=>setViewCustomer(null)}>✕</button></div>
            <div className="ap-modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20}}>
                <div style={{background:'var(--color-bg-tertiary)',padding:12,borderRadius:10,textAlign:'center'}}><div style={{fontSize:'.68rem',color:'var(--color-text-muted)',textTransform:'uppercase',fontWeight:600}}>Balance</div><div style={{fontSize:'1.3rem',fontWeight:800,color:'#10B981'}}>${viewCustomer.balance.toFixed(2)}</div></div>
                <div style={{background:'var(--color-bg-tertiary)',padding:12,borderRadius:10,textAlign:'center'}}><div style={{fontSize:'.68rem',color:'var(--color-text-muted)',textTransform:'uppercase',fontWeight:600}}>Deposited</div><div style={{fontSize:'1.3rem',fontWeight:800}}>${viewCustomer.totalDeposits}</div></div>
                <div style={{background:'var(--color-bg-tertiary)',padding:12,borderRadius:10,textAlign:'center'}}><div style={{fontSize:'.68rem',color:'var(--color-text-muted)',textTransform:'uppercase',fontWeight:600}}>Spent</div><div style={{fontSize:'1.3rem',fontWeight:800,color:'#6366F1'}}>${viewCustomer.totalSpent}</div></div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:0}}>
                {customerTxs.length === 0 && <div style={{textAlign:'center',padding:30,color:'var(--color-text-muted)'}}>No transactions yet</div>}
                {customerTxs.map(tx=>{
                  const cfg = typeConfig[tx.type]||typeConfig.deposit;
                  return (
                    <div key={tx.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid var(--color-border)'}}>
                      <div style={{width:32,height:32,borderRadius:8,background:cfg.bg,color:cfg.color,display:'flex',alignItems:'center',justifyContent:'center'}}>{cfg.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:'.85rem'}}>{cfg.label}</div>
                        <div style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>{tx.note}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontWeight:800,fontFamily:'monospace',color:tx.amount>=0?'#10B981':'var(--color-text)'}}>{tx.amount>=0?'+':''}${Math.abs(tx.amount).toFixed(2)}</div>
                        <div style={{fontSize:'.68rem',color:'var(--color-text-muted)'}}>{formatDate(tx.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setViewCustomer(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
