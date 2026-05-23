import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { platformPrisma } from '@/src/lib/platform-prisma'
import { createTenantDatabase } from '@/src/lib/tenant-service'

export async function GET() {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tenants = await platformPrisma.tenant.findMany({
    include: {
      owner: true,
      subscriptions: { include: { plan: true }, take: 1, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ tenants })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { tenantName, slug, subdomain, ownerName, ownerEmail, ownerPassword, ownerPhone, planId, trialDays } = body

    if (!tenantName || !slug || !subdomain || !ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json({ error: 'البيانات المطلوبة ناقصة' }, { status: 400 })
    }

    // Check for existing slug/subdomain
    const existing = await platformPrisma.tenant.findFirst({
      where: { OR: [{ slug }, { subdomain }] },
    })
    if (existing) {
      return NextResponse.json({ error: 'الـ Slug أو Subdomain موجود بالفعل' }, { status: 400 })
    }

    const result = await createTenantDatabase({
      tenantName,
      slug,
      subdomain,
      ownerName,
      ownerEmail,
      ownerPassword,
      ownerPhone,
      planId: planId || undefined,
      trialDays: trialDays || 7,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ error: error.message || 'حدث خطأ' }, { status: 500 })
  }
}
