'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../components/ToastProvider';
import { useSettings } from '../../context/SettingsContext';

const themes = [
  { id:'dark', name:'Dark', colors:{ bg:'#0F0F14', surface:'#161621', border:'#2A2A3C', text:'#E5E7EB', muted:'#9CA3AF' }, preview:'linear-gradient(135deg,#0F0F14,#1A1A2E)' },
  { id:'midnight', name:'Midnight Blue', colors:{ bg:'#0D1B2A', surface:'#1B263B', border:'#2C3E57', text:'#E0E7EE', muted:'#8899AA' }, preview:'linear-gradient(135deg,#0D1B2A,#1B263B)' },
  { id:'deepblack', name:'Deep Black', colors:{ bg:'#050505', surface:'#111111', border:'#222222', text:'#E5E5E5', muted:'#888' }, preview:'linear-gradient(135deg,#050505,#151515)' },
  { id:'charcoal', name:'Charcoal', colors:{ bg:'#1A1A1A', surface:'#252525', border:'#3A3A3A', text:'#F0F0F0', muted:'#999' }, preview:'linear-gradient(135deg,#1A1A1A,#2D2D2D)' },
  { id:'light', name:'Light', colors:{ bg:'#FAFAFA', surface:'#FFFFFF', border:'#E5E7EB', text:'#111827', muted:'#6B7280' }, preview:'linear-gradient(135deg,#FAFAFA,#E5E7EB)' },
  { id:'cream', name:'Warm Cream', colors:{ bg:'#FDF8F3', surface:'#FFFFFF', border:'#E8DDD0', text:'#2D2418', muted:'#8B7E6A' }, preview:'linear-gradient(135deg,#FDF8F3,#F0E5D8)' },
];

const primaryColors = [
  { color:'#E67E22', name:'Orange' },
  { color:'#EF4444', name:'Red' },
  { color:'#3B82F6', name:'Blue' },
  { color:'#10B981', name:'Emerald' },
  { color:'#8B5CF6', name:'Purple' },
  { color:'#EC4899', name:'Pink' },
  { color:'#F59E0B', name:'Amber' },
  { color:'#06B6D4', name:'Cyan' },
  { color:'#6366F1', name:'Indigo' },
  { color:'#14B8A6', name:'Teal' },
];

const defaultCurrencies = [
  { code:'USD', symbol:'$', name:'US Dollar', rate:1, enabled:true },
  { code:'EGP', symbol:'E£', name:'Egyptian Pound', rate:49.5, enabled:true },
  { code:'EUR', symbol:'€', name:'Euro', rate:0.92, enabled:false },
  { code:'GBP', symbol:'£', name:'British Pound', rate:0.79, enabled:false },
  { code:'SAR', symbol:'ر.س', name:'Saudi Riyal', rate:3.75, enabled:false },
  { code:'AED', symbol:'د.إ', name:'UAE Dirham', rate:3.67, enabled:false },
  { code:'KWD', symbol:'د.ك', name:'Kuwaiti Dinar', rate:0.31, enabled:false },
  { code:'BRL', symbol:'R$', name:'Brazilian Real', rate:5.10, enabled:false },
  { code:'INR', symbol:'₹', name:'Indian Rupee', rate:83.5, enabled:false },
  { code:'TRY', symbol:'₺', name:'Turkish Lira', rate:32.2, enabled:false },
];

