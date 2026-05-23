'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';

export default function AdminSiteContentPage() {
  const toast = useToast();
  const [activeSection, setActiveSection] = useState('hero');

  const [hero, setHero] = useState({
    title: 'Diaa Store',
    subtitle: 'Your Gateway to Premium Digital Services',
    ctaText: 'Browse Products',
    ctaLink: '/products',
  });

  const [about, setAbout] = useState({
    title: 'About Us',
    content: 'We provide premium digital subscriptions at the best prices. Instant delivery, secure payment, and 24/7 support.',
  });

  const [faq, setFaq] = useState([
    { q: 'How does delivery work?', a: 'After payment confirmation, your account details are delivered instantly to your email and dashboard.' },
    { q: 'What payment methods do you accept?', a: 'We accept credit cards, debit cards, and wallet balance via PayMob.' },
    { q: 'Can I get a refund?', a: 'Yes, within 24 hours if the account has not been used.' },
  ]);

  const [policies, setPolicies] = useState({
    terms: 'Standard terms and conditions apply to all purchases...',
    privacy: 'We respect your privacy and protect your personal data...',
    refund: 'Refunds are processed within 24 hours of request...',
  });

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'about', label: 'About Us', icon: '📄' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'policies', label: 'Policies', icon: '📋' },
  ];

  const addFaq = () => setFaq(prev => [...prev, { q: '', a: '' }]);
  const updateFaq = (index, key, value) => setFaq(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
  const removeFaq = (index) => setFaq(prev => prev.filter((_, i) => i !== index));

  const handleSave = () => toast.success('Content saved successfully!');

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Site Content
          </h1>
          <p className="ap-subtitle">Manage your store's static content</p>
        </div>
        <div className="ap-header-actions"><button className="btn btn-primary" onClick={handleSave}>Save All</button></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:20}}>
        {/* Sidebar */}
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:8,border:'none',cursor:'pointer',textAlign:'left',
              background: activeSection===s.id ? 'rgba(230,126,34,0.1)' : 'transparent',
              color: activeSection===s.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: activeSection===s.id ? 700 : 500,fontSize:'0.88rem',transition:'0.15s',
            }}>
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:12,padding:24}}>
          {activeSection==='hero' && (
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>🏠 Hero Section</h3>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={hero.title} onChange={e => setHero(p=>({...p,title:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={hero.subtitle} onChange={e => setHero(p=>({...p,subtitle:e.target.value}))}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label className="form-label">CTA Button Text</label><input className="form-input" value={hero.ctaText} onChange={e => setHero(p=>({...p,ctaText:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">CTA Link</label><input className="form-input" value={hero.ctaLink} onChange={e => setHero(p=>({...p,ctaLink:e.target.value}))}/></div>
              </div>
            </div>
          )}

          {activeSection==='about' && (
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>📄 About Us</h3>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={about.title} onChange={e => setAbout(p=>({...p,title:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Content</label><textarea className="form-textarea" value={about.content} onChange={e => setAbout(p=>({...p,content:e.target.value}))} rows={6}/></div>
            </div>
          )}

          {activeSection==='faq' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <h3 style={{fontSize:'1.1rem',fontWeight:700,margin:0}}>❓ FAQ ({faq.length})</h3>
                <button className="btn btn-ghost btn-sm" onClick={addFaq}>+ Add Question</button>
              </div>
              {faq.map((item,i) => (
                <div key={i} style={{padding:16,background:'var(--color-bg-secondary)',borderRadius:10,marginBottom:12,border:'1px solid var(--color-border)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <span style={{fontWeight:600,fontSize:'0.85rem'}}>Question {i+1}</span>
                    <button onClick={()=>removeFaq(i)} style={{background:'none',border:'none',color:'#EF4444',cursor:'pointer',fontSize:'0.8rem',fontWeight:600}}>Remove</button>
                  </div>
                  <div className="form-group"><input className="form-input" value={item.q} onChange={e=>updateFaq(i,'q',e.target.value)} placeholder="Question"/></div>
                  <div className="form-group"><textarea className="form-textarea" value={item.a} onChange={e=>updateFaq(i,'a',e.target.value)} placeholder="Answer" rows={2}/></div>
                </div>
              ))}
            </div>
          )}

          {activeSection==='policies' && (
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:20}}>📋 Policies</h3>
              <div className="form-group"><label className="form-label">Terms & Conditions</label><textarea className="form-textarea" value={policies.terms} onChange={e=>setPolicies(p=>({...p,terms:e.target.value}))} rows={4}/></div>
              <div className="form-group"><label className="form-label">Privacy Policy</label><textarea className="form-textarea" value={policies.privacy} onChange={e=>setPolicies(p=>({...p,privacy:e.target.value}))} rows={4}/></div>
              <div className="form-group"><label className="form-label">Refund Policy</label><textarea className="form-textarea" value={policies.refund} onChange={e=>setPolicies(p=>({...p,refund:e.target.value}))} rows={4}/></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
