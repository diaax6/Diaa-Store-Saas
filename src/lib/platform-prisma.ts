import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  platformPrisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/diaastore_platform'
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const platformPrisma =
  globalForPrisma.platformPrisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.platformPrisma = platformPrisma