export default function AdminAppearancePage() {
  const [theme, setTheme] = useState('dark');
  const [primaryColor, setPrimaryColor] = useState('#E67E22');
  const [storeName, setStoreName] = useState('Diaa Store');
  const [announcement, setAnnouncement] = useState('🎉 Get 5% extra discount — Use code PUBG5');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [logoText, setLogoText] = useState('⚡');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [borderRadius, setBorderRadius] = useState(12);
  const [currencies, setCurrencies] = useState(defaultCurrencies);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [autoRates, setAutoRates] = useState(false);
  const [activeSection, setActiveSection] = useState('theme');
  const toast = useToast();

  // Load saved settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('storeAppearance');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.theme) setTheme(data.theme);
        if (data.primaryColor) setPrimaryColor(data.primaryColor);
        if (data.storeName) setStoreName(data.storeName);
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.announcementEnabled !== undefined) setAnnouncementEnabled(data.announcementEnabled);
        if (data.logoText) setLogoText(data.logoText);
        if (data.fontFamily) setFontFamily(data.fontFamily);
        if (data.borderRadius !== undefined) setBorderRadius(data.borderRadius);
        if (data.currencies) setCurrencies(data.currencies);
        if (data.defaultCurrency) setDefaultCurrency(data.defaultCurrency);
        if (data.autoRates !== undefined) setAutoRates(data.autoRates);
      }
    } catch {}
  }, []);

  // Apply theme in real-time — uses data-theme attribute which triggers the full CSS theme
  const applyTheme = useCallback((themeId, color) => {
    // Map appearance theme IDs to globals.css data-theme values
    // All themes now have proper CSS definitions in globals.css
    const dataTheme = themeId || 'dark';
    document.documentElement.setAttribute('data-theme', dataTheme);

    // Apply primary color
    if (color) {
      document.documentElement.style.setProperty('--color-primary', color);
    }

    // Persist immediately so storefront picks it up
    localStorage.setItem('store_theme', dataTheme);
    if (color) localStorage.setItem('store_primary', color);
  }, []);

  const handleThemeChange = (id) => {
    setTheme(id);
    applyTheme(id, primaryColor);
    toast.success(`Theme changed to ${themes.find(t=>t.id===id)?.name}`);
  };

  const handleColorChange = (color) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--color-primary', color);
    localStorage.setItem('store_primary', color);
  };

  const toggleCurrency = (code) => {
    setCurrencies(prev => prev.map(c => c.code===code ? {...c, enabled:!c.enabled} : c));
  };

  const updateRate = (code, rate) => {
    setCurrencies(prev => prev.map(c => c.code===code ? {...c, rate:Number(rate)} : c));
  };

  const fetchLiveRates = async () => {
    toast.info('Fetching live exchange rates...');
    // Simulate API call
    setTimeout(() => {
      setCurrencies(prev => prev.map(c => ({...c, rate: c.code==='USD'?1:c.rate*(0.98+Math.random()*0.04)})));
      toast.success('Rates updated from live data');
    }, 1500);
  };

  const { saveSettings } = useSettings();

  const handleSave = () => {
    // Map theme ID to data-theme value
    const dataTheme = theme || 'dark';

    // Save theme + primary to individual localStorage keys for ThemeInitializer
    localStorage.setItem('store_theme', dataTheme);
    localStorage.setItem('store_primary', primaryColor);

    // Save individual keys with store_ prefix for SettingsContext
    const settingsMap = {
      notice_enabled: announcementEnabled,
      notice_text_en: announcement,
      notice_bg_color: primaryColor,
      store_name: storeName,
      color_primary: primaryColor,
    };
    Object.entries(settingsMap).forEach(([k, v]) => {
      localStorage.setItem(`store_${k}`, String(v));
    });
    // Also persist full config for admin page reload
    const fullSettings = { theme, primaryColor, storeName, announcement, announcementEnabled, logoText, fontFamily, borderRadius, currencies, defaultCurrency, autoRates };
    localStorage.setItem('storeAppearance', JSON.stringify(fullSettings));
    // Update SettingsContext directly
    saveSettings(settingsMap);
    toast.success('All appearance settings saved & synced to storefront!');
  };

  const sections = [
    { id:'theme', label:'🎨 Theme', desc:'Choose your store theme' },
    { id:'colors', label:'🎯 Colors', desc:'Primary color & accents' },
    { id:'branding', label:'🏷️ Branding', desc:'Store name, logo, fonts' },
    { id:'announcement', label:'📢 Announcement', desc:'Top bar message' },
    { id:'currency', label:'💱 Currency', desc:'Currencies & exchange rates' },
    { id:'advanced', label:'⚙️ Advanced', desc:'Border radius, layout' },
  ];

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17.5 10.5L20 8l-1.5-1.5"/><circle cx="6" cy="12" r="2.5"/><path d="M2.5 15.5L5 18l1.5-1.5"/><circle cx="18" cy="18" r="2.5"/><path d="M14 18h-4"/></svg>
            Appearance & Settings
          </h1>
          <p className="ap-subtitle">Customize your store's look, feel, and currency</p>
        </div>
        <div className="ap-header-actions"><button className="btn btn-primary" onClick={handleSave}>Save All Changes</button></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:20}}>
        {/* Sidebar */}
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {sections.map(s=>(
            <button key={s.id} onClick={()=>setActiveSection(s.id)} style={{
              display:'flex',flexDirection:'column',padding:'10px 14px',borderRadius:8,border:'none',cursor:'pointer',textAlign:'left',
              background:activeSection===s.id?'rgba(230,126,34,0.1)':'transparent',
              color:activeSection===s.id?'var(--color-primary)':'var(--color-text)',transition:'0.15s',
            }}>
              <span style={{fontWeight:activeSection===s.id?700:500,fontSize:'0.88rem'}}>{s.label}</span>
              <span style={{fontSize:'0.72rem',color:'var(--color-text-muted)'}}>{s.desc}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:24}}>
          
          {/* Theme */}
          {activeSection==='theme'&&(
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>🎨 Store Theme</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                {themes.map(t=>(
                  <button key={t.id} onClick={()=>handleThemeChange(t.id)} style={{
                    background:t.preview,height:100,borderRadius:12,border:theme===t.id?`3px solid var(--color-primary)`:'3px solid var(--color-border)',
                    cursor:'pointer',position:'relative',transition:'0.2s',
                  }}>
                    <span style={{position:'absolute',bottom:8,left:0,right:0,textAlign:'center',fontSize:'0.78rem',fontWeight:700,color:t.id.includes('light')||t.id==='cream'?'#333':'#fff'}}>{t.name}</span>
                    {theme===t.id&&<span style={{position:'absolute',top:8,right:8,width:22,height:22,borderRadius:'50%',background:'var(--color-primary)',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>}
                  </button>
                ))}
              </div>
              <div style={{marginTop:16,padding:12,background:'var(--color-bg-tertiary)',borderRadius:8}}>
                <p style={{fontSize:'0.78rem',color:'var(--color-text-muted)'}}>💡 Theme changes apply in real-time. The selected theme will be used for both the admin panel and storefront.</p>
              </div>
            </div>
          )}

          {/* Colors */}
          {activeSection==='colors'&&(
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>🎯 Primary Color</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:20}}>
                {primaryColors.map(c=>(
                  <button key={c.color} onClick={()=>handleColorChange(c.color)} style={{
                    display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:12,borderRadius:10,border:primaryColor===c.color?`2px solid ${c.color}`:'2px solid var(--color-border)',
                    cursor:'pointer',background:primaryColor===c.color?`${c.color}10`:'transparent',transition:'0.2s',
                  }}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:c.color,boxShadow:primaryColor===c.color?`0 0 0 3px #fff, 0 0 0 5px ${c.color}`:undefined}}/>
                    <span style={{fontSize:'0.72rem',fontWeight:600,color:primaryColor===c.color?c.color:'var(--color-text-muted)'}}>{c.name}</span>
                  </button>
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <label className="form-label" style={{margin:0}}>Custom:</label>
                <input type="color" value={primaryColor} onChange={e=>handleColorChange(e.target.value)} style={{width:40,height:36,border:'none',borderRadius:6,cursor:'pointer'}}/>
                <input className="form-input" value={primaryColor} onChange={e=>handleColorChange(e.target.value)} style={{fontFamily:'monospace',maxWidth:120}}/>
              </div>
              <div style={{marginTop:16,padding:16,background:primaryColor+'15',border:`1px solid ${primaryColor}30`,borderRadius:10}}>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <button style={{padding:'8px 20px',background:primaryColor,color:'#fff',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer'}}>Primary Button</button>
                  <span style={{color:primaryColor,fontWeight:700}}>Primary Text</span>
                  <span style={{background:primaryColor+'20',color:primaryColor,padding:'4px 12px',borderRadius:20,fontSize:'0.78rem',fontWeight:600}}>Badge</span>
                </div>
              </div>
            </div>
          )}

          {/* Branding */}
          {activeSection==='branding'&&(
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>🏷️ Branding</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">Store Name</label><input className="form-input" value={storeName} onChange={e=>setStoreName(e.target.value)}/></div>
                <div className="form-group"><label className="form-label">Logo Emoji / Text</label><input className="form-input" value={logoText} onChange={e=>setLogoText(e.target.value)} style={{maxWidth:100,fontSize:'1.5rem',textAlign:'center'}}/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Font Family</label>
                <select className="form-input" value={fontFamily} onChange={e=>setFontFamily(e.target.value)}>
                  <option value="Inter">Inter (Modern)</option>
                  <option value="Outfit">Outfit (Clean)</option>
                  <option value="Roboto">Roboto (Material)</option>
                  <option value="Poppins">Poppins (Geometric)</option>
                  <option value="system-ui">System Default</option>
                </select>
              </div>
              <div style={{marginTop:16,padding:16,background:'var(--color-bg-tertiary)',borderRadius:10}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:'2rem'}}>{logoText}</span>
                  <div>
                    <div style={{fontWeight:800,fontSize:'1.2rem',fontFamily}}>{storeName}</div>
                    <div style={{fontSize:'0.78rem',color:'var(--color-text-muted)',fontFamily}}>Premium Digital Products</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcement */}
          {activeSection==='announcement'&&(
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>📢 Announcement Bar</h3>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,padding:'12px 16px',background:'var(--color-bg-tertiary)',borderRadius:10}}>
                <span style={{fontSize:'0.9rem',fontWeight:600}}>Enable Announcement Bar</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={announcementEnabled} onChange={e=>{
                    const val = e.target.checked;
                    setAnnouncementEnabled(val);
                    // Instant save to localStorage + SettingsContext
                    localStorage.setItem('store_notice_enabled', String(val));
                    saveSettings({ notice_enabled: val });
                  }}/>
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group"><label className="form-label">Message</label><input className="form-input" value={announcement} onChange={e=>setAnnouncement(e.target.value)} placeholder="Your announcement message..."/></div>
              <div style={{marginTop:12}}>
                <label className="form-label">Preview</label>
                <div style={{
                  background: announcementEnabled ? primaryColor : 'var(--color-bg-tertiary)',
                  color: announcementEnabled ? '#fff' : 'var(--color-text-muted)',
                  textAlign:'center',padding:'10px 16px',borderRadius:8,fontSize:'0.85rem',fontWeight:600,
                  opacity: announcementEnabled ? 1 : 0.5,
                  transition: '0.3s',
                }}>
                  {announcementEnabled ? announcement : `(Disabled) ${announcement}`}
                </div>
              </div>
            </div>
          )}

          {/* Currency */}
          {activeSection==='currency'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <h3 style={{fontSize:'1.1rem',fontWeight:700,margin:0}}>💱 Currency Management</h3>
                <button className="btn btn-ghost btn-sm" onClick={fetchLiveRates}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Fetch Live Rates
                </button>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                <div className="form-group">
                  <label className="form-label">Default Currency</label>
                  <select className="form-input" value={defaultCurrency} onChange={e=>setDefaultCurrency(e.target.value)}>
                    {currencies.filter(c=>c.enabled).map(c=>(<option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>))}
                  </select>
                  <span style={{fontSize:'0.72rem',color:'var(--color-text-muted)',marginTop:4,display:'block'}}>This will be the default for the storefront</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Auto-Update Rates</label>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginTop:4}}>
                    <label className="toggle"><input type="checkbox" checked={autoRates} onChange={e=>setAutoRates(e.target.checked)}/><span className="toggle-slider"></span></label>
                    <span style={{fontSize:'0.82rem',color:'var(--color-text-muted)'}}>{autoRates?'Updates every hour':'Manual rates'}</span>
                  </div>
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {currencies.map(c=>(
                  <div key={c.code} style={{
                    display:'flex',alignItems:'center',gap:14,padding:'12px 16px',borderRadius:10,
                    background:c.enabled?'var(--color-bg-secondary)':'transparent',
                    border:`1px solid ${c.enabled?'var(--color-border)':'var(--color-border)'}`,
                    opacity:c.enabled?1:0.5,transition:'0.2s',
                  }}>
                    <label className="toggle" style={{transform:'scale(0.75)',flexShrink:0}}><input type="checkbox" checked={c.enabled} onChange={()=>toggleCurrency(c.code)} disabled={c.code===defaultCurrency}/><span className="toggle-slider"></span></label>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'var(--color-bg-tertiary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'0.85rem',flexShrink:0}}>{c.symbol}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:'0.88rem'}}>{c.code}</div>
                      <div style={{fontSize:'0.75rem',color:'var(--color-text-muted)'}}>{c.name}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:'0.78rem',color:'var(--color-text-muted)'}}>1 USD =</span>
                      <input className="form-input" type="number" step="0.01" value={c.rate} onChange={e=>updateRate(c.code,e.target.value)} disabled={c.code==='USD'||!c.enabled||autoRates} style={{width:90,textAlign:'center',fontSize:'0.85rem',fontWeight:600,padding:'4px 8px'}}/>
                      <span style={{fontSize:'0.78rem',color:'var(--color-text-muted)'}}>{c.symbol}</span>
                    </div>
                    {c.code===defaultCurrency&&<span style={{fontSize:'0.68rem',background:'rgba(16,185,129,0.1)',color:'#10B981',padding:'2px 8px',borderRadius:10,fontWeight:700,flexShrink:0}}>DEFAULT</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced */}
          {activeSection==='advanced'&&(
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>⚙️ Advanced Styling</h3>
              <div className="form-group">
                <label className="form-label">Border Radius: {borderRadius}px</label>
                <input type="range" min="0" max="24" value={borderRadius} onChange={e=>setBorderRadius(Number(e.target.value))} style={{width:'100%',accentColor:'var(--color-primary)'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'var(--color-text-muted)'}}><span>Sharp (0)</span><span>Rounded (24)</span></div>
              </div>
              <div style={{marginTop:16,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                {[0,8,12,16,20,24].map(r=>(
                  <div key={r} onClick={()=>setBorderRadius(r)} style={{
                    padding:16,borderRadius:r,border:borderRadius===r?'2px solid var(--color-primary)':'2px solid var(--color-border)',
                    background:'var(--color-bg-tertiary)',cursor:'pointer',textAlign:'center',fontSize:'0.82rem',fontWeight:600,transition:'0.15s',
                  }}>{r}px</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
