'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from './ToastProvider';
import brandLogos from './BrandLogos';
import './FeaturedProducts.css';

const demoProducts = [
  { id: '1', nameEn: 'ChatGPT Plus', nameAr: 'شات جي بي تي بلس', brand: 'chatgpt', price: 12, comparePrice: 20, category: 'AI', catColor: '#8B5CF6', featured: true, popular: true, descEn: 'Full access to GPT-4o', descAr: 'وصول كامل لـ GPT-4o', guest: true, auto: true, stock: 45 },
  { id: '2', nameEn: 'Adobe Creative Cloud', nameAr: 'أدوبي كريتف كلاود', brand: 'adobe', price: 25, comparePrice: 55, category: 'Design', catColor: '#F43F5E', featured: true, popular: false, descEn: 'All Adobe apps included', descAr: 'كل تطبيقات أدوبي', guest: true, auto: true, stock: 23 },
  { id: '3', nameEn: 'Spotify Premium', nameAr: 'سبوتيفاي بريميوم', brand: 'spotify', price: 8, comparePrice: 10, category: 'Music', catColor: '#1DB954', featured: true, popular: false, descEn: 'Unlimited music streaming', descAr: 'موسيقى بلا حدود', guest: true, auto: true, stock: 67 },
  { id: '4', nameEn: 'Netflix Premium', nameAr: 'نتفلكس بريميوم', brand: 'netflix', price: 10, comparePrice: 16, category: 'Streaming', catColor: '#E50914', featured: true, popular: true, descEn: '4K UHD streaming', descAr: 'بث 4K عالي الجودة', guest: false, auto: true, stock: 3 },
  { id: '5', nameEn: 'Gemini Advanced', nameAr: 'جيميناي أدفانسد', brand: 'gemini', price: 15, comparePrice: 20, category: 'AI', catColor: '#8B5CF6', featured: true, popular: false, descEn: 'Google AI Premium', descAr: 'جوجل AI المميز', guest: false, auto: true, stock: 28 },
  { id: '6', nameEn: 'Canva Pro', nameAr: 'كانفا برو', brand: 'canva', price: 9, comparePrice: 13, category: 'Design', catColor: '#00C4CC', featured: true, popular: false, descEn: 'Professional design tools', descAr: 'أدوات تصميم احترافية', guest: true, auto: true, stock: 0 },
  { id: '7', nameEn: 'YouTube Premium', nameAr: 'يوتيوب بريميوم', brand: 'youtube', price: 7, comparePrice: 12, category: 'Streaming', catColor: '#E50914', featured: true, popular: false, descEn: 'Ad-free videos & music', descAr: 'فيديوهات بدون إعلانات', guest: true, auto: true, stock: 52 },
  { id: '8', nameEn: 'Microsoft 365', nameAr: 'مايكروسوفت 365', brand: 'microsoft', price: 11, comparePrice: 15, category: 'Productivity', catColor: '#0078D4', featured: true, popular: false, descEn: 'Office apps + 1TB cloud', descAr: 'تطبيقات أوفيس + 1 تيرا', guest: true, auto: false, stock: 18 },
];

export default function FeaturedProducts({ locale }) {
  const isAr = locale === 'ar';
  const { addToCart } = useCart();
  const { formatPrice, activeCurrency } = useCurrency();
  const toast = useToast();
  const [products, setProducts] = useState(demoProducts);
  const [addedId, setAddedId] = useState(null);

  // Try to fetch from API, fallback to demo
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?featured=true&limit=8');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch {}
    }
    fetchProducts();
  }, []);

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
    <section className="featured-section container">
      <div className="section-header">
        <div>
          <h2 className="section-title">{isAr ? 'المنتجات المميزة' : 'Featured Products'}</h2>
          <p className="section-desc">{isAr ? 'أفضل الاشتراكات الرقمية بأفضل الأسعار' : 'Top digital subscriptions at the best prices'}</p>
        </div>
        <Link href={`/${locale}/products`} className="view-all-link">
          {isAr ? 'عرض الكل' : 'View All'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginLeft:4}}><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      <div className="featured-grid">
        {products.map(product => {
          const save = product.comparePrice > product.price
            ? Math.round((1 - product.price / product.comparePrice) * 100)
            : 0;

          return (
            <div key={product.id} className="spark-card">
              {save > 0 && <span className="save-badge">-{save}%</span>}
              {product.popular && (
                <span className="popular-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Popular
                </span>
              )}

              <div className="spark-card-image">
                <div className="spark-card-brand-logo">
                  {brandLogos[product.brand] || (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                  )}
                </div>
              </div>

              <div className="spark-card-body">
                <div className="spark-card-category">
                  <span className="spark-cat-dot" style={{ background: product.catColor }}></span>
                  <span className="spark-cat-name" style={{ color: product.catColor }}>{product.category}</span>
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

                <div className="spark-card-divider"></div>

                <div className="spark-card-footer">
                  <div className="spark-price-block">
                    {save > 0 && (
                      <span className="spark-price-original">{formatPrice(product.comparePrice)}</span>
                    )}
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
                      title={isAr ? 'أضف للسلة' : 'Add to cart'}
                    >
                      {addedId === product.id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
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
    </section>
  );
}
