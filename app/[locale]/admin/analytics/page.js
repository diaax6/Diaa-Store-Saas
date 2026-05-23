'use client';
import { useState } from 'react';
import '../products/products-admin.css';

const revenueData = [
  { day:'Mon', rev:420, orders:12 }, { day:'Tue', rev:580, orders:18 }, { day:'Wed', rev:510, orders:15 },
  { day:'Thu', rev:890, orders:28 }, { day:'Fri', rev:1020, orders:32 }, { day:'Sat', rev:760, orders:24 },
  { day:'Sun', rev:670, orders:20 },
];
const monthlyData = [
  { month:'Jan', rev:12400 }, { month:'Feb', rev:14200 }, { month:'Mar', rev:11800 },
  { month:'Apr', rev:16500 }, { month:'May', rev:19200 }, { month:'Jun', rev:18100 },
];
const topProducts = [
  { name:'ChatGPT Plus', sales:156, revenue:1872, growth:12 },
  { name:'Netflix Premium', sales:134, revenue:1340, growth:8 },
  { name:'Adobe CC', sales:89, revenue:2225, growth:-3 },
  { name:'Spotify Premium', sales:78, revenue:624, growth:15 },
  { name:'Gemini Advanced', sales:45, revenue:675, growth:22 },
];
const hourlyData = [0,2,1,0,1,3,8,15,22,28,35,42,38,45,48,52,44,38,55,62,48,35,18,8];
const channelData = [
  { name:'Direct', value:42, color:'#E67E22' },
  { name:'Telegram', value:28, color:'#0088CC' },
  { name:'Referral', value:18, color:'#10B981' },
  { name:'Social', value:12, color:'#E91E63' },
];

const maxRev = Math.max(...revenueData.map(d=>d.rev));
const maxMonthly = Math.max(...monthlyData.map(d=>d.rev));
const maxHour = Math.max(...hourlyData);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('week');

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Revenue Analytics
          </h1>
          <p className="ap-subtitle">Business insights and performance metrics</p>
        </div>
        <div style={{display:'flex',gap:6}}>
          {[['week','This Week'],['month','This Month'],['year','This Year']].map(([k,l])=>(
            <button key={k} className={`ap-filter-tab ${period===k?'active':''}`} onClick={()=>setPeriod(k)}>{l}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[
          { label:'Revenue',value:'$5,470',change:'+12.5%',positive:true,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,color:'#10B981' },
          { label:'Orders',value:'149',change:'+8.3%',positive:true,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,color:'#6366F1' },
          { label:'Avg Order Value',value:'$36.71',change:'+4.1%',positive:true,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,color:'#F59E0B' },
          { label:'Conversion Rate',value:'3.2%',change:'-0.4%',positive:false,icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,color:'#EF4444' },
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:'16px 18px',borderLeft:`3px solid ${s.color}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color}}>{s.icon}</div>
              <span style={{fontSize:'.72rem',fontWeight:700,padding:'3px 8px',borderRadius:20,background:s.positive?'rgba(16,185,129,.1)':'rgba(239,68,68,.1)',color:s.positive?'#10B981':'#EF4444'}}>{s.change}</span>
            </div>
            <div style={{fontSize:'.7rem',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>{s.label}</div>
            <div style={{fontSize:'1.5rem',fontWeight:800}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:24}}>
        {/* Revenue Chart */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h3 style={{fontWeight:700,fontSize:'.95rem',display:'flex',alignItems:'center',gap:6}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Revenue (Last 7 Days)
            </h3>
            <span style={{fontSize:'.82rem',fontWeight:700,color:'#10B981'}}>$5,470 total</span>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',gap:8,height:180}}>
            {revenueData.map((d,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <span style={{fontSize:'.68rem',fontWeight:700,color:'var(--color-text-muted)'}}>${d.rev}</span>
                <div style={{width:'100%',borderRadius:'8px 8px 4px 4px',background:`linear-gradient(180deg,var(--color-primary),#E74C3C)`,height:`${(d.rev/maxRev)*140}px`,transition:'height .3s',opacity:0.85,position:'relative'}}>
                  <div style={{position:'absolute',top:6,left:'50%',transform:'translateX(-50%)',fontSize:'.62rem',color:'#fff',fontWeight:700}}>{d.orders}</div>
                </div>
                <span style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Channels */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontWeight:700,fontSize:'.95rem',marginBottom:20}}>Sales Channels</h3>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {channelData.map((ch,i)=>(
              <div key={i}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:'.82rem',fontWeight:600}}>{ch.name}</span>
                  <span style={{fontSize:'.82rem',fontWeight:700,color:ch.color}}>{ch.value}%</span>
                </div>
                <div style={{height:8,borderRadius:4,background:'var(--color-bg-tertiary)'}}>
                  <div style={{height:'100%',borderRadius:4,background:ch.color,width:`${ch.value}%`,transition:'width .5s'}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:20,padding:12,borderRadius:10,background:'var(--color-bg-tertiary)'}}>
            <div style={{fontSize:'.72rem',color:'var(--color-text-muted)',marginBottom:4}}>Total Visitors</div>
            <div style={{fontSize:'1.3rem',fontWeight:800}}>4,658</div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Top Products */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontWeight:700,fontSize:'.95rem',marginBottom:16,display:'flex',alignItems:'center',gap:6}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Top Products
          </h3>
          {topProducts.map((p,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--color-border)'}}>
              <span style={{width:24,height:24,borderRadius:'50%',background:'var(--color-bg-tertiary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.72rem',fontWeight:800,color:'var(--color-text-muted)'}}>#{i+1}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:'.85rem'}}>{p.name}</div><div style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>{p.sales} sales</div></div>
              <div style={{textAlign:'right'}}><div style={{fontWeight:700,fontFamily:'monospace'}}>${p.revenue.toLocaleString()}</div><span style={{fontSize:'.68rem',fontWeight:700,color:p.growth>=0?'#10B981':'#EF4444'}}>{p.growth>=0?'+':''}{p.growth}%</span></div>
            </div>
          ))}
        </div>

        {/* Peak Hours Heatmap */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontWeight:700,fontSize:'.95rem',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Peak Sales Hours
          </h3>
          <p style={{fontSize:'.72rem',color:'var(--color-text-muted)',marginBottom:14}}>When your customers buy the most</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:3}}>
            {hourlyData.map((v,i)=>(
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                <div style={{width:'100%',height:50,borderRadius:4,background:`rgba(230,126,34,${Math.max(v/maxHour,0.08)})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.58rem',fontWeight:700,color:v/maxHour>0.5?'#fff':'var(--color-text-muted)'}}>{v}</div>
                <span style={{fontSize:'.55rem',color:'var(--color-text-muted)'}}>{String(i).padStart(2,'0')}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:12}}>
            <div><span style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>Peak: </span><span style={{fontSize:'.82rem',fontWeight:700,color:'var(--color-primary)'}}>7-9 PM</span></div>
            <div><span style={{fontSize:'.72rem',color:'var(--color-text-muted)'}}>Lowest: </span><span style={{fontSize:'.82rem',fontWeight:700}}>2-5 AM</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
