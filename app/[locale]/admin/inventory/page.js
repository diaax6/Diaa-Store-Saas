'use client';
import { useState, useCallback } from 'react';
import { useToast } from '../../components/ToastProvider';
import { demoCategories, statusColors, statusLabels, getCatStats, timeAgo, daysUntil, generateId } from './inventoryData';
import { SingleItemModal, BulkImportModal, CreateCategoryModal, EditCategoryModal } from './InventoryModals';
import { QuickWithdrawPanel, ActivityLogPanel, AnalyticsPanel, QuickLinksPanel } from './InventoryPanels';
import './inventory.css';

const CopyIcon = ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const EyeIcon = ({open})=>open?<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8"/></svg>:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const TrashIcon = ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EditIcon = ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const WithdrawIcon = ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

const defaultLinks = [
  {name:'Cards Redeem (EFund)',url:'https://card.efuncard.com'},
  {name:'Diaa Store Mails',url:'mail.diastore.cloud'},
  {name:'2FA Code Website',url:'https://2fa.diaa.store'},
];

export default function AdminInventoryPage() {
  const [categories, setCategories] = useState(demoCategories);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [logs, setLogs] = useState([
    {type:'add',text:'Added 3 items to Gmail Accounts (New)',time:new Date(Date.now()-3600000).toISOString()},
    {type:'withdraw',text:'Withdrew 1 item from ChatGPT Plus Accounts → Omar Hassan',time:new Date(Date.now()-7200000).toISOString()},
    {type:'import',text:'Bulk imported 10 items to US Cards (Nikocards)',time:new Date(Date.now()-86400000).toISOString()},
  ]);
  const [links, setLinks] = useState(defaultLinks);
  const [showCreateCat, setShowCreateCat] = useState(false);
  const [showEditCat, setShowEditCat] = useState(null);
  const [showAddItem, setShowAddItem] = useState(null);
  const [showEditItem, setShowEditItem] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(null);
  const toast = useToast();

  const addLog = useCallback((type, text) => {
    setLogs(p => [{type, text, time: new Date().toISOString()}, ...p]);
  }, []);

  // Global stats
  const allItems = categories.flatMap(c => c.items);
  const globalStats = {
    total: allItems.length,
    available: allItems.filter(i=>i.status==='available').length,
    used: allItems.filter(i=>i.status==='used').length,
    totalCost: allItems.reduce((s,i)=>s+(i.costUSD||0),0),
  };

  // Active category + filtered items
  const activeCatData = activeCat ? categories.find(c=>c.id===activeCat) : null;
  const filteredItems = activeCatData ? activeCatData.items.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return i.email.toLowerCase().includes(q) || (i.password||'').toLowerCase().includes(q) || (i.soldTo||'').toLowerCase().includes(q);
  }) : [];

  // Quick withdraw
  const handleWithdraw = (catId) => {
    setCategories(prev => prev.map(c => {
      if (c.id !== catId) return c;
      const idx = c.items.findIndex(i => i.status === 'available');
      if (idx === -1) { toast.error('No available items!'); return c; }
      const item = c.items[idx];
      const updated = [...c.items];
      updated[idx] = {...item, status:'used', usedCount:(item.usedCount||0)+1, soldTo:'Quick Withdraw'};
      const dataStr = item.email + (item.password ? ':' + item.password : '');
      navigator.clipboard.writeText(dataStr);
      toast.success(`Withdrawn & copied: ${item.email.substring(0,20)}...`);
      addLog('withdraw', `Quick withdrew from ${c.name}: ${item.email.substring(0,25)}`);
      return {...c, items: updated};
    }));
  };

  // Category CRUD
  const handleCreateCat = (cat) => {
    setCategories(p => [...p, cat]);
    setShowCreateCat(false);
    addLog('add', `Created category: ${cat.name}`);
    toast.success(`Category "${cat.name}" created`);
  };

  const handleEditCat = (cat) => {
    setCategories(p => p.map(c => c.id===cat.id ? cat : c));
    setShowEditCat(null);
    addLog('edit', `Edited category: ${cat.name}`);
    toast.success('Category updated');
  };

  const handleDeleteCat = (catId) => {
    const cat = categories.find(c=>c.id===catId);
    if (!confirm(`Delete "${cat?.name}" and all ${cat?.items.length} items?`)) return;
    setCategories(p => p.filter(c => c.id!==catId));
    if (activeCat === catId) setActiveCat(null);
    addLog('delete', `Deleted category: ${cat?.name} (${cat?.items.length} items)`);
    toast.success('Category deleted');
  };

  // Item CRUD
  const handleSaveItem = (item) => {
    if (!activeCat) return;
    setCategories(prev => prev.map(c => {
      if (c.id !== activeCat) return c;
      const exists = c.items.find(i => i.id === item.id);
      if (exists) {
        return {...c, items: c.items.map(i => i.id===item.id ? item : i)};
      }
      return {...c, items: [item, ...c.items]};
    }));
    setShowAddItem(null);
    setShowEditItem(null);
    const isNew = !showEditItem;
    addLog(isNew?'add':'edit', `${isNew?'Added':'Edited'} item in ${activeCatData?.name}: ${item.email.substring(0,25)}`);
    toast.success(isNew ? 'Item added' : 'Item updated');
  };

  const handleDeleteItem = (itemId) => {
    if (!activeCat || !confirm('Delete this item?')) return;
    setCategories(prev => prev.map(c => c.id!==activeCat ? c : {...c, items: c.items.filter(i=>i.id!==itemId)}));
    addLog('delete', `Deleted item from ${activeCatData?.name}`);
    toast.success('Item deleted');
  };

  const handleBulkImport = (items) => {
    if (!activeCat) return;
    setCategories(prev => prev.map(c => c.id!==activeCat ? c : {...c, items: [...items, ...c.items]}));
    setShowBulkImport(null);
    addLog('import', `Imported ${items.length} items to ${activeCatData?.name}`);
    toast.success(`${items.length} items imported`);
  };

  const toggleReveal = (id) => setRevealedIds(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  // ─── RENDER: Category Detail View ───
  if (activeCat && activeCatData) {
    const stats = getCatStats(activeCatData);
    return (
      <div className="ap-page">
        {/* Header */}
        <div className="ap-header">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button onClick={()=>setActiveCat(null)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--color-text-muted)',fontSize:'1.2rem'}}>←</button>
            <div>
              <h1 className="ap-title" style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:'1.3rem'}}>{activeCatData.icon}</span> {activeCatData.name}
              </h1>
              <p className="ap-subtitle">
                <span style={{color:activeCatData.type==='accounts'?'#818CF8':'#F59E0B',fontWeight:600}}>{activeCatData.type}</span>
                {activeCatData.linkedProduct && <> · Linked: <span style={{color:'var(--color-primary)'}}>{activeCatData.linkedProduct}</span></>}
              </p>
            </div>
          </div>
          <div className="ap-header-actions">
            <button className="btn btn-ghost" onClick={()=>setShowEditCat(activeCatData)}>
              <EditIcon/> Edit
            </button>
            <button className="btn btn-ghost" onClick={()=>setShowBulkImport(activeCat)}>
              <WithdrawIcon/> Bulk Import
            </button>
            <button className="btn btn-primary" onClick={()=>setShowAddItem(activeCat)}>+ Add Item</button>
          </div>
        </div>

        {/* Search + Stats Bar */}
        <div style={{display:'flex',gap:14,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
          <div className="ap-search-box" style={{flex:1,minWidth:200}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Search by data..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {Object.entries(statusColors).map(([k,c])=>(
            <span key={k} style={{display:'flex',alignItems:'center',gap:4,fontSize:'.78rem',fontWeight:600}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:c}}/> {statusLabels[k]?.[0]}: {activeCatData.items.filter(i=>i.status===k).length}
            </span>
          ))}
        </div>

        {/* Items List */}
        <div className="inv-items-section">
          <div className="inv-items-header">
            <div className="inv-items-title">{stats.total} Items</div>
            <div className="inv-items-toolbar">
              <span style={{fontSize:'.78rem',color:'var(--color-text-muted)'}}>Cost: ${stats.totalCost.toFixed(2)}</span>
            </div>
          </div>
          {filteredItems.length === 0 && (
            <div className="ap-empty" style={{padding:'40px 0'}}><span>📦</span><p>No items found</p></div>
          )}
          {filteredItems.map(item => {
            const revealed = revealedIds.has(item.id);
            const exp = daysUntil(item.expiresAt);
            return (
              <div key={item.id} className={`inv-item-row ${item.status==='used'?'used':''}`}>
                <div className="inv-item-top">
                  <span className="inv-item-status" style={{background:`${statusColors[item.status]}20`,color:statusColors[item.status]}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:statusColors[item.status]}}/>
                    {statusLabels[item.status]?.[0]||item.status}
                  </span>
                  <div style={{display:'flex',gap:4}}>
                    <button className="inv-field-btn" onClick={()=>{const d=item.email+(item.password?':'+item.password:'')+(item.twoFA?'|'+item.twoFA:'');navigator.clipboard.writeText(d);toast.success('All data copied!')}} title="Copy all"><CopyIcon/></button>
                    <button className="inv-field-btn" onClick={()=>setShowEditItem(item)} title="Edit"><EditIcon/></button>
                    <button className="inv-field-btn" onClick={()=>handleDeleteItem(item.id)} title="Delete" style={{color:'#EF4444'}}><TrashIcon/></button>
                  </div>
                </div>
                <div className="inv-item-fields">
                  <div className="inv-field-row">
                    <span className="inv-field-label">{activeCatData.type==='codes'?'Code':'Email'}</span>
                    <span className="inv-field-value">{revealed ? item.email : item.email.substring(0,4)+'••••••'}</span>
                    <div className="inv-field-actions">
                      <button className="inv-field-btn" onClick={()=>toggleReveal(item.id)}><EyeIcon open={revealed}/></button>
                      <button className="inv-field-btn" onClick={()=>{navigator.clipboard.writeText(item.email);toast.success('Copied!')}}><CopyIcon/></button>
                    </div>
                  </div>
                  {item.password && (
                    <div className="inv-field-row">
                      <span className="inv-field-label">Pass</span>
                      <span className="inv-field-value">{revealed ? item.password : '••••••••'}</span>
                      <div className="inv-field-actions">
                        <button className="inv-field-btn" onClick={()=>{navigator.clipboard.writeText(item.password);toast.success('Copied!')}}><CopyIcon/></button>
                      </div>
                    </div>
                  )}
                  {item.twoFA && (
                    <div className="inv-field-row">
                      <span className="inv-field-label">2FA</span>
                      <span className="inv-field-value twofa">{revealed ? item.twoFA : '••••••••••••'}</span>
                      <div className="inv-field-actions">
                        <button className="inv-field-btn" onClick={()=>{navigator.clipboard.writeText(item.twoFA);toast.success('2FA copied!')}}><CopyIcon/></button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="inv-item-meta">
                  <span className="inv-item-tag">💰 ${(item.costUSD||0).toFixed(2)}</span>
                  <span className="inv-item-tag">🔄 {item.usedCount||0}/{item.maxUses===9999?'∞':item.maxUses||1}</span>
                  <span className="inv-item-tag">📅 {timeAgo(item.addedAt)}</span>
                  {item.soldTo && <span className="inv-item-tag tag-custom">👤 {item.soldTo}</span>}
                  {exp !== null && exp <= 7 && exp >= 0 && <span className="inv-item-tag" style={{color:'#EF4444',borderColor:'rgba(239,68,68,.3)'}}>⏰ {exp}d left</span>}
                  {exp !== null && exp < 0 && <span className="inv-item-tag" style={{color:'#EF4444',borderColor:'rgba(239,68,68,.3)'}}>💀 Expired</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modals */}
        {showAddItem && <SingleItemModal category={activeCatData} onSave={handleSaveItem} onClose={()=>setShowAddItem(null)}/>}
        {showEditItem && <SingleItemModal category={activeCatData} item={showEditItem} onSave={handleSaveItem} onClose={()=>setShowEditItem(null)}/>}
        {showBulkImport && <BulkImportModal category={activeCatData} existingItems={activeCatData.items} onImport={handleBulkImport} onClose={()=>setShowBulkImport(null)}/>}
        {showEditCat && <EditCategoryModal category={showEditCat} onSave={handleEditCat} onClose={()=>setShowEditCat(null)}/>}
      </div>
    );
  }

  // ─── RENDER: Main Dashboard View ───
  const accountCats = categories.filter(c=>c.type==='accounts');
  const codeCats = categories.filter(c=>c.type==='codes');

  return (
    <div className="ap-page">
      {/* Stats Row */}
      <div className="inv-stats">
        {[
          {label:'Total Items',value:globalStats.total,color:'#6366F1',bg:'rgba(99,102,241,.12)',icon:'📦'},
          {label:'Available',value:globalStats.available,color:'#10B981',bg:'rgba(16,185,129,.12)',icon:'✅'},
          {label:'Used / Sold',value:globalStats.used,color:'#F59E0B',bg:'rgba(245,158,11,.12)',icon:'🔄'},
          {label:'Stock Cost',value:`$${globalStats.totalCost.toFixed(0)}`,color:'#EF4444',bg:'rgba(239,68,68,.12)',icon:'💰'},
        ].map((s,i)=>(
          <div key={i} className="inv-stat-card">
            <div className="inv-stat-icon" style={{background:s.bg}}><span style={{fontSize:'1.2rem'}}>{s.icon}</span></div>
            <div className="inv-stat-info">
              <div className="inv-stat-label">{s.label}</div>
              <div className="inv-stat-value" style={{color:s.color}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Withdraw */}
      <QuickWithdrawPanel categories={categories} onWithdraw={handleWithdraw}/>

      {/* Quick Links */}
      <QuickLinksPanel links={links} onAdd={l=>setLinks(p=>[...p,l])} onRemove={i=>setLinks(p=>p.filter((_,j)=>j!==i))}/>

      {/* Category Cards */}
      <div className="inv-cats-header">
        <div className="inv-cats-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          Inventory Categories
          <span style={{fontSize:'.78rem',color:'var(--color-text-muted)',fontWeight:400}}>{categories.length} categories</span>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowCreateCat(true)}>+ Create New</button>
      </div>

      {/* Accounts Section */}
      {accountCats.length > 0 && (
        <>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <span style={{fontSize:'.82rem',fontWeight:700,color:'#818CF8'}}>👤 Accounts</span>
            <span style={{fontSize:'.72rem',color:'var(--color-text-muted)',background:'rgba(99,102,241,.1)',padding:'2px 10px',borderRadius:20,fontWeight:600}}>{accountCats.reduce((s,c)=>s+c.items.length,0)}</span>
          </div>
          <div className="inv-cats-grid">
            {accountCats.map(cat => <CategoryCard key={cat.id} cat={cat} onOpen={()=>setActiveCat(cat.id)} onEdit={()=>setShowEditCat(cat)} onDelete={()=>handleDeleteCat(cat.id)} onWithdraw={()=>handleWithdraw(cat.id)}/>)}
          </div>
        </>
      )}

      {/* Codes Section */}
      {codeCats.length > 0 && (
        <>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,marginTop:6}}>
            <span style={{fontSize:'.82rem',fontWeight:700,color:'#F59E0B'}}>🔑 Codes / Keys</span>
            <span style={{fontSize:'.72rem',color:'var(--color-text-muted)',background:'rgba(245,158,11,.1)',padding:'2px 10px',borderRadius:20,fontWeight:600}}>{codeCats.reduce((s,c)=>s+c.items.length,0)}</span>
          </div>
          <div className="inv-cats-grid">
            {codeCats.map(cat => <CategoryCard key={cat.id} cat={cat} onOpen={()=>setActiveCat(cat.id)} onEdit={()=>setShowEditCat(cat)} onDelete={()=>handleDeleteCat(cat.id)} onWithdraw={()=>handleWithdraw(cat.id)}/>)}
          </div>
        </>
      )}

      {/* Activity Log */}
      <ActivityLogPanel logs={logs}/>

      {/* Analytics */}
      <AnalyticsPanel categories={categories}/>

      {/* Create Category Modal */}
      {showCreateCat && <CreateCategoryModal onSave={handleCreateCat} onClose={()=>setShowCreateCat(false)}/>}
      {showEditCat && <EditCategoryModal category={showEditCat} onSave={handleEditCat} onClose={()=>setShowEditCat(null)}/>}
    </div>
  );
}

/* ═══ Category Card Component ═══ */
function CategoryCard({ cat, onOpen, onEdit, onDelete, onWithdraw }) {
  const stats = getCatStats(cat);
  const pct = stats.total > 0 ? (stats.available / stats.total) * 100 : 0;
  const isLow = stats.total > 0 && stats.available <= 2 && stats.available > 0;
  const isEmpty = stats.available === 0;

  return (
    <div className={`inv-cat-card ${isLow?'low-stock':''}`} onClick={onOpen}>
      <div className="inv-cat-top">
        <div className="inv-cat-name"><span style={{fontSize:'1.1rem'}}>{cat.icon}</span> {cat.name}</div>
        <span className="inv-cat-type" style={cat.type==='codes'?{background:'rgba(245,158,11,.15)',color:'#F59E0B'}:{}}>{cat.type}</span>
      </div>
      <div className="inv-cat-stats">
        <div className="inv-cat-stat">
          <div className="inv-cat-stat-val" style={{color:isEmpty?'#EF4444':'#10B981'}}>{stats.available}</div>
          <div className="inv-cat-stat-label">Available</div>
        </div>
        <div className="inv-cat-stat">
          <div className="inv-cat-stat-val">{stats.total}</div>
          <div className="inv-cat-stat-label">Total</div>
        </div>
      </div>
      <div className="inv-cat-progress">
        <div className={`inv-cat-progress-bar ${pct<20?'low':pct<50?'medium':''}`} style={{width:`${pct}%`}}/>
      </div>
      {cat.linkedProduct && (
        <div className="inv-cat-link">Linked: <span>{cat.linkedProduct}</span> 🔗</div>
      )}
      {isLow && <div className="inv-low-alert">⚠ Low stock — {stats.available} remaining</div>}
      {isEmpty && stats.total > 0 && <div className="inv-low-alert">🚫 Out of stock!</div>}
      <div className="inv-cat-actions" onClick={e=>e.stopPropagation()}>
        <button className="inv-cat-action danger" onClick={onDelete}><TrashIcon/></button>
        <button className="inv-cat-action" onClick={onEdit}><EditIcon/></button>
        <button className="inv-cat-action withdraw" onClick={onWithdraw}><WithdrawIcon/> Withdraw</button>
        <button className="inv-cat-action" onClick={onOpen} style={{flex:2,color:'var(--color-primary)',fontWeight:700}}>Open 👤</button>
      </div>
    </div>
  );
}
