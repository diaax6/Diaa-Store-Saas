'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './pricing.css';

const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const plans = [
  {
    id: 'FREE', name: 'Free', nameAr: 'مجاني', price: 0, priceYearly: 0,
    desc: 'Perfect for getting started', descAr: 'مثالي للبداية',
    badge: null,
    limits: ['10 Products', '50 Orders/mo', '1 Staff Member', '3 Categories', '500MB Storage'],
    limitsAr: ['10 منتجات', '50 طلب/شهر', '1 عضو فريق', '3 تصنيفات', '500MB تخزين'],
    features: { customDomain: false, apiAccess: false, analytics: 'Basic', telegramBot: false, removeBranding: false, prioritySupport: false, exportData: false },
    featuresAr: { customDomain: false, apiAccess: false, analytics: 'أساسي', telegramBot: false, removeBranding: false, prioritySupport: false, exportData: false },
  },
  {
    id: 'PRO', name: 'Pro', nameAr: 'احترافي', price: 29, priceYearly: 290,
    desc: 'For growing businesses', descAr: 'للمتاجر النامية',
    badge: 'POPULAR',
    limits: ['100 Products', '1,000 Orders/mo', '5 Staff Members', 'Unlimited Categories', '5GB Storage'],
    limitsAr: ['100 منتج', '1,000 طلب/شهر', '5 أعضاء فريق', 'تصنيفات غير محدودة', '5GB تخزين'],
    features: { customDomain: true, apiAccess: true, analytics: 'Advanced', telegramBot: true, removeBranding: false, prioritySupport: true, exportData: true },
    featuresAr: { customDomain: true, apiAccess: true, analytics: 'متقدم', telegramBot: true, removeBranding: false, prioritySupport: true, exportData: true },
  },
  {
    id: 'BUSINESS', name: 'Business', nameAr: 'بيزنس', price: 79, priceYearly: 790,
    desc: 'For scale and enterprise', descAr: 'للتوسع والشركات',
    badge: null,
    limits: ['Unlimited Products', 'Unlimited Orders', 'Unlimited Staff', 'Unlimited Categories', '50GB Storage'],
    limitsAr: ['منتجات غير محدودة', 'طلبات غير محدودة', 'أعضاء غير محدود', 'تصنيفات غير محدودة', '50GB تخزين'],
    features: { customDomain: true, apiAccess: true, analytics: 'Full', telegramBot: true, removeBranding: true, prioritySupport: true, exportData: true },
    featuresAr: { customDomain: true, apiAccess: true, analytics: 'شامل', telegramBot: true, removeBranding: true, prioritySupport: true, exportData: true },
  },
];

const featureLabels = {
  customDomain: { en: 'Custom Domain', ar: 'دومين مخصص' },
  apiAccess: { en: 'API Access', ar: 'وصول API' },
  analytics: { en: 'Analytics', ar: 'إحصائيات' },
  telegramBot: { en: 'Telegram Bot', ar: 'بوت تليجرام' },
  removeBranding: { en: 'Remove Branding', ar: 'إزالة العلامة' },
  prioritySupport: { en: 'Priority Support', ar: 'دعم أولوية' },
  exportData: { en: 'Export Data', ar: 'تصدير البيانات' },
};

