'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';

const integrations = [
  { id:'telegram', name:'Telegram Bot', desc:'Send order notifications and alerts to Telegram channels', icon:'📱', color:'#0088CC', fields:[{key:'bot_token',label:'Bot Token',type:'password',placeholder:'123456:ABC-DEF...'},{key:'channel_id',label:'Channel ID',type:'text',placeholder:'-1001234567890'}] },
  { id:'paymob', name:'PayMob', desc:'Accept online payments via cards and mobile wallets in Egypt', icon:'💳', color:'#10B981', fields:[{key:'secret_key',label:'Secret Key',type:'password',placeholder:'sk_...'},{key:'public_key',label:'Public Key',type:'text',placeholder:'pk_...'},{key:'hmac_secret',label:'HMAC Secret',type:'password',placeholder:'hmac_...'}] },
  { id:'smtp', name:'Email (SMTP)', desc:'Send transactional emails via your Mailcow server', icon:'📧', color:'#E67E22', fields:[{key:'host',label:'SMTP Host',type:'text',placeholder:'mail.diaa.store'},{key:'port',label:'Port',type:'text',placeholder:'587'},{key:'user',label:'Username',type:'text',placeholder:'noreply@diaa.store'},{key:'pass',label:'Password',type:'password',placeholder:'••••••••'}] },
  { id:'analytics', name:'Google Analytics', desc:'Track visitor behavior and store performance', icon:'📊', color:'#F59E0B', fields:[{key:'tracking_id',label:'Tracking ID',type:'text',placeholder:'G-XXXXXXXXXX'}] },
  { id:'cloudflare', name:'Cloudflare', desc:'CDN, DDoS protection, and custom domain management', icon:'☁️', color:'#F48120', fields:[{key:'api_token',label:'API Token',type:'password',placeholder:'your-api-token'},{key:'zone_id',label:'Zone ID',type:'text',placeholder:'zone-id'}] },
];

export default function AdminIntegrationsPage() {
  const [configs, setConfigs] = useState({});
  const [enabled, setEnabled] = useState({telegram:false, paymob:false, smtp:true, analytics:false, cloudflare:false});
  const [editing, setEditing] = useState(null);
  const toast = useToast();

  const toggleIntegration = (id) => {
    setEnabled(prev => ({...prev, [id]:!prev[id]}));
    toast.success(`${integrations.find(i=>i.id===id).name} ${!enabled[id]?'enabled':'disabled'}`);
  };

  const updateField = (integId, key, value) => {
    setConfigs(prev => ({...prev, [integId]:{...(prev[integId]||{}), [key]:value}}));
  };

  const saveConfig = (integId) => {
    toast.success(`${integrations.find(i=>i.id===integId).name} configuration saved`);
    setEditing(null);
  };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Integrations
          </h1>
          <p className="ap-subtitle">Connect external services to your store</p>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {integrations.map(integ=>(
          <div key={integ.id} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,overflow:'hidden',transition:'0.2s'}}>
            <div style={{display:'flex',alignItems:'center',gap:16,padding:'18px 20px'}}>
              <div style={{width:44,height:44,borderRadius:10,background:`${integ.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>{integ.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'0.95rem',marginBottom:2}}>{integ.name}</div>
                <div style={{fontSize:'0.82rem',color:'var(--color-text-muted)'}}>{integ.desc}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(editing===integ.id?null:integ.id)} style={{fontSize:'0.78rem'}}>
                  {editing===integ.id?'Close':'Configure'}
                </button>
                <label className="toggle"><input type="checkbox" checked={enabled[integ.id]||false} onChange={()=>toggleIntegration(integ.id)}/><span className="toggle-slider"></span></label>
              </div>
            </div>

            {editing===integ.id&&(
              <div style={{borderTop:'1px solid var(--color-border)',padding:'16px 20px',background:'var(--color-bg-secondary)'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {integ.fields.map(field=>(
                    <div key={field.key} className="form-group" style={{gridColumn:integ.fields.length===1?'span 2':'auto'}}>
                      <label className="form-label">{field.label}</label>
                      <input className="form-input" type={field.type} placeholder={field.placeholder} value={configs[integ.id]?.[field.key]||''} onChange={e=>updateField(integ.id,field.key,e.target.value)} />
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(null)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>saveConfig(integ.id)}>Save Configuration</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
