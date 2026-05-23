/**
 * Tenant Context — resolves current tenant from request
 */
import prisma from './prisma';

// Cache tenants in memory (refresh every 5 min)
let tenantCache = new Map();
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function refreshCache() {
  if (Date.now() - cacheTime < CACHE_TTL && tenantCache.size > 0) return;
  try {
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
      select: { id: true, slug: true, domain: true, plan: true, name: true, logo: true, ownerId: true },
    });
    tenantCache = new Map();
    for (const t of tenants) {
      tenantCache.set(t.slug, t);
      if (t.domain) tenantCache.set(t.domain, t);
    }
    cacheTime = Date.now();
  } catch {
    // DB not available yet — that's ok
  }
}

/**
 * Resolve tenant from hostname
 * Examples:
 *   ahmed.diaa.store → slug "ahmed"
 *   ahmed.diaastore.cloud → slug "ahmed"
 *   custom-domain.com → lookup by domain
 *   localhost:3000 → default tenant
 */
export async function resolveTenant(hostname) {
  await refreshCache();

  // Remove port
  const host = hostname?.split(':')[0] || '';

  // Main domains
  const mainDomains = ['diaa.store', 'diaastore.cloud', 'localhost'];

  // Check if it's a subdomain of our main domains
  for (const main of mainDomains) {
    if (host === main || host === `www.${main}`) {
      // Main site — no tenant (platform landing)
      return null;
    }
    if (host.endsWith(`.${main}`)) {
      const slug = host.replace(`.${main}`, '').split('.').pop();
      if (slug && slug !== 'www' && slug !== 'admin' && slug !== 'api') {
        return tenantCache.get(slug) || await lookupTenant(slug);
      }
    }
  }

  // Custom domain
  const tenant = tenantCache.get(host);
  if (tenant) return tenant;

  // Try DB lookup for custom domain
  return await lookupTenantByDomain(host);
}

async function lookupTenant(slug) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug, isActive: true },
      select: { id: true, slug: true, domain: true, plan: true, name: true, logo: true, ownerId: true },
    });
    if (tenant) tenantCache.set(slug, tenant);
    return tenant;
  } catch {
    return null;
  }
}

async function lookupTenantByDomain(domain) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { domain, isActive: true },
      select: { id: true, slug: true, domain: true, plan: true, name: true, logo: true, ownerId: true },
    });
    if (tenant) tenantCache.set(domain, tenant);
    return tenant;
  } catch {
    return null;
  }
}

/**
 * Extract tenant ID from request headers (set by middleware)
 */
export function getTenantId(request) {
  return request.headers.get('x-tenant-id') || null;
}

export function getTenantSlug(request) {
  return request.headers.get('x-tenant-slug') || null;
}

/**
 * Invalidate tenant cache (call after tenant update)
 */
export function invalidateTenantCache() {
  tenantCache.clear();
  cacheTime = 0;
}
