// @ts-nocheck
import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    async url() {
      return process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/diaastore'
    },
  },
  migrate: {
    async url() {
      return process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/diaastore'
    },
  },
})
