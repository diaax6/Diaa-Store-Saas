import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { resolveTenant, type ResolvedTenant } from '@/src/lib/tenant-resolver'

/**
 * Get the current tenant context from the request headers.
 * Used in API routes and server components for tenant-scoped operations.
 */
export async function getTenantContext(): Promise<{ tenant: ResolvedTenant; dbName: string } | null> {
  const headersList = await headers()
  const hostname = headersList.get('host') || 'localhost:3000'

  const tenant = await resolveTenant(hostname)
  if (!tenant) return null

  return { tenant, dbName: tenant.dbName }
}

/**
 * Get the current tenant DB name from the session token.
 * Used when the tenant is already authenticated.
 */
export async function getTenantDbFromSession(): Promise<string | null> {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return null
  return (session.user as any)?.dbName || null
}