export default function PricingPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [yearly, setYearly] = useState(false);

  return (
    <div className="pricing-page">
      <div className="container">
        {/* Header */}
        <div className="pricing-header">
          <span className="pricing-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            {isAr ? 'الخطط والأسعار' : 'PRICING'}
          </span>
          <h1>{isAr ? 'اختر الخطة المناسبة لمتجرك' : 'Choose the right plan for your store'}</h1>
          <p>{isAr ? 'ابدأ مجاناً. ترقي في أي وقت. بدون عقود.' : 'Start free. Upgrade anytime. No contracts.'}</p>

          {/* Billing toggle */}
          <div className="pricing-toggle">
            <span className={!yearly ? 'active' : ''}>{isAr ? 'شهري' : 'Monthly'}</span>
            <button className="toggle-switch" onClick={() => setYearly(!yearly)}>
              <span className={`toggle-knob ${yearly ? 'yearly' : ''}`} />
            </button>
            <span className={yearly ? 'active' : ''}>
              {isAr ? 'سنوي' : 'Yearly'}
              <span className="save-badge">{isAr ? 'وفر 17%' : 'Save 17%'}</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="pricing-grid">
          {plans.map((plan) => {
            const price = yearly ? Math.round(plan.priceYearly / 12) : plan.price;
            const totalYearly = plan.priceYearly;
            const isPro = plan.id === 'PRO';

            return (
              <div key={plan.id} className={`pricing-card ${isPro ? 'featured' : ''}`}>
                {plan.badge && (
                  <div className="pricing-badge">{plan.badge === 'POPULAR' ? (isAr ? '🔥 الأكثر شعبية' : '🔥 MOST POPULAR') : plan.badge}</div>
                )}

                <div className="pricing-card-header">
                  <h3>{isAr ? plan.nameAr : plan.name}</h3>
                  <p className="pricing-desc">{isAr ? plan.descAr : plan.desc}</p>
                </div>

                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">{price}</span>
                  <span className="pricing-period">/{isAr ? 'شهر' : 'mo'}</span>
                </div>
                {yearly && plan.price > 0 && (
                  <p className="pricing-yearly-total">
                    ${totalYearly}/{isAr ? 'سنة' : 'year'} · {isAr ? 'وفر' : 'save'} ${plan.price * 12 - totalYearly}
                  </p>
                )}

                <Link
                  href={plan.price === 0 ? `/${locale}/auth/register` : `/${locale}/auth/register?plan=${plan.id}`}
                  className={`pricing-cta ${isPro ? 'primary' : ''}`}
                >
                  {plan.price === 0
                    ? (isAr ? 'ابدأ مجاناً' : 'Get Started Free')
                    : (isAr ? 'ابدأ تجربة مجانية' : 'Start Free Trial')}
                </Link>

                <div className="pricing-divider" />

                <div className="pricing-features">
                  <h4>{isAr ? 'الحدود' : 'Limits'}</h4>
                  {(isAr ? plan.limitsAr : plan.limits).map((limit, i) => (
                    <div key={i} className="pricing-feature">
                      <CheckIcon /> <span>{limit}</span>
                    </div>
                  ))}
                </div>

                <div className="pricing-features">
                  <h4>{isAr ? 'المميزات' : 'Features'}</h4>
                  {Object.entries(plan.features).map(([key, value]) => (
                    <div key={key} className="pricing-feature">
                      {value === false ? <XIcon /> : <CheckIcon />}
                      <span style={{ opacity: value === false ? 0.4 : 1 }}>
                        {isAr ? featureLabels[key]?.ar : featureLabels[key]?.en}
                        {typeof value === 'string' && value !== 'true' && (
                          <span className="feature-tag">{isAr ? (plan.featuresAr[key] || value) : value}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="pricing-faq">
          <h2>{isAr ? 'أسئلة شائعة' : 'Frequently Asked Questions'}</h2>
          <div className="faq-grid">
            {[
              { q: isAr ? 'هل يمكنني الترقية في أي وقت؟' : 'Can I upgrade anytime?', a: isAr ? 'نعم! يمكنك الترقية أو التخفيض في أي وقت. الفرق في السعر يُحسب تلقائياً.' : 'Yes! You can upgrade or downgrade anytime. The price difference is prorated automatically.' },
              { q: isAr ? 'هل البيانات آمنة؟' : 'Is my data secure?', a: isAr ? 'نعم. نستخدم تشفير SSL/TLS وقواعد بيانات معزولة لكل متجر.' : 'Yes. We use SSL/TLS encryption and isolated databases for each store.' },
              { q: isAr ? 'ماذا يحدث بعد انتهاء الفترة التجريبية؟' : 'What happens after the trial?', a: isAr ? 'متجرك يتحول تلقائياً للخطة المجانية. لا يتم خصم أي مبلغ.' : 'Your store automatically switches to the Free plan. No charges are made.' },
              { q: isAr ? 'هل يمكنني استخدام دومين خاص؟' : 'Can I use a custom domain?', a: isAr ? 'نعم! متاح في خطة Pro وBusiness. فقط أضف سجل CNAME في DNS الخاص بك.' : 'Yes! Available on Pro and Business plans. Just add a CNAME record in your DNS.' },
            ].map((item, i) => (
              <div key={i} className="faq-item">
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
