import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { platformPrisma } from '@/src/lib/platform-prisma'
import { generateId } from '@/src/lib/utils'

export async function GET() {
  const features = await platformPrisma.platformFeature.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ features })
}

export async function POST(request: Request) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { key, name, nameAr, description, category } = body

  if (!key || !name) {
    return NextResponse.json({ error: 'Key and name are required' }, { status: 400 })
  }

  const feature = await platformPrisma.platformFeature.create({
    data: { id: generateId(), key, name, nameAr, description, category },
  })

  return NextResponse.json({ success: true, feature })
}
