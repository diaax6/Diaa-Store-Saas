'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { PlatformSidebar } from '@/src/components/platform/sidebar'
import './platform.css'

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/platform/login'

  if (isLogin) {
    return <div className="pf-login-wrap">{children}</div>
  }

  return (
    <SessionProvider>
      <div className="pf-shell" dir="rtl">
        <PlatformSidebar />
        <main className="pf-main">
          <div className="pf-content">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}
