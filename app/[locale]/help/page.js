'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: '▶', color: '#10B981', articles: [
    { title: 'How to create an account', content: 'Visit our registration page, fill in your email and password, then verify your email address. You can start shopping immediately after verification.' },
    { title: 'Making your first purchase', content: 'Browse our products, select the duration you need, add to cart, choose your payment method, and complete checkout. Auto-delivery products are delivered instantly!' },
    { title: 'Understanding subscription types', content: 'We offer Account-based subscriptions (you receive login credentials) and CDK-based subscriptions (you receive activation keys). Each product page shows which type it is.' },
  ]},
  { id: 'payments', name: 'Payments & Billing', icon: '$', color: '#6366F1', articles: [
    { title: 'Accepted payment methods', content: 'We accept Visa, Mastercard, PayPal, Vodafone Cash, cryptocurrency (USDT), and bank transfers. Payment methods vary by region.' },
    { title: 'Is my payment secure?', content: 'Yes! All transactions are processed through 256-bit SSL encryption. We are PCI DSS compliant and never store your card details on our servers.' },
    { title: 'How to use a coupon code', content: 'Enter your coupon code at checkout in the "Coupon Code" field and click Apply. The discount will be reflected in your total before payment.' },
    { title: 'Refund policy', content: 'We offer refunds within 24 hours of purchase if the product has not been used. Contact support with your order ID for assistance.' },
  ]},
  { id: 'delivery', name: 'Delivery & Access', icon: '⚡', color: '#F59E0B', articles: [
    { title: 'How does auto-delivery work?', content: 'Products marked with "Auto Delivery" are delivered instantly after payment confirmation. Your credentials or keys appear in your account dashboard within seconds.' },
    { title: 'What if my account stops working?', content: 'Contact our support team immediately with your order ID. We will investigate and provide a replacement or refund within 24 hours.' },
    { title: 'How to access your purchased products', content: 'Go to Account → My Orders → click on the order. Your login credentials, keys, or download links will be displayed there.' },
  ]},
  { id: 'account', name: 'Account & Security', icon: '🔒', color: '#EF4444', articles: [
    { title: 'How to change your password', content: 'Go to Account → Settings → Security. Click "Change Password", enter your current password and your new password, then save.' },
    { title: 'Two-factor authentication', content: 'We recommend enabling 2FA for additional security. Go to Account → Settings → Security → Enable 2FA.' },
    { title: 'Forgot your password?', content: 'Click "Forgot Password" on the login page. Enter your email address and we will send you a reset link valid for 1 hour.' },
  ]},
];

export default function HelpCenterPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const allArticles = categories.flatMap(c => c.articles.map(a => ({ ...a, category: c.name, categoryColor: c.color })));
  const searchResults = search.length > 1
    ? allArticles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
    : [];

  if (activeArticle) {
    return (
      <div style={{ maxWidth: 750, margin: '0 auto', padding: '40px 20px' }}>
        <button onClick={() => { setActiveArticle(null); setActiveCategory(null); }} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '.88rem', marginBottom: 20,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          {isAr ? '← العودة لمركز المساعدة' : 'Back to Help Center'}
        </button>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 8 }}>{activeArticle.title}</h1>
        <span style={{ fontSize: '.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 10, background: `${activeArticle.categoryColor}15`, color: activeArticle.categoryColor }}>{activeArticle.category}</span>
        <div style={{
          marginTop: 20, background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 14, padding: '24px 28px', fontSize: '.95rem', lineHeight: 1.7, color: 'var(--color-text-muted)',
        }}>
          {activeArticle.content}
        </div>
        <div style={{ marginTop: 24, padding: 20, background: 'rgba(230,126,34,.05)', borderRadius: 12, border: '1px solid rgba(230,126,34,.15)', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>{isAr ? 'هل كان هذا مفيدا؟' : 'Was this helpful?'}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button style={{ padding: '6px 20px', borderRadius: 8, border: '1px solid rgba(16,185,129,.3)', background: 'rgba(16,185,129,.08)', color: '#10B981', fontWeight: 600, cursor: 'pointer' }}>{isAr ? 'نعم' : 'Yes'}</button>
            <button style={{ padding: '6px 20px', borderRadius: 8, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.08)', color: '#EF4444', fontWeight: 600, cursor: 'pointer' }}>{isAr ? 'لا' : 'No'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', padding: '50px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 6 }}>{isAr ? 'مركز المساعدة' : 'Help Center'}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>{isAr ? 'اعثر على إجابات للأسئلة الشائعة' : 'Find answers to common questions'}</p>
        <div style={{
          maxWidth: 500, margin: '0 auto', display: 'flex', gap: 8,
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: 4,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2" style={{ margin: '10px 0 0 12px', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن مساعدة...' : 'Search for help...'}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--color-text)', padding: '10px 8px', fontSize: '.95rem', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      {searchResults.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: 10, color: 'var(--color-text-muted)' }}>Search Results ({searchResults.length})</h3>
          {searchResults.map((a, i) => (
            <button key={i} onClick={() => setActiveArticle(a)} style={{
              display: 'block', width: '100%', padding: '12px 16px', marginBottom: 6,
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 10, cursor: 'pointer', textAlign: 'left', color: 'var(--color-text)', transition: '.15s',
            }}>
              <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{a.title}</div>
              <span style={{ fontSize: '.72rem', color: a.categoryColor }}>{a.category}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {categories.map(c => (
          <div key={c.id} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 14, padding: 22, borderTop: `3px solid ${c.color}`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, marginBottom: 12,
              background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
            }}>{c.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>{c.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {c.articles.map((a, i) => (
                <button key={i} onClick={() => setActiveArticle({ ...a, category: c.name, categoryColor: c.color })} style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: 'var(--color-text-muted)', fontSize: '.85rem', padding: '4px 0',
                  transition: '.15s', display: 'flex', alignItems: 'center', gap: 6,
                }}
                  onMouseEnter={e => e.currentTarget.style.color = c.color}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  {a.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 36, padding: 24, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{isAr ? 'لا زلت تحتاج مساعدة؟' : 'Still need help?'}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '.88rem', marginBottom: 14 }}>{isAr ? 'فريق الدعم متاح على مدار الساعة' : 'Our support team is available 24/7'}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <a href="https://t.me/diaastore" style={{ padding: '10px 22px', borderRadius: 10, background: '#0088CC', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '.88rem' }}>{isAr ? 'دعم تليجرام' : 'Telegram Support'}</a>
          <a href="mailto:support@diaastore.com" style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 600, textDecoration: 'none', fontSize: '.88rem' }}>{isAr ? 'راسلنا' : 'Email Us'}</a>
        </div>
      </div>
    </div>
  );
}
