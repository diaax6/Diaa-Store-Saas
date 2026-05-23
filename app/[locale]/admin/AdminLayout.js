'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import './AdminLayout.css';
import CommandPalette from './CommandPalette';
import NotificationBell from './NotificationBell';

/* SVG Icon helper */
const I = ({ d, d2, extra }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="sidebar-svg">
    {d && <path d={d}/>}{d2 && <path d={d2}/>}
    {extra}
  </svg>
);

const menuGroups = [
  { groupKey: 'core', labelEn: 'Core', labelAr: 'الأساسيات', items: [
    { key: 'dashboard', color: '#10B981', icon: <I d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" extra={<polyline points="9 22 9 12 15 12 15 22"/>}/>, labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/admin' },
  ]},
  { groupKey: 'store', labelEn: 'Store', labelAr: 'المتجر', items: [
    { key: 'products', color: '#8B5CF6', icon: <I d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" extra={<><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}/>, labelEn: 'Products', labelAr: 'المنتجات', href: '/admin/products' },
    { key: 'categories', color: '#F59E0B', icon: <I d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>, labelEn: 'Categories', labelAr: 'التصنيفات', href: '/admin/categories' },
    { key: 'inventory', color: '#22D3EE', icon: <I d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>, labelEn: 'Inventory', labelAr: 'المخزون', href: '/admin/inventory' },
    { key: 'orders', color: '#3B82F6', icon: <I extra={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>}/>, labelEn: 'Orders', labelAr: 'الطلبات', href: '/admin/orders' },
  ]},
  { groupKey: 'customers', labelEn: 'Customers', labelAr: 'العملاء', items: [
    { key: 'customers', color: '#EC4899', icon: <I d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" extra={<><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>, labelEn: 'Customers', labelAr: 'العملاء', href: '/admin/customers' },
    { key: 'segmentation', color: '#06B6D4', icon: <I d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" extra={<><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>, labelEn: 'Segmentation', labelAr: 'تصنيف العملاء', href: '/admin/segmentation' },
  ]},
  { groupKey: 'finance', labelEn: 'Finance', labelAr: 'المالية', items: [
    { key: 'wallet', color: '#10B981', icon: <I extra={<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>}/>, labelEn: 'Wallet', labelAr: 'المحفظة', href: '/admin/wallet' },
    { key: 'finance', color: '#10B981', icon: <I extra={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}/>, labelEn: 'Finance', labelAr: 'المالية', href: '/admin/finance' },
    { key: 'payments', color: '#F59E0B', icon: <I extra={<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>}/>, labelEn: 'Payments', labelAr: 'المدفوعات', href: '/admin/payments' },
  ]},
  { groupKey: 'marketing', labelEn: 'Marketing', labelAr: 'التسويق', items: [
    { key: 'analytics', color: '#6366F1', icon: <I extra={<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>}/>, labelEn: 'Analytics', labelAr: 'التحليلات', href: '/admin/analytics' },
    { key: 'coupons', color: '#F59E0B', icon: <I d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" extra={<line x1="7" y1="7" x2="7.01" y2="7"/>}/>, labelEn: 'Coupons', labelAr: 'الكوبونات', href: '/admin/coupons' },
    { key: 'bundles', color: '#E67E22', icon: <I d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>, labelEn: 'Bundles', labelAr: 'الباقات', href: '/admin/bundles' },
    { key: 'affiliates', color: '#8B5CF6', icon: <I d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" extra={<><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>}/>, labelEn: 'Affiliates', labelAr: 'الشراكات', href: '/admin/affiliates' },
    { key: 'abandoned-carts', color: '#EF4444', icon: <I extra={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>}/>, labelEn: 'Abandoned Carts', labelAr: 'السلات المهجورة', href: '/admin/abandoned-carts' },
    { key: 'flash-deals', color: '#F43F5E', icon: <I extra={<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>}/>, labelEn: 'Flash Deals', labelAr: 'العروض السريعة', href: '/admin/flash-deals' },
  ]},
  { groupKey: 'communication', labelEn: 'Communication', labelAr: 'التواصل', items: [
    { key: 'email-templates', color: '#F97316', icon: <I d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" extra={<polyline points="22,6 12,13 2,6"/>}/>, labelEn: 'Email Templates', labelAr: 'قوالب البريد', href: '/admin/email-templates' },
    { key: 'notifications', color: '#EF4444', icon: <I d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" d2="M13.73 21a2 2 0 0 1-3.46 0"/>, labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/admin/notifications' },
  ]},
  { groupKey: 'system', labelEn: 'System', labelAr: 'النظام', items: [
    { key: 'appearance', color: '#A78BFA', icon: <I d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" extra={<><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/></>}/>, labelEn: 'Appearance', labelAr: 'المظهر', href: '/admin/appearance' },
    { key: 'site-content', color: '#6366F1', icon: <I d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" d2="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>, labelEn: 'Site Content', labelAr: 'محتوى الموقع', href: '/admin/site-content' },
    { key: 'settings', color: '#6B7280', icon: <I extra={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>}/>, labelEn: 'Settings', labelAr: 'الإعدادات', href: '/admin/settings' },
    { key: 'integrations', color: '#14B8A6', icon: <I d="M16 18l6-6-6-6" d2="M8 6l-6 6 6 6" extra={<line x1="14" y1="4" x2="10" y2="20"/>}/>, labelEn: 'Integrations', labelAr: 'التكاملات', href: '/admin/integrations' },
    { key: 'staff', color: '#EC4899', icon: <I d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" extra={<circle cx="12" cy="7" r="4"/>}/>, labelEn: 'Staff', labelAr: 'الموظفين', href: '/admin/staff' },
    { key: 'maintenance', color: '#F43F5E', icon: <I d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>, labelEn: 'Maintenance', labelAr: 'وضع الصيانة', href: '/admin/maintenance' },
    { key: 'audit', color: '#6B7280', icon: <I d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" extra={<><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>}/>, labelEn: 'Audit Log', labelAr: 'سجل النشاط', href: '/admin/audit-log' },
  ]},
];

export default function AdminLayout({ children, locale }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const pathname = usePathname();
  const isAr = locale === 'ar';

  // Auto-open group containing active page
  useEffect(() => {
    const activeGroups = {};
    menuGroups.forEach(g => {
      const hasActive = g.items.some(item => {
        const fullPath = `/${locale}${item.href}`;
        if (item.href === '/admin') return pathname === fullPath;
        return pathname.startsWith(fullPath);
      });
      if (hasActive) activeGroups[g.groupKey] = true;
    });
    // Always open core
    activeGroups.core = true;
    setOpenGroups(prev => ({ ...prev, ...activeGroups }));
  }, [pathname, locale]);

  const isActive = (href) => {
    const fullPath = `/${locale}${href}`;
    if (href === '/admin') return pathname === fullPath || pathname === href;
    return pathname.startsWith(fullPath) || pathname.startsWith(href);
  };

  const toggleGroup = (key) => {
    if (collapsed) return;
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      {mobileOpen && <div className="admin-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link href={`/${locale}/admin`} className="sidebar-logo">
            <span className="sidebar-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </span>
            {!collapsed && <span className="sidebar-logo-text">SubFlow</span>}
          </Link>
          <button className="sidebar-collapse hide-mobile" onClick={() => setCollapsed(!collapsed)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuGroups.map((group) => {
            const isOpen = openGroups[group.groupKey] || collapsed;
            const hasActiveItem = group.items.some(item => isActive(item.href));

            return (
              <div key={group.groupKey} className="sidebar-group">
                {/* Group Header */}
                {!collapsed && group.groupKey !== 'core' && (
                  <button
                    className={`sidebar-group-header ${hasActiveItem ? 'active-group' : ''}`}
                    onClick={() => toggleGroup(group.groupKey)}
                  >
                    <span className="sidebar-group-label">{isAr ? group.labelAr : group.labelEn}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`sidebar-group-chevron ${isOpen ? 'open' : ''}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                )}

                {/* Group Items */}
                <div className={`sidebar-group-items ${isOpen || group.groupKey === 'core' ? 'expanded' : 'collapsed-group'}`}>
                  {group.items.map((item) => (
                    <Link key={item.key} href={`/${locale}${item.href}`}
                      className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? (isAr ? item.labelAr : item.labelEn) : undefined}>
                      <span className="sidebar-icon" style={{color: item.color}}>{item.icon}</span>
                      {!collapsed && <span className="sidebar-label">{isAr ? item.labelAr : item.labelEn}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link href={`/${locale}`} className="sidebar-link" title="View Store">
            <span className="sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span>
            {!collapsed && <span className="sidebar-label">{isAr ? 'عرض المتجر' : 'View Store'}</span>}
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h2 className="admin-page-title">{isAr ? 'لوحة التحكم' : 'Admin Panel'}</h2>
          </div>
          <div className="admin-header-right">
            <button className="header-btn" onClick={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
              window.dispatchEvent(evt);
            }} title="Search (Ctrl+K)" style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:8,border:'1px solid var(--color-border)',background:'var(--color-bg-tertiary)',cursor:'pointer',color:'var(--color-text-muted)',fontSize:'.78rem'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <span className="hide-mobile">{isAr ? 'بحث...' : 'Search...'}</span>
              <kbd style={{fontSize:'.6rem',padding:'1px 5px',borderRadius:3,border:'1px solid var(--color-border)',marginLeft:4}}>⌘K</kbd>
            </button>
            <NotificationBell />
            <button className="header-btn" onClick={toggleTheme}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <button className="header-btn lang-btn" onClick={() => {
              const newLocale = isAr ? 'en' : 'ar';
              window.location.href = pathname.replace(`/${locale}`, `/${newLocale}`);
            }}>
              {isAr ? 'EN' : 'ع'}
            </button>
            <div className="admin-user">
              <div className="admin-avatar">A</div>
              {!collapsed && <span className="admin-name">Admin</span>}
            </div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </div>
      <CommandPalette locale={locale} />
    </div>
  );
}
