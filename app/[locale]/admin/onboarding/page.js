'use client';
import { useState } from 'react';
import '../products/products-admin.css';

const steps = [
  { id:1, title:'Store Setup', desc:'Set up your store name and branding' },
  { id:2, title:'Appearance', desc:'Choose your store theme' },
  { id:3, title:'First Category', desc:'Create your first product category' },
  { id:4, title:'First Product', desc:'Add your first product to sell' },
  { id:5, title:'Payment', desc:'Connect your payment gateway' },
];

const themes = [
  { id:'dark-orange', name:'Dragon Fire', primary:'#E67E22', bg:'#0F1419', preview:'linear-gradient(135deg,#0F1419,#1a1a2e)' },
  { id:'dark-blue', name:'Ocean Deep', primary:'#3B82F6', bg:'#0A1628', preview:'linear-gradient(135deg,#0A1628,#1E3A5F)' },
  { id:'dark-purple', name:'Royal Night', primary:'#8B5CF6', bg:'#0F0A1F', preview:'linear-gradient(135deg,#0F0A1F,#2D1B69)' },
  { id:'dark-green', name:'Forest', primary:'#10B981', bg:'#0A1A14', preview:'linear-gradient(135deg,#0A1A14,#1B4332)' },
  { id:'light-orange', name:'Sunrise', primary:'#E67E22', bg:'#FAFAFA', preview:'linear-gradient(135deg,#FAFAFA,#FFF5EB)' },
  { id:'light-blue', name:'Clear Sky', primary:'#3B82F6', bg:'#F0F7FF', preview:'linear-gradient(135deg,#F0F7FF,#E6F0FF)' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [store, setStore] = useState({ name:'', nameAr:'', logo:'' });
  const [theme, setTheme] = useState('dark-orange');
  const [category, setCategory] = useState({ name:'', nameAr:'', icon:'', type:'account' });
  const [product, setProduct] = useState({ name:'', price:0, desc:'' });
  const [gateway, setGateway] = useState('');
  const [completed, setCompleted] = useState(false);

  const canNext = () => {
    if (currentStep===1) return store.name.length > 0;
    if (currentStep===2) return !!theme;
    if (currentStep===3) return category.name.length > 0;
    if (currentStep===4) return product.name.length > 0 && product.price > 0;
    return !!gateway;
  };

  const handleFinish = () => setCompleted(true);

  if (completed) {
    return (
      <div className="ap-page" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh'}}>
        <div style={{textAlign:'center',maxWidth:500}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 style={{fontSize:'2rem',fontWeight:800,marginBottom:8}}>Store is Ready!</h1>
          <p style={{color:'var(--color-text-muted)',fontSize:'1rem',marginBottom:30}}>Your store "{store.name}" has been set up successfully. Start adding products and managing your business.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <a href="/en/admin" className="btn btn-primary" style={{padding:'12px 28px',fontSize:'.95rem',textDecoration:'none'}}>Go to Dashboard</a>
            <a href="/en/admin/products" className="btn btn-ghost" style={{padding:'12px 28px',fontSize:'.95rem',textDecoration:'none'}}>Add Products</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page" style={{maxWidth:800,margin:'0 auto'}}>
      {/* Progress */}
      <div style={{marginBottom:30}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontWeight:700,fontSize:'.88rem'}}>Step {currentStep} of {steps.length}</span>
          <span style={{fontSize:'.82rem',color:'var(--color-text-muted)'}}>{Math.round((currentStep/steps.length)*100)}% complete</span>
        </div>
        <div style={{height:6,borderRadius:3,background:'var(--color-bg-tertiary)'}}>
          <div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,var(--color-primary),#F39C12)',width:`${(currentStep/steps.length)*100}%`,transition:'width .4s'}}/>
        </div>
        <div style={{display:'flex',gap:4,marginTop:12}}>
          {steps.map(s=>(
            <div key={s.id} onClick={()=>s.id<=currentStep&&setCurrentStep(s.id)} style={{flex:1,padding:'10px 12px',borderRadius:10,border:`1.5px solid ${s.id===currentStep?'var(--color-primary)':s.id<currentStep?'rgba(16,185,129,.3)':'var(--color-border)'}`,background:s.id===currentStep?'rgba(230,126,34,.08)':s.id<currentStep?'rgba(16,185,129,.05)':'transparent',cursor:s.id<=currentStep?'pointer':'default',transition:'.2s'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                {s.id<currentStep?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>:<span style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${s.id===currentStep?'var(--color-primary)':'var(--color-border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.62rem',fontWeight:800,color:s.id===currentStep?'var(--color-primary)':'var(--color-text-muted)'}}>{s.id}</span>}
                <span style={{fontSize:'.72rem',fontWeight:700,color:s.id===currentStep?'var(--color-primary)':s.id<currentStep?'#10B981':'var(--color-text-muted)'}}>{s.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:14,padding:30}}>
        <h2 style={{fontSize:'1.3rem',fontWeight:800,marginBottom:4}}>{steps[currentStep-1].title}</h2>
        <p style={{color:'var(--color-text-muted)',marginBottom:24}}>{steps[currentStep-1].desc}</p>

        {/* Step 1: Store Setup */}
        {currentStep===1&&(
          <div>
            <div className="ap-form-grid">
              <div className="form-group"><label className="form-label">Store Name (English) *</label><input className="form-input" value={store.name} onChange={e=>setStore(p=>({...p,name:e.target.value}))} placeholder="My Awesome Store" style={{fontSize:'1.1rem'}}/></div>
              <div className="form-group"><label className="form-label">Store Name (Arabic)</label><input className="form-input" value={store.nameAr} onChange={e=>setStore(p=>({...p,nameAr:e.target.value}))} dir="rtl" placeholder="متجري الرائع"/></div>
            </div>
            <div className="form-group"><label className="form-label">Logo URL (optional)</label><input className="form-input" value={store.logo} onChange={e=>setStore(p=>({...p,logo:e.target.value}))} placeholder="https://example.com/logo.png"/></div>
          </div>
        )}

        {/* Step 2: Theme */}
        {currentStep===2&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {themes.map(t=>(
              <div key={t.id} onClick={()=>setTheme(t.id)} style={{borderRadius:12,border:`2px solid ${theme===t.id?'var(--color-primary)':'var(--color-border)'}`,overflow:'hidden',cursor:'pointer',transition:'.2s'}}>
                <div style={{height:80,background:t.preview,display:'flex',alignItems:'flex-end',padding:10}}>
                  <div style={{display:'flex',gap:4}}>
                    <div style={{width:20,height:6,borderRadius:3,background:t.primary}}/>
                    <div style={{width:14,height:6,borderRadius:3,background:t.primary,opacity:.5}}/>
                  </div>
                </div>
                <div style={{padding:'10px 12px',background:'var(--color-surface)'}}>
                  <div style={{fontWeight:700,fontSize:'.85rem'}}>{t.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:4,marginTop:4}}>
                    <div style={{width:12,height:12,borderRadius:'50%',background:t.primary}}/>
                    <div style={{width:12,height:12,borderRadius:3,background:t.bg,border:'1px solid var(--color-border)'}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Category */}
        {currentStep===3&&(
          <div>
            <div className="ap-form-grid">
              <div className="form-group"><label className="form-label">Category Name (EN) *</label><input className="form-input" value={category.name} onChange={e=>setCategory(p=>({...p,name:e.target.value}))} placeholder="AI Tools"/></div>
              <div className="form-group"><label className="form-label">Category Name (AR)</label><input className="form-input" value={category.nameAr} onChange={e=>setCategory(p=>({...p,nameAr:e.target.value}))} dir="rtl" placeholder="أدوات ذكاء اصطناعي"/></div>
            </div>
            <div className="form-group"><label className="form-label">Subscription Type</label>
              <div style={{display:'flex',gap:8}}>
                {[['account','Account'],['cdk','CDK Key']].map(([v,l])=>(
                  <button key={v} onClick={()=>setCategory(p=>({...p,type:v}))} style={{flex:1,padding:'12px 16px',borderRadius:10,border:`2px solid ${category.type===v?'var(--color-primary)':'var(--color-border)'}`,background:category.type===v?'rgba(230,126,34,.08)':'transparent',fontWeight:700,fontSize:'.88rem',cursor:'pointer',color:category.type===v?'var(--color-primary)':'var(--color-text-muted)',transition:'.15s'}}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Product */}
        {currentStep===4&&(
          <div>
            <div className="form-group"><label className="form-label">Product Name *</label><input className="form-input" value={product.name} onChange={e=>setProduct(p=>({...p,name:e.target.value}))} placeholder="ChatGPT Plus" style={{fontSize:'1.1rem'}}/></div>
            <div className="ap-form-grid">
              <div className="form-group"><label className="form-label">Price ($) *</label><input className="form-input" type="number" min="0" step="0.01" value={product.price} onChange={e=>setProduct(p=>({...p,price:Number(e.target.value)}))} placeholder="12.00" style={{fontSize:'1.2rem',fontWeight:800,fontFamily:'monospace'}}/></div>
              <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={product.desc} onChange={e=>setProduct(p=>({...p,desc:e.target.value}))} placeholder="Full GPT-4 access"/></div>
            </div>
          </div>
        )}

        {/* Step 5: Payment */}
        {currentStep===5&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[
              { id:'stripe', name:'Stripe', desc:'Cards, Apple Pay, Google Pay', color:'#6366F1' },
              { id:'paypal', name:'PayPal', desc:'PayPal balance & cards', color:'#0070BA' },
              { id:'crypto', name:'Crypto (USDT)', desc:'Cryptocurrency payments', color:'#26A17B' },
              { id:'bank', name:'Bank Transfer', desc:'Manual bank transfers', color:'#F59E0B' },
            ].map(g=>(
              <div key={g.id} onClick={()=>setGateway(g.id)} style={{padding:20,borderRadius:12,border:`2px solid ${gateway===g.id?g.color:'var(--color-border)'}`,background:gateway===g.id?`${g.color}08`:'transparent',cursor:'pointer',transition:'.2s'}}>
                <div style={{fontWeight:700,fontSize:'1rem',marginBottom:4,color:gateway===g.id?g.color:'var(--color-text)'}}>{g.name}</div>
                <div style={{fontSize:'.78rem',color:'var(--color-text-muted)'}}>{g.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:20}}>
        <button className="btn btn-ghost" onClick={()=>setCurrentStep(p=>Math.max(1,p-1))} disabled={currentStep===1} style={{opacity:currentStep===1?.5:1}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        {currentStep<5?(
          <button className="btn btn-primary" onClick={()=>setCurrentStep(p=>p+1)} disabled={!canNext()} style={{opacity:canNext()?1:.5,padding:'10px 28px'}}>
            Next Step
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ):(
          <button className="btn btn-primary" onClick={handleFinish} disabled={!canNext()} style={{opacity:canNext()?1:.5,padding:'10px 28px',background:'linear-gradient(135deg,#10B981,#059669)'}}>
            Launch Store
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
