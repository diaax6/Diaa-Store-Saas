import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── PLATFORM (Super Admin) routes only ─────────────────────
  if (pathname.startsWith('/platform') && !pathname.startsWith('/platform/login')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.authType !== 'platform') {
      const loginUrl = new URL('/platform/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Already logged in → redirect to platform dashboard
  if (pathname === '/platform/login') {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (token && token.authType === 'platform') {
      return NextResponse.redirect(new URL('/platform', request.url))
    }
  }

  // ─── Everything else passes through ─────────────────────────
  // The old app/ directory handles its own auth via JWT cookies (lib/auth.js)
  // No middleware interception needed for /admin or storefront routes

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/platform/:path*',
  ],
}
