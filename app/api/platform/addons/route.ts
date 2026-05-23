import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { platformPrisma } from '@/src/lib/platform-prisma'
import { generateId } from '@/src/lib/utils'

export async function GET() {
  const addons = await platformPrisma.addOnService.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ addons })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const addon = await platformPrisma.addOnService.create({
    data: {
      id: generateId(),
      name: body.name,
      nameAr: body.nameAr,
      description: body.description,
      price: parseFloat(body.price),
      billingType: body.billingType || 'MONTHLY',
      activationType: body.activationType || 'MANUAL',
      featureKey: body.featureKey || null,
    },
  })

  return NextResponse.json({ success: true, addon })
}
