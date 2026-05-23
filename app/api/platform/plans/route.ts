import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { platformPrisma } from '@/src/lib/platform-prisma'
import { generateId } from '@/src/lib/utils'

export async function GET() {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plans = await platformPrisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({ plans })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, nameAr, description, price, billingCycle, maxProducts, maxOrders, maxStaff, maxCategories, storageGB, features } = body

  if (!name || price === undefined) {
    return NextResponse.json({ error: 'الاسم والسعر مطلوبين' }, { status: 400 })
  }

  const plan = await platformPrisma.plan.create({
    data: {
      id: generateId(),
      name,
      nameAr: nameAr || name,
      description,
      price: parseFloat(price),
      billingCycle: billingCycle || 'MONTHLY',
      maxProducts: parseInt(maxProducts) || 20,
      maxOrders: parseInt(maxOrders) || 100,
      maxStaff: parseInt(maxStaff) || 2,
      maxCategories: parseInt(maxCategories) || 5,
      storageGB: parseFloat(storageGB) || 1,
      features: JSON.stringify(features || []),
    },
  })

  return NextResponse.json({ success: true, plan })
}
