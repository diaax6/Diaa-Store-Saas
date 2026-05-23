'use client';
import { useState } from 'react';
import { statusColors, getCatStats, timeAgo } from './inventoryData';

/* ═══ Quick Withdraw Panel ═══ */
export function QuickWithdrawPanel({ categories, onWithdraw }) {
  return (
    <div style={{background:'linear-gradient(135deg,#0F766E,#14B8A6)',borderRadius:14,padding:'18px 22px',marginBottom:20}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        <span style={{color:'#fff',fontWeight:700,fontSize:'.95rem'}}>Quick Withdraw</span>
        <span style={{color:'rgba(255,255,255,.7)',fontSize:'.78rem',marginLeft:'auto'}}>Click any category to withdraw next available</span>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {categories.map(cat => {
          const s = getCatStats(cat);
          return (
            <button key={cat.id} onClick={()=>onWithdraw(cat.id)}
              style={{padding:'8px 16px',borderRadius:20,border:'1px solid rgba(255,255,255,.25)',background:s.available>0?'rgba(255,255,255,.15)':'rgba(255,255,255,.05)',color:s.available>0?'#fff':'rgba(255,255,255,.4)',fontSize:'.8rem',fontWeight:600,cursor:s.available>0?'pointer':'not-allowed',display:'flex',alignItems:'center',gap:6,transition:'all .2s'}}>
              {s.available>0 && <span style={{background:'#10B981',color:'#fff',borderRadius:10,padding:'1px 7px',fontSize:'.7rem',fontWeight:700}}>{s.available}</span>}
              {cat.icon} {cat.name}
              <span style={{fontSize:'.75rem'}}>{cat.type==='accounts'?'👤':'🔑'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ Activity Log Panel ═══ */
export function ActivityLogPanel({ logs }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? logs : logs.slice(0, 6);
  const iconMap = { add: {bg:'rgba(16,185,129,.15)',color:'#10B981',icon:'+'}, withdraw: {bg:'rgba(99,102,241,.15)',color:'#818CF8',icon:'↓'}, delete: {bg:'rgba(239,68,68,.15)',color:'#EF4444',icon:'×'}, edit: {bg:'rgba(245,158,11,.15)',color:'#F59E0B',icon:'✎'}, import: {bg:'rgba(34,211,238,.15)',color:'#22D3EE',icon:'⬇'} };

  return (
    <div className="inv-activity">
      <div className="inv-activity-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Activity Log
        <span style={{marginLeft:'auto',fontSize:'.72rem',color:'var(--color-text-muted)',background:'var(--color-bg-tertiary)',padding:'3px 10px',borderRadius:20,fontWeight:700}}>{logs.length}</span>
      </div>
      <div className="inv-activity-list">
        {shown.map((log, i) => {
          const style = iconMap[log.type] || iconMap.edit;
          return (
            <div key={i} className="inv-activity-item">
              <div className="inv-activity-icon" style={{background:style.bg,color:style.color,fontSize:'.85rem',fontWeight:700}}>{style.icon}</div>
              <div className="inv-activity-text">{log.text}</div>
              <div className="inv-activity-time">{timeAgo(log.time)}</div>
            </div>
          );
        })}
      </div>
      {logs.length > 6 && (
        <button onClick={()=>setExpanded(!expanded)} style={{marginTop:8,background:'none',border:'none',color:'var(--color-primary)',fontSize:'.78rem',fontWeight:600,cursor:'pointer'}}>
          {expanded ? '← Show less' : `Show all ${logs.length} →`}
        </button>
      )}
    </div>
  );
}

/* ═══ Analytics Chart ═══ */
export function AnalyticsPanel({ categories }) {
  const data = categories.map(c => ({ name: c.name.length>15?c.name.slice(0,15)+'…':c.name, ...getCatStats(c) }));
  const maxVal = Math.max(...data.map(d=>d.total), 1);

  return (
    <div className="inv-analytics">
      <div className="inv-analytics-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
        Stock Analytics
      </div>
      <div className="inv-chart-bars">
        {data.map((d, i) => (
          <div key={i} className="inv-chart-bar" style={{height:`${(d.total/maxVal)*100}%`,background:`linear-gradient(180deg, ${d.available>0?'#10B981':'#EF4444'}, ${d.available>0?'rgba(16,185,129,.3)':'rgba(239,68,68,.3)'})`}}>
            <div className="tooltip">{d.name}: {d.available}/{d.total} available</div>
          </div>
        ))}
      </div>
      <div className="inv-chart-labels">
        {data.map((d,i) => <div key={i} className="inv-chart-label">{d.name}</div>)}
      </div>
      <div className="inv-chart-legend">
        <div className="inv-chart-legend-item"><div className="inv-chart-legend-dot" style={{background:'#10B981'}}/> Available</div>
        <div className="inv-chart-legend-item"><div className="inv-chart-legend-dot" style={{background:'#6366F1'}}/> Used</div>
        <div className="inv-chart-legend-item"><div className="inv-chart-legend-dot" style={{background:'#EF4444'}}/> Out of Stock</div>
      </div>
    </div>
  );
}

/* ═══ Quick Links Panel ═══ */
export function QuickLinksPanel({ links, onAdd, onRemove }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{background:'var(--color-bg-secondary)',border:'1px solid var(--color-border)',borderRadius:14,padding:18,marginBottom:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:collapsed?0:14}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span style={{fontWeight:700,fontSize:'.9rem'}}>Quick Links</span>
          <span style={{fontSize:'.7rem',color:'var(--color-text-muted)'}}>{links.length} saved</span>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={()=>setCollapsed(!collapsed)} style={{background:'none',border:'none',color:'var(--color-text-muted)',cursor:'pointer',fontSize:'.8rem'}}>{collapsed?'▼':'▲'}</button>
          <button onClick={()=>setShowAdd(!showAdd)} style={{background:'none',border:'none',color:'var(--color-primary)',cursor:'pointer',fontSize:'1rem',fontWeight:700}}>+</button>
        </div>
      </div>
      {!collapsed && (
        <>
          {showAdd && (
            <div style={{display:'flex',gap:8,marginBottom:10}}>
              <input className="form-input" placeholder="Name" value={newName} onChange={e=>setNewName(e.target.value)} style={{flex:1,fontSize:'.82rem'}}/>
              <input className="form-input" placeholder="URL" value={newUrl} onChange={e=>setNewUrl(e.target.value)} style={{flex:2,fontSize:'.82rem'}}/>
              <button className="btn btn-primary" style={{padding:'6px 14px',fontSize:'.78rem'}} onClick={()=>{if(newName&&newUrl){onAdd({name:newName,url:newUrl});setNewName('');setNewUrl('');setShowAdd(false)}}}>Add</button>
            </div>
          )}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8}}>
            {links.map((l,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'var(--color-bg-tertiary)',border:'1px solid var(--color-border)',borderRadius:10}}>
                <span style={{fontSize:'.85rem'}}>🌐</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:'.82rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.name}</div>
                  <div style={{fontSize:'.7rem',color:'var(--color-text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>/{l.url}</div>
                </div>
                <div style={{display:'flex',gap:2}}>
                  <button onClick={()=>window.open(l.url.startsWith('http')?l.url:'https://'+l.url,'_blank')} style={{background:'none',border:'none',cursor:'pointer',color:'var(--color-text-muted)',padding:2,fontSize:'.75rem'}}>↗</button>
                  <button onClick={()=>{navigator.clipboard.writeText(l.url)}} style={{background:'none',border:'none',cursor:'pointer',color:'var(--color-text-muted)',padding:2,fontSize:'.75rem'}}>📋</button>
                  <button onClick={()=>onRemove(i)} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',padding:2,fontSize:'.75rem'}}>×</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
