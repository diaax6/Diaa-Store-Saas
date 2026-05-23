'use client';
import Link from 'next/link';
import './CategoryBar.css';

const categories = [
  { slug: 'best-sellers', nameEn: '🔥 Best Sellers', nameAr: '🔥 الأكثر مبيعاً', color: '#E67E22' },
  { slug: 'ai-tools', nameEn: 'AI Tools', nameAr: 'أدوات الذكاء' },
  { slug: 'streaming', nameEn: 'Streaming', nameAr: 'بث ومشاهدة' },
  { slug: 'design', nameEn: 'Design', nameAr: 'تصميم' },
  { slug: 'music', nameEn: 'Music', nameAr: 'موسيقى' },
  { slug: 'gaming', nameEn: 'Gaming', nameAr: 'ألعاب' },
  { slug: 'productivity', nameEn: 'Productivity', nameAr: 'إنتاجية' },
  { slug: 'vpn', nameEn: 'VPN & Security', nameAr: 'VPN وأمان' },
  { slug: 'deals', nameEn: '% Deals', nameAr: '% تخفيضات', color: '#27AE60' },
];

export default function CategoryBar({ locale, activeSlug }) {
  const isAr = locale === 'ar';

  return (
    <div className="category-bar">
      <div className="category-bar-inner container">
        <div className="category-bar-scroll">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/${locale}/products?category=${cat.slug}`}
              className={`category-tab ${activeSlug === cat.slug ? 'category-tab-active' : ''}`}
              style={cat.color ? { color: cat.color, borderColor: cat.color } : {}}
            >
              {isAr ? cat.nameAr : cat.nameEn}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
