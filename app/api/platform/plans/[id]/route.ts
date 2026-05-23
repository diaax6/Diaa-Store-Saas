import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { platformPrisma } from '@/src/lib/platform-prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const plan = await platformPrisma.plan.update({
    where: { id },
    data: {
      name: body.name,
      nameAr: body.nameAr,
      description: body.description,
      price: parseFloat(body.price),
      billingCycle: body.billingCycle,
      maxProducts: parseInt(body.maxProducts),
      maxOrders: parseInt(body.maxOrders),
      maxStaff: parseInt(body.maxStaff),
      maxCategories: parseInt(body.maxCategories),
      storageGB: parseFloat(body.storageGB),
      features: JSON.stringify(body.features || []),
    },
  })

  return NextResponse.json({ success: true, plan })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Check if any tenant uses this plan
  const activeSubs = await platformPrisma.subscription.count({
    where: { planId: id, status: 'ACTIVE' },
  })

  if (activeSubs > 0) {
    return NextResponse.json({ error: 'هذه الخطة مستخدمة من متاجر نشطة' }, { status: 400 })
  }

  await platformPrisma.plan.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
