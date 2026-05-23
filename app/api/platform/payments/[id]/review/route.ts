import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { platformPrisma } from '@/src/lib/platform-prisma'
import { generateId } from '@/src/lib/utils'

/**
 * POST /api/platform/payments/[id]/review — Approve or reject a payment
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { action } = body // 'approve' or 'reject'

  const payment = await platformPrisma.payment.findUnique({ where: { id } })
  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  if (action === 'approve') {
    await platformPrisma.payment.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedBy: (session.user as any).id,
        reviewedAt: new Date(),
      },
    })

    // If subscription payment, activate/renew subscription
    if (payment.type === 'SUBSCRIPTION' && payment.referenceId) {
      await platformPrisma.subscription.update({
        where: { id: payment.referenceId },
        data: { status: 'ACTIVE' },
      })
      await platformPrisma.tenant.update({
        where: { id: payment.tenantId },
        data: { status: 'ACTIVE' },
      })
    }

    // If add-on payment, activate add-on
    if (payment.type === 'ADD_ON' && payment.referenceId) {
      await platformPrisma.tenantAddOn.update({
        where: { id: payment.referenceId },
        data: { status: 'ACTIVE', activatedAt: new Date() },
      })
    }
  } else if (action === 'reject') {
    await platformPrisma.payment.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedBy: (session.user as any).id,
        reviewedAt: new Date(),
        notes: body.reason || 'مرفوض',
      },
    })
  }

  return NextResponse.json({ success: true })
}
