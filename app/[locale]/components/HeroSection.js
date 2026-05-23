'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSettings } from '../context/SettingsContext';
import './HeroSection.css';

const heroBanners = [
  {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    titleEn: 'Premium Digital Subscriptions',
    titleAr: 'اشتراكات رقمية مميزة',
    subtitleEn: 'ChatGPT Plus, Adobe CC, Netflix & more at unbeatable prices',
    subtitleAr: 'ChatGPT Plus, أدوبي, نتفلكس والمزيد بأسعار لا تقبل المنافسة',
    accent: '#E67E22',
  },
  {
    gradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a2233 100%)',
    titleEn: 'Instant Auto-Delivery',
    titleAr: 'توصيل فوري وتلقائي',
    subtitleEn: 'Get your digital products delivered in seconds, not hours',
    subtitleAr: 'احصل على منتجاتك الرقمية في ثوانٍ وليس ساعات',
    accent: '#27AE60',
  },
  {
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #11083c 100%)',
    titleEn: 'Secure & Trusted',
    titleAr: 'آمن وموثوق',
    subtitleEn: 'SSL encrypted payments with 50K+ satisfied customers worldwide',
    subtitleAr: 'مدفوعات مشفرة بـ SSL مع أكثر من 50 ألف عميل راضٍ حول العالم',
    accent: '#3B82F6',
  },
];

export default function HeroSection({ locale }) {
  const { settings } = useSettings();
  const isAr = locale === 'ar';
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = heroBanners[current];
  const heroTitle = current === 0
    ? (isAr ? settings.hero_title_ar : settings.hero_title_en)
    : (isAr ? banner.titleAr : banner.titleEn);
  const heroSubtitle = current === 0
    ? (isAr ? settings.hero_subtitle_ar : settings.hero_subtitle_en)
    : (isAr ? banner.subtitleAr : banner.subtitleEn);

  return (
    <section className="hero-section" style={{ background: banner.gradient }}>
      <div className="hero-bg-effects">
        <div className="hero-glow" style={{ background: banner.accent }}></div>
        <div className="hero-glow hero-glow-2" style={{ background: banner.accent }}></div>
        <div className="hero-grid-pattern"></div>
      </div>

      <div className="hero-content container">
        <div className="hero-text">
          <div className="hero-badge" style={{ borderColor: banner.accent }}>
            <span className="hero-badge-dot" style={{ background: banner.accent }}></span>
            {isAr ? 'خدمات رقمية مميزة' : 'Premium Digital Services'}
          </div>

          <h1 className="hero-title" key={current}>
            {heroTitle}
          </h1>

          <p className="hero-subtitle">
            {heroSubtitle}
          </p>

          <div className="hero-actions">
            <Link href={`/${locale}/products`} className="hero-btn hero-btn-primary" style={{ background: `linear-gradient(135deg, ${banner.accent}, ${banner.accent}dd)` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {isAr ? 'تصفح المنتجات' : 'Browse Products'}
            </Link>
            <a href={settings.social_telegram || '#'} className="hero-btn hero-btn-outline" style={{ borderColor: `${banner.accent}88` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              {isAr ? 'اطلب عبر تيليجرام' : 'Order via Telegram'}
            </a>
          </div>

          <div className="hero-trust-badges">
            <span className="hero-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              {isAr ? 'توصيل فوري' : 'Instant Delivery'}
            </span>
            <span className="hero-trust-divider">|</span>
            <span className="hero-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              {isAr ? 'دفع آمن' : 'Secure Payment'}
            </span>
            <span className="hero-trust-divider">|</span>
            <span className="hero-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {isAr ? 'دعم 24/7' : '24/7 Support'}
            </span>
          </div>
        </div>

        {/* Floating product cards */}
        <div className="hero-floating-cards">
          <div className="floating-card floating-card-1">
            <div className="floating-card-icon" style={{background:'#10A37F'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="floating-card-info">
              <span className="floating-card-name">ChatGPT Plus</span>
              <span className="floating-card-price" style={{color: banner.accent}}>$12/mo</span>
            </div>
          </div>
          <div className="floating-card floating-card-2">
            <div className="floating-card-icon" style={{background:'#FF0000'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            <div className="floating-card-info">
              <span className="floating-card-name">YouTube Premium</span>
              <span className="floating-card-price" style={{color: banner.accent}}>$7/mo</span>
            </div>
          </div>
          <div className="floating-card floating-card-3">
            <div className="floating-card-icon" style={{background:'#1DB954'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            </div>
            <div className="floating-card-info">
              <span className="floating-card-name">Spotify Premium</span>
              <span className="floating-card-price" style={{color: banner.accent}}>$8/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Dots */}
      <div className="hero-dots">
        {heroBanners.map((_, i) => (
          <button key={i} className={`hero-dot ${current === i ? 'active' : ''}`} onClick={() => setCurrent(i)} style={current === i ? { background: banner.accent } : {}} />
        ))}
      </div>
    </section>
  );
}
