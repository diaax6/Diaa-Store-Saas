import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { platformPrisma } from './platform-prisma'
import { generateId } from './utils'
import fs from 'fs'
import path from 'path'

/**
 * Get a direct connection to the PostgreSQL server (not a specific database)
 */
function getAdminPool(): Pool {
  const url = new URL(process.env.DATABASE_URL || '')
  url.pathname = '/postgres' // connect to default 'postgres' database
  return new Pool({
    connectionString: url.toString(),
    max: 2,
  })
}

/**
 * Create a new tenant with its own database.
 */
export async function createTenantDatabase(params: {
  tenantName: string
  slug: string
  subdomain: string
  ownerName: string
  ownerEmail: string
  ownerPassword: string
  ownerPhone?: string
  planId?: string
  trialDays?: number
}): Promise<{ tenantId: string; dbName: string }> {
  const dbName = `tenant_${params.slug.replace(/-/g, '_')}`

  // 1. Create owner (or find existing)
  let owner = await platformPrisma.tenantOwner.findUnique({
    where: { email: params.ownerEmail },
  })

  if (!owner) {
    const passwordHash = await bcrypt.hash(params.ownerPassword, 12)
    owner = await platformPrisma.tenantOwner.create({
      data: {
        id: generateId(),
        name: params.ownerName,
        email: params.ownerEmail,
        passwordHash,
        phone: params.ownerPhone,
      },
    })
  }

  // 2. Create tenant record
  const trialEndsAt = params.trialDays
    ? new Date(Date.now() + params.trialDays * 24 * 60 * 60 * 1000)
    : null

  const tenant = await platformPrisma.tenant.create({
    data: {
      id: generateId(),
      name: params.tenantName,
      slug: params.slug,
      subdomain: params.subdomain,
      ownerId: owner.id,
      dbName,
      status: params.trialDays ? 'TRIAL' : 'ACTIVE',
      trialEndsAt,
    },
  })

  // 3. Create the actual PostgreSQL database
  const adminPool = getAdminPool()
  try {
    await adminPool.query(`CREATE DATABASE "${dbName}"`)
  } finally {
    await adminPool.end()
  }

  // 4. Run tenant schema migration
  const tenantPool = new Pool({
    connectionString: process.env.DATABASE_URL?.replace(/\/[^/]+$/, `/${dbName}`),
    max: 2,
  })

  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'tenant-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    await tenantPool.query(schema)

    // 5. Create the initial admin staff user for this tenant
    const staffPasswordHash = await bcrypt.hash(params.ownerPassword, 12)
    await tenantPool.query(
      `INSERT INTO staff_users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)`,
      [generateId(), params.ownerName, params.ownerEmail, staffPasswordHash, 'TENANT_OWNER']
    )

    // 6. Create default settings
    const defaultSettings = [
      { key: 'site_name', value: params.tenantName },
      { key: 'whatsapp_number', value: params.ownerPhone || '' },
    ]
    for (const s of defaultSettings) {
      await tenantPool.query(
        `INSERT INTO settings (id, key, value) VALUES ($1, $2, $3)`,
        [generateId(), s.key, s.value]
      )
    }
  } finally {
    await tenantPool.end()
  }

  // 7. Create initial subscription if plan specified
  if (params.planId) {
    await platformPrisma.subscription.create({
      data: {
        id: generateId(),
        tenantId: tenant.id,
        planId: params.planId,
        status: 'ACTIVE',
        endDate: trialEndsAt,
      },
    })
  }

  return { tenantId: tenant.id, dbName }
}

/**
 * Delete a tenant and its database.
 */
export async function deleteTenantDatabase(tenantId: string): Promise<void> {
  const tenant = await platformPrisma.tenant.findUnique({
    where: { id: tenantId },
  })
  if (!tenant) throw new Error('Tenant not found')

  // 1. Delete tenant records from platform DB
  await platformPrisma.tenant.delete({ where: { id: tenantId } })

  // 2. Drop the tenant database
  const adminPool = getAdminPool()
  try {
    // Terminate connections first
    await adminPool.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity 
      WHERE datname = $1 AND pid <> pg_backend_pid()
    `, [tenant.dbName])

    await adminPool.query(`DROP DATABASE IF EXISTS "${tenant.dbName}"`)
  } finally {
    await adminPool.end()
  }
}

/**
 * Suspend a tenant (disable access but keep data)
 */
export async function suspendTenant(tenantId: string): Promise<void> {
  await platformPrisma.tenant.update({
    where: { id: tenantId },
    data: { status: 'SUSPENDED' },
  })
}

/**
 * Reactivate a suspended tenant
 */
export async function reactivateTenant(tenantId: string): Promise<void> {
  await platformPrisma.tenant.update({
    where: { id: tenantId },
    data: { status: 'ACTIVE' },
  })
}
