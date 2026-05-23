'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Archive, Users, Settings, Tag, CreditCard, DollarSign, UserCog, Send, Zap } from 'lucide-react'

const links = [
  { href: '/admin', label: 'الداشبورد', icon: LayoutDashboard },
  { href: '/admin/products', label: 'المنتجات', icon: Package },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/admin/inventory', label: 'المخزون', icon: Archive },
  { href: '/admin/customers', label: 'العملاء', icon: Users },
  { href: '/admin/offers', label: 'العروض', icon: Tag },
  { href: '/admin/finance', label: 'المالية', icon: DollarSign },
  { href: '/admin/billing', label: 'الاشتراك', icon: CreditCard },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

export function TenantAdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-[#0d1017] border-l border-white/[0.06] flex flex-col z-40" dir="rtl">
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">لوحة التحكم</div>
            <div className="text-[11px] text-gray-500">Tenant Admin</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-purple-500/15 text-purple-300 shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'}`}>
              <link.icon className="w-[18px] h-[18px]" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/[0.06]">
        <button onClick={() => fetch('/api/tenant/auth/logout', { method: 'POST' }).then(() => window.location.href = '/admin/login')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
