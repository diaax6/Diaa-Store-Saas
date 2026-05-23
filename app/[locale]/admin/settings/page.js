'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    storeName: 'Diaa Store',
    storeDesc: 'Premium Digital Products',
    currency: 'USD',
    locale: 'en',
    timezone: 'Africa/Cairo',
    autoDelivery: true,
    guestCheckout: true,
    emailNotifications: true,
    mainDomain: 'diaa.store',
    secondaryDomain: 'diaastore.cloud',
    metaTitle: 'Diaa Store — Premium Digital Products',
    metaDesc: 'Get the best prices on ChatGPT, Adobe, Netflix, Spotify and more.',
  });

  const update = (key, value) => setSettings(prev => ({...prev, [key]: value}));

  const handleSave = () => toast.success('Settings saved successfully!');

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </h1>
          <p className="ap-subtitle">General store configuration</p>
        </div>
        <div className="ap-header-actions"><button className="btn btn-primary" onClick={handleSave}>Save Settings</button></div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        {/* General */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:16}}>🏪 General</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group"><label className="form-label">Store Name</label><input className="form-input" value={settings.storeName} onChange={e=>update('storeName',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={settings.storeDesc} onChange={e=>update('storeDesc',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Currency</label>
              <select className="form-input" value={settings.currency} onChange={e=>update('currency',e.target.value)}>
                <option value="USD">USD ($)</option><option value="EGP">EGP (E£)</option><option value="EUR">EUR (€)</option><option value="SAR">SAR (ر.س)</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Default Language</label>
              <select className="form-input" value={settings.locale} onChange={e=>update('locale',e.target.value)}>
                <option value="en">English</option><option value="ar">العربية</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Timezone</label>
              <select className="form-input" value={settings.timezone} onChange={e=>update('timezone',e.target.value)}>
                <option value="Africa/Cairo">Africa/Cairo (UTC+2)</option><option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option><option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commerce */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:16}}>🛒 Commerce</h3>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {[
              {key:'autoDelivery',label:'Auto Delivery',desc:'Automatically deliver inventory after payment confirmation'},
              {key:'guestCheckout',label:'Guest Checkout',desc:'Allow purchases without creating an account'},
              {key:'emailNotifications',label:'Email Notifications',desc:'Send order confirmations and updates via email'},
            ].map(item=>(
              <div key={item.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--color-border)'}}>
                <div><div style={{fontWeight:600,fontSize:'0.9rem'}}>{item.label}</div><div style={{fontSize:'0.78rem',color:'var(--color-text-muted)'}}>{item.desc}</div></div>
                <label className="toggle"><input type="checkbox" checked={settings[item.key]} onChange={e=>update(item.key,e.target.checked)}/><span className="toggle-slider"></span></label>
              </div>
            ))}
          </div>
        </div>

        {/* Domains */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:16}}>🌐 Domains</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group"><label className="form-label">Primary Domain</label><input className="form-input" value={settings.mainDomain} onChange={e=>update('mainDomain',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Secondary Domain</label><input className="form-input" value={settings.secondaryDomain} onChange={e=>update('secondaryDomain',e.target.value)}/></div>
          </div>
        </div>

        {/* SEO */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:16}}>🔍 SEO</h3>
          <div className="form-group"><label className="form-label">Meta Title</label><input className="form-input" value={settings.metaTitle} onChange={e=>update('metaTitle',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-textarea" value={settings.metaDesc} onChange={e=>update('metaDesc',e.target.value)} rows={3}/></div>
        </div>
      </div>
    </div>
  );
}
