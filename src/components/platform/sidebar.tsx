'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Store, CreditCard, Settings, LogOut,
  Package, Users, Shield, BarChart3, Puzzle, FileText
} from 'lucide-react'

const navGroups = [
  {
    label: 'رئيسي',
    items: [
      { href: '/platform',           label: 'الداشبورد',      icon: LayoutDashboard },
      { href: '/platform/tenants',   label: 'المتاجر',        icon: Store },
    ]
  },
  {
    label: 'إدارة',
    items: [
      { href: '/platform/plans',         label: 'الخطط والأسعار',  icon: Package },
      { href: '/platform/addons',        label: 'خدمات إضافية',    icon: Puzzle },
      { href: '/platform/features',      label: 'الميزات',         icon: Shield },
    ]
  },
  {
    label: 'مالية',
    items: [
      { href: '/platform/subscriptions', label: 'الاشتراكات',      icon: CreditCard },
      { href: '/platform/payments',      label: 'المدفوعات',       icon: FileText },
      { href: '/platform/analytics',     label: 'الإحصائيات',      icon: BarChart3 },
    ]
  },
  {
    label: 'النظام',
    items: [
      { href: '/platform/settings',      label: 'الإعدادات',       icon: Settings },
    ]
  }
]

export function PlatformSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="pf-sidebar">
      {/* Logo */}
      <div className="pf-sidebar-logo">
        <div className="pf-sidebar-logo-icon">⚡</div>
        <div>
          <div className="pf-sidebar-brand">DiaaStore</div>
          <div className="pf-sidebar-sub">Super Admin</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {navGroups.map((group, gi) => (
          <div key={gi}>
            <div className="pf-nav-group">{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href ||
                (item.href !== '/platform' && pathname.startsWith(item.href))

              return (
                <Link key={item.href} href={item.href}
                  className={`pf-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="pf-sidebar-footer">
        <div className="pf-user-info">
          <div className="pf-user-avatar">
            {session?.user?.name?.[0] || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="pf-user-name">{session?.user?.name || 'Admin'}</div>
            <div className="pf-user-email">{session?.user?.email}</div>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/platform/login' })} className="pf-logout-btn">
          <LogOut style={{ width: 16, height: 16 }} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
