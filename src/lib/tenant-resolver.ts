import { platformPrisma } from './platform-prisma'

export type ResolvedTenant = {
  id: string
  name: string
  slug: string
  subdomain: string
  customDomain: string | null
  dbName: string
  status: string
  ownerId: string
  primaryColor: string
  accentColor: string
  logoUrl: string | null
  description: string | null
  whatsappNumber: string | null
}

/**
 * Resolve a tenant from a hostname.
 * Checks subdomain first, then custom domains.
 */
export async function resolveTenant(hostname: string): Promise<ResolvedTenant | null> {
  const platformDomain = process.env.PLATFORM_DOMAIN || 'localhost:3000'
  
  // Remove port for comparison
  const hostWithoutPort = hostname.split(':')[0]
  const platformHost = platformDomain.split(':')[0]

  // Check if this is a subdomain of the platform
  if (hostWithoutPort.endsWith(`.${platformHost}`)) {
    const subdomain = hostWithoutPort.replace(`.${platformHost}`, '')
    
    // Skip platform subdomain
    if (subdomain === 'platform' || subdomain === 'www' || subdomain === 'api') {
      return null
    }

    const tenant = await platformPrisma.tenant.findUnique({
      where: { subdomain },
    })

    if (tenant && tenant.status !== 'CANCELLED') {
      return tenant as ResolvedTenant
    }
    return null
  }

  // Check custom domains
  const domain = await platformPrisma.tenantDomain.findUnique({
    where: { domain: hostWithoutPort },
    include: { tenant: true },
  })

  if (domain?.isVerified && domain.tenant.status !== 'CANCELLED') {
    return domain.tenant as ResolvedTenant
  }

  // For local development — check if it's the platform itself
  if (hostWithoutPort === platformHost || hostWithoutPort === 'localhost') {
    return null
  }

  return null
}

/**
 * Check if a hostname is the platform itself (Super Admin)
 */
export function isPlatformHost(hostname: string): boolean {
  const platformDomain = process.env.PLATFORM_DOMAIN || 'localhost:3000'
  const hostWithoutPort = hostname.split(':')[0]
  const platformHost = platformDomain.split(':')[0]

  return (
    hostWithoutPort === platformHost ||
    hostWithoutPort === `platform.${platformHost}` ||
    hostWithoutPort === 'localhost'
  )
}
