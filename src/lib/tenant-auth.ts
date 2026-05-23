import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { tenantQueryOne } from '@/src/lib/tenant-db'

/**
 * Create NextAuth options for a specific tenant.
 * Each tenant has its own database, so we need to query the right DB.
 */
export function createTenantAuthOptions(dbName: string, tenantSlug: string): NextAuthOptions {
  return {
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: '/admin/login' },
    providers: [
      CredentialsProvider({
        id: 'tenant-admin',
        name: 'Tenant Admin',
        credentials: {
          email:    { label: 'Email',    type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null

          const staff = await tenantQueryOne<any>(
            dbName,
            'SELECT * FROM staff_users WHERE email = $1 AND is_active = true LIMIT 1',
            [credentials.email]
          )
          if (!staff) return null

          const valid = await bcrypt.compare(credentials.password, staff.password_hash)
          if (!valid) return null

          // Update last login
          await tenantQueryOne(
            dbName,
            'UPDATE staff_users SET last_login_at = NOW() WHERE id = $1',
            [staff.id]
          )

          return {
            id:    staff.id,
            name:  staff.name,
            email: staff.email,
            role:  staff.role,
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id   = user.id
          token.role = (user as any).role
          token.authType = 'tenant'
          token.tenantSlug = tenantSlug
          token.dbName = dbName
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id         = token.id
          ;(session.user as any).role       = token.role
          ;(session.user as any).authType   = token.authType
          ;(session.user as any).tenantSlug = token.tenantSlug
          ;(session.user as any).dbName     = token.dbName
        }
        return session
      },
    },
  }
}
