import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { platformPrisma } from '@/src/lib/platform-prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const addon = await platformPrisma.addOnService.update({
    where: { id },
    data: {
      name: body.name,
      nameAr: body.nameAr,
      description: body.description,
      price: parseFloat(body.price),
      billingType: body.billingType,
      activationType: body.activationType,
      featureKey: body.featureKey || null,
    },
  })

  return NextResponse.json({ success: true, addon })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await platformPrisma.addOnService.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
