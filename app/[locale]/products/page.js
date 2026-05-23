'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { brandLogos } from '../components/BrandLogos';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../components/ToastProvider';
import './products.css';
import '../components/FeaturedProducts.css';

const catIcons = {
  all: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  ai: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><circle cx="12" cy="17" r="4"/></svg>,
  design: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>,
  streaming: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><polygon points="10,8 16,11 10,14"/></svg>,
  music: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  productivity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  gaming: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>,
  vpn: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

// Map category bar slugs to internal category IDs
const catSlugMap = {
  'best-sellers': 'all',
  'ai-tools': 'ai',
  'streaming': 'streaming',
  'design': 'design',
  'music': 'music',
  'gaming': 'gaming',
  'productivity': 'productivity',
  'vpn': 'vpn',
  'deals': 'all',
};

const categories = [
  { id: 'all', nameEn: 'All Products', nameAr: 'كل المنتجات' },
  { id: 'ai', nameEn: 'AI Tools', nameAr: 'أدوات الذكاء' },
  { id: 'design', nameEn: 'Design', nameAr: 'تصميم' },
  { id: 'streaming', nameEn: 'Streaming', nameAr: 'بث' },
  { id: 'music', nameEn: 'Music', nameAr: 'موسيقى' },
  { id: 'gaming', nameEn: 'Gaming', nameAr: 'ألعاب' },
  { id: 'productivity', nameEn: 'Productivity', nameAr: 'إنتاجية' },
  { id: 'vpn', nameEn: 'VPN & Security', nameAr: 'VPN وأمان' },
];

const allProducts = [
  { id: '1', nameEn: 'ChatGPT Plus', nameAr: 'شات جي بي تي بلس', brand: 'chatgpt', price: 12, comparePrice: 20, category: 'ai', desc: 'Full access to GPT-4o', descAr: 'وصول كامل لـ GPT-4o', stock: 43, color: '#10A37F', auto: true },
  { id: '2', nameEn: 'Adobe Creative Cloud', nameAr: 'أدوبي كريتف كلاود', brand: 'adobe', price: 25, comparePrice: 55, category: 'design', desc: 'All Adobe apps', descAr: 'كل تطبيقات أدوبي', stock: 12, color: '#FF0000', auto: true },
  { id: '3', nameEn: 'Spotify Premium', nameAr: 'سبوتيفاي بريميوم', brand: 'spotify', price: 8, comparePrice: 10, category: 'music', desc: 'Unlimited music', descAr: 'موسيقى بلا حدود', stock: 67, color: '#1DB954', auto: true },
  { id: '4', nameEn: 'Netflix Premium', nameAr: 'نتفلكس بريميوم', brand: 'netflix', price: 10, comparePrice: 16, category: 'streaming', desc: '4K UHD streaming', descAr: 'بث 4K عالي الجودة', stock: 3, color: '#E50914', auto: true },
  { id: '5', nameEn: 'Gemini Advanced', nameAr: 'جيميناي أدفانسد', brand: 'gemini', price: 15, comparePrice: 20, category: 'ai', desc: 'Google AI Premium', descAr: 'جوجل AI المميز', stock: 28, color: '#8E75B2', auto: true },
  { id: '6', nameEn: 'Canva Pro', nameAr: 'كانفا برو', brand: 'canva', price: 9, comparePrice: 13, category: 'design', desc: 'Professional design', descAr: 'تصميم احترافي', stock: 55, color: '#00C4CC', auto: true },
  { id: '7', nameEn: 'YouTube Premium', nameAr: 'يوتيوب بريميوم', brand: 'youtube', price: 7, comparePrice: 12, category: 'streaming', desc: 'Ad-free YouTube', descAr: 'يوتيوب بدون إعلانات', stock: 34, color: '#FF0000', auto: true },
  { id: '8', nameEn: 'Grammarly Premium', nameAr: 'جرامرلي بريميوم', brand: 'grammarly', price: 11, comparePrice: 15, category: 'productivity', desc: 'Advanced writing', descAr: 'كتابة متقدمة', stock: 0, color: '#15C39A', auto: true },
  { id: '9', nameEn: 'Microsoft 365', nameAr: 'مايكروسوفت 365', brand: 'microsoft', price: 13, comparePrice: 18, category: 'productivity', desc: 'Office suite + cloud', descAr: 'أوفيس + سحابة', stock: 22, color: '#0078D4', auto: false },
];

function ProductsPageContent() {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('store');
  const isAr = locale === 'ar';
  const { addToCart } = useCart();
  const { formatPrice, activeCurrency } = useCurrency();
  const toast = useToast();

  // Read URL params
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search') || '';
  
  // Map category bar slug to internal id
  const initialCat = urlCategory ? (catSlugMap[urlCategory] || urlCategory) : 'all';
  
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState(urlSearch);
  const [addedId, setAddedId] = useState(null);

  // Sync URL params
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(catSlugMap[urlCategory] || urlCategory);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [urlCategory, urlSearch]);

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !search || p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameAr.includes(search);
    return matchCat && matchSearch;
  });

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      brand: product.brand,
      duration: '1 month',
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    toast.cart(
      isAr
        ? `تم إضافة ${product.nameAr} إلى السلة`
        : `${product.nameEn} added to cart`,
      brandLogos[product.brand]
    );
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-page-header">
          <h1>{search ? (isAr ? `نتائج البحث: "${search}"` : `Search: "${search}"`) : (isAr ? 'المنتجات' : 'Products')}</h1>
          <p className="text-secondary">
            {search
              ? (isAr ? `${filtered.length} نتيجة` : `${filtered.length} results found`)
              : (isAr ? 'تصفح منتجاتنا المميزة' : 'Browse our featured products')}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="products-layout">
          {/* Sidebar */}
          <aside className="products-sidebar">
            {/* Search */}
            <div className="sidebar-section">
              <label className="sidebar-label">{isAr ? 'بحث' : 'SEARCH'}</label>
              <div className="sidebar-search">
                <input
                  type="text"
                  placeholder={isAr ? 'ابحث عن منتج...' : 'Search products'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-section">
              <label className="sidebar-label">
                <span className="sidebar-label-bar"></span>
                {isAr ? 'التصنيفات' : 'Categories'}
              </label>
              <div className="sidebar-categories">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`sidebar-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span className="sidebar-cat-icon">{catIcons[cat.id] || catIcons.all}</span>
                    {isAr ? cat.nameAr : cat.nameEn}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            <div className="products-count">
              {isAr ? `${filtered.length} منتج` : `${filtered.length} products`}
            </div>

            <div className="products-grid-3col">
              {filtered.map(product => {
                const save = product.comparePrice > product.price
                  ? Math.round((1 - product.price / product.comparePrice) * 100)
                  : 0;

                return (
                  <div key={product.id} className="spark-card">
                    {save > 0 && <span className="save-badge">-{save}%</span>}

                    <Link href={`/${locale}/products/${product.id}`} className="spark-card-image" style={{ background: `linear-gradient(135deg, ${product.color}15, ${product.color}08)` }}>
                      <span className="spark-card-brand-logo">{brandLogos[product.brand] || <span style={{fontSize:'2rem'}}>?</span>}</span>
                    </Link>

                    <div className="spark-card-body">
                      <div className="spark-card-category">
                        <span className="spark-cat-dot" style={{ background: product.color }}></span>
                        <span className="spark-cat-name" style={{ color: product.color }}>{product.category.toUpperCase()}</span>
                      </div>
                      <h3 className="spark-card-title">
                        <Link href={`/${locale}/products/${product.id}`}>{isAr ? product.nameAr : product.nameEn}</Link>
                      </h3>

                      <div className="spark-card-badges">
                        {product.auto && (
                          <span className="spark-badge spark-badge-auto">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            {isAr ? 'توصيل فوري' : 'Auto delivery'}
                          </span>
                        )}
                        <span className={`spark-badge ${product.stock > 5 ? 'spark-badge-stock' : product.stock > 0 ? 'spark-badge-low' : 'spark-badge-out'}`}>
                          {product.stock > 0 ? (isAr ? 'متوفر' : 'In stock') : (isAr ? 'نفذ' : 'Out of stock')}
                        </span>
                      </div>

                      <p className="spark-card-desc">{isAr ? product.descAr : product.desc}</p>
                      <div className="spark-card-divider"></div>

                      <div className="spark-card-footer">
                        <div className="spark-price-block">
                          {save > 0 && <span className="spark-price-original">{formatPrice(product.comparePrice)}</span>}
                          <div className="spark-price-row">
                            <span className="spark-price-value">{formatPrice(product.price)}</span>
                            <span className="spark-price-currency">{activeCurrency}</span>
                          </div>
                        </div>
                        <div className="spark-card-actions">
                          <button
                            className={`spark-btn-cart ${addedId === product.id ? 'added' : ''}`}
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            title={isAr ? 'أضف للسلة' : 'Add to Cart'}
                          >
                            {addedId === product.id ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            )}
                          </button>
                          <Link href={`/${locale}/products/${product.id}`} className="spark-btn-arrow" title={isAr ? 'التفاصيل' : 'Details'}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="products-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <p>{isAr ? 'لا توجد نتائج' : 'No products found. Try a different search.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:'center'}}>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
