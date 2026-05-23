'use client';
import { useState, useEffect } from 'react';

const demoAlerts = [
  { productName: 'Netflix Premium', currentStock: 3, severity: 'WARNING' },
  { productName: 'Canva Pro', currentStock: 0, severity: 'CRITICAL' },
];

export default function StockAlerts({ products }) {
  const [alerts, setAlerts] = useState(demoAlerts);
  const [dismissed, setDismissed] = useState([]);

  // In production, use checkAllStockLevels from autoDelivery.js
  const visibleAlerts = alerts.filter(a => !dismissed.includes(a.productName));

  if (visibleAlerts.length === 0) return null;

  return (
    <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:0,overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:'1px solid var(--color-border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span style={{fontWeight:700,fontSize:'.88rem'}}>Stock Alerts</span>
          <span style={{fontSize:'.72rem',background:'rgba(239,68,68,.12)',color:'#EF4444',padding:'2px 8px',borderRadius:10,fontWeight:700}}>{visibleAlerts.length}</span>
        </div>
      </div>
      <div style={{maxHeight:200,overflowY:'auto'}}>
        {visibleAlerts.map((a, i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 18px',borderBottom:'1px solid var(--color-border)',background:a.severity==='CRITICAL'?'rgba(239,68,68,.04)':'transparent'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:a.severity==='CRITICAL'?'#EF4444':'#F59E0B',flexShrink:0}}/>
            <div style={{flex:1}}>
              <span style={{fontWeight:600,fontSize:'.85rem'}}>{a.productName}</span>
              <span style={{marginLeft:8,fontSize:'.75rem',color:a.severity==='CRITICAL'?'#EF4444':'#F59E0B',fontWeight:700}}>
                {a.currentStock === 0 ? 'OUT OF STOCK' : `${a.currentStock} remaining`}
              </span>
            </div>
            <button onClick={()=>setDismissed(p=>[...p,a.productName])} style={{background:'none',border:'none',cursor:'pointer',color:'var(--color-text-muted)',padding:4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
