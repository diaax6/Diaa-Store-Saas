'use client';
import { useState, useEffect, useRef } from 'react';

const allRoutes = [
  {name:'Dashboard',path:'/admin',icon:'home',section:'Pages'},
  {name:'Products',path:'/admin/products',icon:'box',section:'Pages'},
  {name:'Categories',path:'/admin/categories',icon:'folder',section:'Pages'},
  {name:'Inventory',path:'/admin/inventory',icon:'layers',section:'Pages'},
  {name:'Orders',path:'/admin/orders',icon:'cart',section:'Pages'},
  {name:'Customers',path:'/admin/customers',icon:'users',section:'Pages'},
  {name:'Finance',path:'/admin/finance',icon:'dollar',section:'Pages'},
  {name:'Coupons',path:'/admin/coupons',icon:'tag',section:'Pages'},
  {name:'Notifications',path:'/admin/notifications',icon:'bell',section:'Pages'},
  {name:'Appearance',path:'/admin/appearance',icon:'palette',section:'Settings'},
  {name:'Site Content',path:'/admin/site-content',icon:'edit',section:'Settings'},
  {name:'Settings',path:'/admin/settings',icon:'settings',section:'Settings'},
  {name:'Integrations',path:'/admin/integrations',icon:'code',section:'Settings'},
  {name:'Staff',path:'/admin/staff',icon:'user',section:'Settings'},
  {name:'Audit Log',path:'/admin/audit-log',icon:'file',section:'Settings'},
  {name:'View Store',path:'/',icon:'home',section:'Actions'},
];

export default function CommandPalette({ locale }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? allRoutes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : allRoutes;

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s+1, filtered.length-1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s-1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) {
      window.location.href = `/${locale}${filtered[selected].path}`;
      setOpen(false);
    }
  };

  if (!open) return null;

  const grouped = {};
  filtered.forEach(r => { if (!grouped[r.section]) grouped[r.section] = []; grouped[r.section].push(r); });
  let flatIdx = 0;

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:100}} onClick={()=>setOpen(false)}>
      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',backdropFilter:'blur(4px)'}}/>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--color-bg-secondary)',border:'1px solid var(--color-border)',borderRadius:16,width:'100%',maxWidth:560,maxHeight:'70vh',display:'flex',flexDirection:'column',boxShadow:'0 25px 60px rgba(0,0,0,.4)',animation:'modalIn 150ms ease',position:'relative',overflow:'hidden'}}>
        {/* Search Input */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid var(--color-border)'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Search pages, settings, actions..."
            style={{flex:1,border:'none',background:'none',color:'var(--color-text)',fontSize:'.95rem',outline:'none'}}/>
          <kbd style={{fontSize:'.65rem',padding:'2px 6px',borderRadius:4,border:'1px solid var(--color-border)',color:'var(--color-text-muted)',background:'var(--color-bg-tertiary)'}}>ESC</kbd>
        </div>
        {/* Results */}
        <div style={{overflowY:'auto',flex:1,padding:'8px'}}>
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              <div style={{fontSize:'.68rem',fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.08em',padding:'8px 12px'}}>{section}</div>
              {items.map(item => {
                const idx = flatIdx++;
                return (
                  <a key={item.path} href={`/${locale}${item.path}`}
                    style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:8,textDecoration:'none',color:'var(--color-text)',background:selected===idx?'var(--color-bg-tertiary)':'transparent',transition:'background .1s',cursor:'pointer'}}
                    onMouseEnter={()=>setSelected(idx)}>
                    <div style={{width:32,height:32,borderRadius:8,background:'var(--color-bg-tertiary)',border:'1px solid var(--color-border)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={selected===idx?'var(--color-primary)':'var(--color-text-muted)'} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
                    </div>
                    <span style={{fontWeight:selected===idx?700:500,fontSize:'.88rem',color:selected===idx?'var(--color-primary)':'var(--color-text)'}}>{item.name}</span>
                    {selected===idx && <span style={{marginLeft:'auto',fontSize:'.68rem',color:'var(--color-text-muted)'}}>Enter ↵</span>}
                  </a>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{textAlign:'center',padding:'30px 0',color:'var(--color-text-muted)',fontSize:'.88rem'}}>No results for "{query}"</div>
          )}
        </div>
        {/* Footer hint */}
        <div style={{padding:'8px 16px',borderTop:'1px solid var(--color-border)',display:'flex',gap:16,fontSize:'.72rem',color:'var(--color-text-muted)'}}>
          <span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
