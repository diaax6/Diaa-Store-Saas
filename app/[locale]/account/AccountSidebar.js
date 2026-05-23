'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './account.css';

const I = ({ children }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;

const links = [
  { href: '/account', color: '#8B5CF6', icon: <I><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></I>, en: 'Dashboard', ar: 'لوحة التحكم' },
  { href: '/account/subscriptions', color: '#10B981', icon: <I><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></I>, en: 'Subscriptions', ar: 'اشتراكاتي' },
  { href: '/account/wallet', color: '#F59E0B', icon: <I><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></I>, en: 'Wallet', ar: 'محفظتي' },
  { href: '/account/orders', color: '#3B82F6', icon: <I><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></I>, en: 'Orders', ar: 'طلباتي' },
  { href: '/account/settings', color: '#6B7280', icon: <I><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></I>, en: 'Settings', ar: 'الإعدادات' },
];

export default function AccountSidebar({ locale }) {
  const pathname = usePathname();
  const isAr = locale === 'ar';

  return (
    <div className="account-sidebar">
      <div className="account-user-card">
        <div className="account-avatar">A</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Ahmed Mohamed</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>ahmed@gmail.com</div>
        </div>
      </div>
      <nav className="account-nav">
        {links.map(link => {
          const fullHref = `/${locale}${link.href}`;
          const active = link.href === '/account' ? pathname === fullHref : pathname.startsWith(fullHref);
          return (
            <Link key={link.href} href={fullHref} className={`account-link ${active ? 'active' : ''}`}>
              <span style={{color: link.color}}>{link.icon}</span>
              <span>{isAr ? link.ar : link.en}</span>
            </Link>
          );
        })}
        <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 0' }}></div>
        <Link href={`/${locale}`} className="account-link" style={{ color: 'var(--color-danger)' }}>
          <span><I><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></I></span>
          <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
        </Link>
      </nav>
    </div>
  );
}
