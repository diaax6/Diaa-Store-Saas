'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { PlatformSidebar } from '@/src/components/platform/sidebar'

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/platform/login'

  if (isLogin) {
    return (
      <div style={{ background: '#0a0e1a', minHeight: '100vh', color: '#f8fafc' }}>
        {children}
      </div>
    )
  }

  return (
    <SessionProvider>
      <div className="min-h-screen flex" dir="rtl" style={{ background: '#0a0e1a', color: '#f8fafc' }}>
        <PlatformSidebar />
        <main className="flex-1 mr-64 transition-all duration-300 min-h-screen">
          <div className="p-6 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}
