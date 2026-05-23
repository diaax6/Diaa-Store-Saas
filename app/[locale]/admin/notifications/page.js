'use client';

import { useState } from 'react';

const demoNotifications = [
  { id:'1', type:'order', title:'New Order #ORD-008', message:'Fatma Nour ordered ChatGPT Plus ($12)', time:'2 min ago', read:false },
  { id:'2', type:'stock', title:'Low Stock Alert', message:'Netflix Premium has only 3 items left', time:'15 min ago', read:false },
  { id:'3', type:'payment', title:'Payment Received', message:'$25 received from Sara Ali for Adobe CC', time:'30 min ago', read:true },
  { id:'4', type:'customer', title:'New Customer', message:'Youssef Tarek just registered', time:'1 hour ago', read:true },
  { id:'5', type:'order', title:'Order Completed', message:'Order #ORD-005 delivered to Youssef Tarek', time:'3 hours ago', read:true },
  { id:'6', type:'system', title:'Plan Usage Warning', message:'You\'ve used 80% of your monthly order limit', time:'5 hours ago', read:true },
  { id:'7', type:'stock', title:'Out of Stock', message:'Canva Pro is now out of stock!', time:'1 day ago', read:true },
  { id:'8', type:'payment', title:'Refund Processed', message:'$7 refunded to Khaled Mostafa for YouTube Premium', time:'2 days ago', read:true },
];

const typeIcons = {
  order: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  stock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
  payment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  customer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  system: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState('all');

  const unread = notifications.filter(n=>!n.read).length;
  const filtered = filter==='all'?notifications:filter==='unread'?notifications.filter(n=>!n.read):notifications.filter(n=>n.type===filter);

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id===id ? {...n, read:true} : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({...n, read:true})));

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Notifications
          </h1>
          <p className="ap-subtitle">{unread} unread · {notifications.length} total</p>
        </div>
        {unread>0&&<div className="ap-header-actions"><button className="btn btn-ghost" onClick={markAllRead}>Mark all as read</button></div>}
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {[['all','All'],['unread',`Unread (${unread})`],['order','Orders'],['stock','Stock'],['payment','Payments'],['system','System']].map(([k,l])=>(
            <button key={k} className={`ap-filter-tab ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:1}}>
        {filtered.map(n=>(
          <div key={n.id} onClick={()=>markRead(n.id)} style={{
            display:'flex',alignItems:'center',gap:14,padding:'14px 20px',cursor:'pointer',
            background:n.read?'var(--color-surface)':'rgba(230,126,34,0.04)',
            borderBottom:'1px solid var(--color-border)',borderLeft:n.read?'3px solid transparent':'3px solid var(--color-primary)',
            transition:'0.15s',
          }}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'var(--color-bg-tertiary)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{typeIcons[n.type]}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:n.read?500:700,fontSize:'0.9rem',marginBottom:2}}>{n.title}</div>
              <div style={{fontSize:'0.82rem',color:'var(--color-text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.message}</div>
            </div>
            <div style={{fontSize:'0.75rem',color:'var(--color-text-muted)',whiteSpace:'nowrap',flexShrink:0}}>{n.time}</div>
            {!n.read&&<div style={{width:8,height:8,borderRadius:'50%',background:'var(--color-primary)',flexShrink:0}}></div>}
          </div>
        ))}
        {filtered.length===0&&<div className="ap-empty" style={{padding:40}}><p>No notifications</p></div>}
      </div>
    </div>
  );
}
