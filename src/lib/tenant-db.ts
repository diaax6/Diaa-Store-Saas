import { Pool } from 'pg'

// Cache pools per tenant to avoid creating new connections each time
const tenantPools = new Map<string, Pool>()

/**
 * Get a PostgreSQL connection pool for a specific tenant database.
 * Uses connection pooling for performance.
 */
export function getTenantPool(dbName: string): Pool {
  if (tenantPools.has(dbName)) {
    return tenantPools.get(dbName)!
  }

  const baseUrl = process.env.DATABASE_URL || ''
  // Replace the database name in the connection URL
  const url = new URL(baseUrl)
  url.pathname = `/${dbName}`

  const pool = new Pool({
    connectionString: url.toString(),
    max: 5, // max connections per tenant
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  tenantPools.set(dbName, pool)
  return pool
}

/**
 * Execute a query on a tenant's database
 */
export async function tenantQuery<T = any>(
  dbName: string,
  query: string,
  params?: any[]
): Promise<T[]> {
  const pool = getTenantPool(dbName)
  const result = await pool.query(query, params)
  return result.rows as T[]
}

/**
 * Execute a single-row query on a tenant's database
 */
export async function tenantQueryOne<T = any>(
  dbName: string,
  query: string,
  params?: any[]
): Promise<T | null> {
  const rows = await tenantQuery<T>(dbName, query, params)
  return rows[0] || null
}

/**
 * Close a tenant's connection pool (used when deleting a tenant)
 */
export async function closeTenantPool(dbName: string): Promise<void> {
  const pool = tenantPools.get(dbName)
  if (pool) {
    await pool.end()
    tenantPools.delete(dbName)
  }
}

/**
 * Generate a CUID-like ID for tenant records
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `c${timestamp}${random}`
}
