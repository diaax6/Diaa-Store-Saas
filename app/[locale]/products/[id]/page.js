'use client';

import { useTranslations } from 'next-intl';
import { useState, use } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { brandLogos } from '../../components/BrandLogos';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../components/ToastProvider';
import './product-detail.css';

const productData = {
  '1': { nameEn: 'ChatGPT Plus', nameAr: 'شات جي بي تي بلس', brand: 'chatgpt', desc: 'Full access to GPT-4, DALL·E 3, Advanced Data Analysis, and all ChatGPT plugins. Priority access during peak times.', descAr: 'وصول كامل لـ GPT-4، DALL·E 3، تحليل البيانات المتقدم، وكل إضافات ChatGPT.', category: 'AI', color: '#10B981', skus: [{ id: 's1', name: '1 Month', price: 12, stock: 43 }, { id: 's2', name: '3 Months', price: 30, stock: 20 }, { id: 's3', name: '1 Year', price: 99, stock: 8 }] },
  '2': { nameEn: 'Adobe Creative Cloud', nameAr: 'أدوبي كريتف كلاود', brand: 'adobe', desc: 'Access all Adobe apps including Photoshop, Illustrator, Premiere Pro, After Effects, and more.', descAr: 'وصول لكل تطبيقات أدوبي بما في ذلك فوتوشوب، إليستريتور، بريمير برو.', category: 'Design', color: '#8B5CF6', skus: [{ id: 's1', name: '1 Month', price: 25, stock: 12 }, { id: 's2', name: '6 Months', price: 130, stock: 5 }] },
  '3': { nameEn: 'Spotify Premium', nameAr: 'سبوتيفاي بريميوم', brand: 'spotify', desc: 'Ad-free music streaming, offline downloads, and high quality audio on any device.', descAr: 'بث موسيقى بدون إعلانات، تحميل أوفلاين، وجودة صوت عالية.', category: 'Music', color: '#1DB954', skus: [{ id: 's1', name: '1 Month', price: 8, stock: 67 }, { id: 's2', name: '3 Months', price: 20, stock: 30 }] },
  '4': { nameEn: 'Netflix Premium', nameAr: 'نتفلكس بريميوم', brand: 'netflix', desc: '4K Ultra HD streaming, watch on 4 screens simultaneously, download on 6 devices.', descAr: 'بث 4K فائق الجودة، مشاهدة على 4 شاشات، تحميل على 6 أجهزة.', category: 'Streaming', color: '#E50914', skus: [{ id: 's1', name: '1 Month', price: 10, stock: 3 }] },
  '5': { nameEn: 'Gemini Advanced', nameAr: 'جيميناي أدفانسد', brand: 'gemini', desc: 'Access Google Gemini Ultra model with extended context, priority access, and advanced capabilities.', descAr: 'وصول لنموذج Gemini Ultra مع سياق ممتد وقدرات متقدمة.', category: 'AI', color: '#4285F4', skus: [{ id: 's1', name: '1 Month', price: 15, stock: 28 }, { id: 's2', name: '1 Year', price: 150, stock: 10 }] },
  '6': { nameEn: 'Canva Pro', nameAr: 'كانفا برو', brand: 'canva', desc: 'Professional design tools with premium templates, brand kit, background remover and more.', descAr: 'أدوات تصميم احترافية مع قوالب مميزة ومزيل الخلفية.', category: 'Design', color: '#00C4CC', skus: [{ id: 's1', name: '1 Month', price: 9, stock: 55 }] },
  '7': { nameEn: 'YouTube Premium', nameAr: 'يوتيوب بريميوم', brand: 'youtube', desc: 'Ad-free videos, background play, and YouTube Music Premium included.', descAr: 'فيديوهات بدون إعلانات، تشغيل في الخلفية، ويوتيوب ميوزك مجاناً.', category: 'Streaming', color: '#FF0000', skus: [{ id: 's1', name: '1 Month', price: 7, stock: 34 }] },
  '8': { nameEn: 'Grammarly Premium', nameAr: 'جرامرلي بريميوم', brand: 'grammarly', desc: 'Advanced grammar checking, style suggestions, plagiarism detection, and tone adjustments.', descAr: 'تدقيق نحوي متقدم، اقتراحات أسلوبية، وكشف الانتحال.', category: 'Productivity', color: '#15C39A', skus: [{ id: 's1', name: '1 Month', price: 11, stock: 0 }] },
  '9': { nameEn: 'Microsoft 365', nameAr: 'مايكروسوفت 365', brand: 'microsoft', desc: 'Full Office suite with 1TB OneDrive cloud storage. Word, Excel, PowerPoint, Outlook and more.', descAr: 'حزمة أوفيس كاملة مع 1 تيرا من سحابة OneDrive.', category: 'Productivity', color: '#0078D4', skus: [{ id: 's1', name: '1 Month', price: 13, stock: 22 }, { id: 's2', name: '1 Year', price: 120, stock: 15 }] },
};

