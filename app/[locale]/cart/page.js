'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import brandLogos from '../components/BrandLogos';
import './cart.css';

const initialCart = [
  { id: '1', nameEn: 'ChatGPT Plus', nameAr: 'شات جي بي تي بلس', brand: 'chatgpt', price: 12, duration: '1 month', durationAr: 'شهر واحد' },
  { id: '3', nameEn: 'Spotify Premium', nameAr: 'سبوتيفاي بريميوم', brand: 'spotify', price: 8, duration: '1 month', durationAr: 'شهر واحد' },
];

export default function CartPage() {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [items, setItems] = useState(initialCart);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME20') {
      setDiscount(Math.round(subtotal * 0.2 * 100) / 100);
    }
  };

  return (
    <div className="cart-page container">
      <h1 className="cart-title">{t('title')}</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>
          <h3>{t('empty')}</h3>
          <Link href={`/${locale}/products`} className="btn btn-primary">{t('continueShopping')}</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-icon" style={{width:32,height:32}}>{brandLogos[item.brand] || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}</div>
                <div className="cart-item-info">
                  <h3>{isAr ? item.nameAr : item.nameEn}</h3>
                  <span className="text-muted">{isAr ? item.durationAr : item.duration}</span>
                </div>
                <div className="cart-item-price">${item.price}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.id)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>{isAr ? 'ملخص الطلب' : 'Order Summary'}</h3>

            <div className="coupon-box">
              <input className="form-input" placeholder={isAr ? 'كود الكوبون' : 'Coupon code'} value={coupon} onChange={e => setCoupon(e.target.value)} />
              <button className="btn btn-outline btn-sm" onClick={applyCoupon}>{t('applyCoupon')}</button>
            </div>

            <div className="summary-rows">
              <div className="summary-row"><span>{t('subtotal')}</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="summary-row text-success"><span>{t('discount')}</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="summary-row summary-total"><span>{t('total')}</span><span>${total.toFixed(2)}</span></div>
            </div>

            <Link href={`/${locale}/checkout`} className="btn btn-primary btn-lg w-full">
              {t('checkout')} →
            </Link>

            <Link href={`/${locale}/products`} className="btn btn-ghost w-full" style={{ marginTop: '8px' }}>
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
