import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { platformAuthOptions } from '@/src/lib/platform-auth'
import { suspendTenant, reactivateTenant, deleteTenantDatabase } from '@/src/lib/tenant-service'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(platformAuthOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { action } = await request.json()

  try {
    switch (action) {
      case 'suspend':
        await suspendTenant(id)
        break
      case 'reactivate':
        await reactivateTenant(id)
        break
      case 'delete':
        await deleteTenantDatabase(id)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