const CheckSvg = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const product = productData[params.id] || productData['1'];
  const [selectedSku, setSelectedSku] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice, activeCurrency } = useCurrency();
  const toast = useToast();
  const sku = product.skus[selectedSku];

  const handleAddToCart = () => {
    if (sku.stock === 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: params.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: sku.price,
        brand: product.brand,
        duration: sku.name,
        pricingId: sku.id,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toast.cart(
      isAr
        ? `تم إضافة ${quantity}× ${product.nameAr} إلى السلة`
        : `${quantity}× ${product.nameEn} added to cart`,
      brandLogos[product.brand]
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // After a brief delay, navigate to checkout
    setTimeout(() => {
      window.location.href = `/${locale}/checkout`;
    }, 500);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="detail-breadcrumb">
          <Link href={`/${locale}`}>{isAr ? 'الرئيسية' : 'Home'}</Link>
          <span>/</span>
          <Link href={`/${locale}/products`}>{isAr ? 'المنتجات' : 'Products'}</Link>
          <span>/</span>
          <span className="text-primary">{isAr ? product.nameAr : product.nameEn}</span>
        </div>

        <div className="detail-main-card">
          <div className="detail-two-col">
            <div className="detail-image-col">
              <div className="detail-image-box" style={{ background: `linear-gradient(135deg, ${product.color}20, ${product.color}08)` }}>
                <div className="detail-brand-logo">
                  {brandLogos[product.brand] || <span className="detail-emoji">?</span>}
                </div>
              </div>
            </div>

            <div className="detail-info-col">
              <div className="detail-category-label">
                <span className="spark-cat-label">{isAr ? 'التصنيف' : 'CATEGORY'}</span>
                <span className="spark-cat-dot">·</span>
                <span style={{ color: product.color, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>{product.category}</span>
              </div>

              <h1 className="detail-product-title">{isAr ? product.nameAr : product.nameEn}</h1>

              <div className="detail-price-section">
                <span className="detail-price-label">{isAr ? 'السعر' : 'Price'}</span>
                <span className="detail-price-value">{formatPrice(sku.price)} <span className="detail-price-currency">{activeCurrency}</span></span>
              </div>

              <div className="detail-divider"></div>

              <div className="detail-sku-section">
                <label className="detail-sku-label">{isAr ? 'اختر المدة' : 'CHOOSE SKU'}</label>
                <div className="detail-sku-options">
                  {product.skus.map((s, i) => (
                    <button key={s.id} className={`detail-sku-btn ${selectedSku === i ? 'active' : ''}`} onClick={() => { setSelectedSku(i); setQuantity(1); }}>
                      <span className="sku-name">{s.name}</span>
                      <span className={`sku-stock ${s.stock <= 5 ? 'low' : ''}`}>
                        {s.stock > 0 ? (isAr ? `${s.stock} متوفر` : `${s.stock} left`) : (isAr ? 'نفذ' : 'Out of stock')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="detail-qty-section">
                <label className="detail-sku-label">{isAr ? 'الكمية' : 'QUANTITY'}</label>
                <div className="detail-qty-wrap">
                  <button
                    className="detail-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <span className="detail-qty-value">{quantity}</span>
                  <button
                    className="detail-qty-btn"
                    onClick={() => setQuantity(q => Math.min(sku.stock, q + 1))}
                    disabled={quantity >= sku.stock}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  {quantity > 1 && (
                    <span className="detail-qty-total">
                      = <strong>${(sku.price * quantity).toFixed(2)}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="detail-badges">
                <span className="spark-badge spark-badge-guest">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {isAr ? 'شراء فوري' : 'Guest purchase'}
                </span>
                <span className="spark-badge spark-badge-auto">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  {isAr ? 'توصيل تلقائي' : 'Auto fulfillment'}
                </span>
              </div>

              <div className="detail-actions">
                <button
                  className={`detail-btn-cart ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={sku.stock === 0}
                >
                  {added ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {isAr ? 'تمت الإضافة!' : 'Added!'}
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      {isAr ? 'أضف للسلة' : 'Add to cart'}
                      {quantity > 1 && <span className="btn-qty-badge">×{quantity}</span>}
                    </>
                  )}
                </button>
                <button className="detail-btn-buy" onClick={handleBuyNow} disabled={sku.stock === 0}>
                  {isAr ? 'اشتري الآن' : 'Buy now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-desc-card">
          <div className="detail-desc-header">
            <span className="sidebar-label-bar"></span>
            <h2>{isAr ? 'التفاصيل' : 'Details'}</h2>
          </div>
          <div className="detail-divider"></div>
          <div className="detail-desc-body">
            <p>{isAr ? product.descAr : product.desc}</p>
            <div className="detail-features">
              <div className="detail-feature"><CheckSvg /> {isAr ? 'توصيل فوري بعد الدفع' : 'Instant delivery after payment'}</div>
              <div className="detail-feature"><CheckSvg /> {isAr ? 'ضمان تفعيل 100%' : '100% activation guarantee'}</div>
              <div className="detail-feature"><CheckSvg /> {isAr ? 'دعم فني 24/7' : '24/7 technical support'}</div>
              <div className="detail-feature"><CheckSvg /> {isAr ? 'استرجاع خلال 24 ساعة' : 'Refund within 24 hours'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
