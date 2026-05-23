'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import brandLogos from '../components/BrandLogos';
import './checkout.css';

const SvgI = ({ d, d2, color, extra }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d && <path d={d}/>}{d2 && <path d={d2}/>}{extra}
  </svg>
);

const paymentMethods = [
  { id: 'paymob', icon: <SvgI color="#0066FF" extra={<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>}/>, nameEn: 'Credit/Debit Card', nameAr: 'بطاقة ائتمان/خصم', detail: 'Visa, Mastercard (Paymob)' },
  { id: 'wallet', icon: <SvgI color="#F59E0B" extra={<><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></>}/>, nameEn: 'Wallet Balance', nameAr: 'رصيد المحفظة', detail: '$45.00' },
  { id: 'vodafone', icon: <SvgI color="#E60000" extra={<><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>}/>, nameEn: 'Vodafone Cash', nameAr: 'فودافون كاش', detail: '' },
  { id: 'crypto', icon: <SvgI color="#F7931A" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" extra={<text x="8" y="16" fill="#F7931A" fontSize="10" fontWeight="bold" stroke="none">₿</text>}/>, nameEn: 'Crypto (USDT)', nameAr: 'كريبتو (USDT)', detail: 'TRC20' },
  { id: 'bank', icon: <SvgI color="#3B82F6" d="M3 21h18M3 10h18M5 6l7-3 7 3" extra={<><line x1="7" y1="10" x2="7" y2="21"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="17" y1="10" x2="17" y2="21"/></>}/>, nameEn: 'Bank Transfer', nameAr: 'تحويل بنكي', detail: '' },
];

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [selectedPayment, setSelectedPayment] = useState('paymob');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [proofFile, setProofFile] = useState(null);

  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      if (res.ok) {
        const data = await res.json();
        setDiscount(data.discount || 0);
      }
    } catch {
      // Demo: 10% discount for "SAVE10"
      if (couponCode.toUpperCase() === 'SAVE10') {
        setDiscount(subtotal * 0.1);
      }
    }
  };

  const handleCheckout = async () => {
    setProcessing(true);

    // If Paymob card payment — redirect to Paymob checkout
    if (selectedPayment === 'paymob') {
      try {
        const productName = items.map(i => isAr ? i.nameAr : i.nameEn).join(', ');
        const res = await fetch('/api/paymob/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            productName,
            productId: items[0]?.id,
            customerEmail: email,
            customerName: email.split('@')[0],
            customerPhone: '01000000000',
          }),
        });
        const data = await res.json();
        if (data.success && data.paymentUrl) {
          // Redirect to Paymob hosted checkout
          window.location.href = data.paymentUrl;
          return;
        } else {
          alert(data.error || 'Payment initialization failed. Please try again.');
          setProcessing(false);
          return;
        }
      } catch (err) {
        alert('Payment error: ' + err.message);
        setProcessing(false);
        return;
      }
    }

    // For other payment methods (wallet, vodafone, etc)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: items.map(i => ({ productId: i.id, pricingId: i.pricingId, quantity: i.quantity })),
          paymentMethod: selectedPayment,
          couponCode: couponCode || undefined,
          subtotal,
          discount,
          total,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrderNumber(data.orderNumber || `ORD-${Math.floor(Math.random() * 9000 + 1000)}`);
      } else {
        setOrderNumber(`ORD-${Math.floor(Math.random() * 9000 + 1000)}`);
      }
    } catch {
      setOrderNumber(`ORD-${Math.floor(Math.random() * 9000 + 1000)}`);
    }
    setProcessing(false);
    setCompleted(true);
    clearCart();
  };

  if (completed) {
    return (
      <div className="checkout-page container">
        <div className="checkout-success animate-fade-in">
          <div className="success-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <h1>{t('orderConfirmed')}</h1>
          <p className="text-secondary">{t('thankYou')}</p>
          <div className="success-details">
            <div className="success-row">
              <span>{t('orderNumber')}</span>
              <span className="text-primary" style={{ fontWeight: 700 }}>#{orderNumber}</span>
            </div>
            <div className="success-row">
              <span>{isAr ? 'الإجمالي' : 'Total'}</span>
              <span style={{ fontWeight: 700 }}>${total.toFixed(2)}</span>
            </div>
            <div className="success-row">
              <span>{isAr ? 'طريقة الدفع' : 'Payment'}</span>
              <span>{paymentMethods.find(m => m.id === selectedPayment)?.[isAr ? 'nameAr' : 'nameEn']}</span>
            </div>
          </div>
          <div className="flex gap-md" style={{ marginTop: '24px' }}>
            <Link href={`/${locale}/account/orders`} className="btn btn-primary">{isAr ? 'طلباتي' : 'My Orders'}</Link>
            <Link href={`/${locale}/products`} className="btn btn-outline">{isAr ? 'تسوق المزيد' : 'Continue Shopping'}</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="checkout-success">
          <h2>{isAr ? 'السلة فارغة' : 'Your cart is empty'}</h2>
          <p className="text-secondary">{isAr ? 'أضف منتجات للسلة أولاً' : 'Add products to your cart first'}</p>
          <Link href={`/${locale}/products`} className="btn btn-primary" style={{ marginTop: '16px' }}>{isAr ? 'تصفح المنتجات' : 'Browse Products'}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">{t('title')}</h1>

      <div className="checkout-grid">
        {/* Left — Payment */}
        <div className="checkout-left">
          <div className="checkout-section">
            <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> {isAr ? 'بيانات التواصل' : 'Contact Information'}</h3>
            <div className="form-group">
              <label className="form-label">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="checkout-section">
            <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> {t('paymentMethod')}</h3>
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <button key={method.id} className={`payment-method ${selectedPayment === method.id ? 'active' : ''}`} onClick={() => setSelectedPayment(method.id)}>
                  <span className="pm-icon">{method.icon}</span>
                  <div className="pm-info">
                    <span className="pm-name">{isAr ? method.nameAr : method.nameEn}</span>
                    {method.detail && <span className="pm-detail">{method.detail}</span>}
                  </div>
                  <div className={`pm-radio ${selectedPayment === method.id ? 'checked' : ''}`}></div>
                </button>
              ))}
            </div>
          </div>

          {selectedPayment === 'paymob' && (
            <div className="checkout-section animate-fade-in">
              <div style={{ padding: '16px', background: 'rgba(0,102,255,.06)', border: '1px solid rgba(0,102,255,.15)', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span style={{ fontWeight: 700, fontSize: '.9rem', color: '#0066FF' }}>{isAr ? 'دفع آمن عبر Paymob' : 'Secure Payment via Paymob'}</span>
                </div>
                <p style={{ fontSize: '.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {isAr ? 'سيتم تحويلك لصفحة Paymob الآمنة لإدخال بيانات الكارت. لا نحتفظ ببيانات بطاقتك.' : "You'll be redirected to Paymob's secure checkout to enter your card details. We never store your card info."}
                </p>
              </div>
            </div>
          )}

          {(selectedPayment === 'vodafone' || selectedPayment === 'bank') && (
            <div className="checkout-section animate-fade-in">
              <h3>{isAr ? 'تعليمات الدفع' : 'Payment Instructions'}</h3>
              <div className="manual-info">
                {selectedPayment === 'vodafone' && (
                  <div className="manual-box">
                    <p>{isAr ? 'حول المبلغ إلى:' : 'Transfer to:'}</p>
                    <code className="manual-number">01XXXXXXXXX</code>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>{isAr ? 'ثم ارفع إيصال الدفع' : 'Then upload payment receipt'}</p>
                  </div>
                )}
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">{isAr ? 'إيصال الدفع (صورة)' : 'Payment Receipt (image)'}</label>
                  <div className="upload-receipt">
                    <input type="file" accept="image/*" onChange={e => setProofFile(e.target.files[0])} />
                    <span>{proofFile ? proofFile.name : (isAr ? 'اختر صورة' : 'Choose file')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — Summary */}
        <div className="checkout-summary">
          <h3>{isAr ? 'ملخص الطلب' : 'Order Summary'}</h3>

          <div className="summary-items">
            {items.map(item => (
              <div key={`${item.id}-${item.pricingId || 'def'}`} className="summary-item">
                <span className="summary-item-icon" style={{width:24,height:24,display:'flex',alignItems:'center'}}>{brandLogos[item.brand]}</span>
                <div className="summary-item-info">
                  <span>{isAr ? item.nameAr : item.nameEn}</span>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{item.duration || '1 month'} × {item.quantity}</span>
                </div>
                <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="coupon-row">
            <input className="form-input coupon-input" placeholder={isAr ? 'كود الخصم' : 'Coupon code'} value={couponCode} onChange={e => setCouponCode(e.target.value)} />
            <button className="btn btn-outline btn-sm" onClick={handleApplyCoupon}>{isAr ? 'تطبيق' : 'Apply'}</button>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-rows">
            <div className="summary-row"><span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="summary-row text-success"><span>{isAr ? 'الخصم' : 'Discount'}</span><span>-{formatPrice(discount)}</span></div>}
            <div className="summary-row summary-total"><span>{isAr ? 'الإجمالي' : 'Total'}</span><span>{formatPrice(total)}</span></div>
          </div>

          <button className="btn btn-primary btn-lg w-full checkout-btn" onClick={handleCheckout} disabled={processing || !email}>
            {processing ? (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',animation:'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> {t('processing')}</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> {t('completeOrder')} — {formatPrice(total)}</>
            )}
          </button>

          <div className="checkout-trust">
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> {isAr ? 'دفع آمن ومشفر' : 'Secure & Encrypted'}</span>
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> {isAr ? 'تسليم فوري' : 'Instant Delivery'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
