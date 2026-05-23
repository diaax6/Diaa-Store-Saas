import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { platformPrisma } from '@/src/lib/platform-prisma'

export const platformAuthOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/platform/login' },
  providers: [
    CredentialsProvider({
      id: 'platform-admin',
      name: 'Platform Admin',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const admin = await platformPrisma.platformAdmin.findUnique({
          where: { email: credentials.email },
        })
        if (!admin || !admin.isActive) return null

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash)
        if (!valid) return null

        await platformPrisma.platformAdmin.update({
          where: { id: admin.id },
          data:  { lastLoginAt: new Date() },
        })

        return {
          id:    admin.id,
          name:  admin.name,
          email: admin.email,
          role:  admin.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as any).role
        token.authType = 'platform'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id       = token.id
        ;(session.user as any).role     = token.role
        ;(session.user as any).authType = token.authType
      }
      return session
    },
  },
}
