'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Store, CreditCard, Settings, LogOut,
  Package, Users, Shield, BarChart3, Puzzle, Bell, FileText
} from 'lucide-react'

const navItems = [
  { href: '/platform',              label: 'الداشبورد',         icon: LayoutDashboard },
  { href: '/platform/tenants',      label: 'المتاجر',           icon: Store },
  { href: '/platform/plans',        label: 'الخطط',             icon: Package },
  { href: '/platform/addons',       label: 'خدمات إضافية',      icon: Puzzle },
  { href: '/platform/subscriptions',label: 'الاشتراكات',        icon: CreditCard },
  { href: '/platform/payments',     label: 'المدفوعات',         icon: FileText },
  { href: '/platform/features',     label: 'الميزات',           icon: Shield },
  { href: '/platform/analytics',    label: 'الإحصائيات',        icon: BarChart3 },
  { href: '/platform/settings',     label: 'الإعدادات',         icon: Settings },
]

export function PlatformSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #111318 0%, #0d0f14 100%)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 20px rgba(99,102,241,0.3)',
            }}>
            ⚡
          </div>
          <div>
            <div className="font-bold text-white text-sm">DiaaStore</div>
            <div className="text-xs text-brand-400">Super Admin</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/platform' && pathname.startsWith(item.href))
            
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/20'
                    : 'text-dark-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-xs font-bold text-brand-300">
            {session?.user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {session?.user?.name || 'Admin'}
            </div>
            <div className="text-xs text-dark-200 truncate">
              {session?.user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/platform/login' })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
