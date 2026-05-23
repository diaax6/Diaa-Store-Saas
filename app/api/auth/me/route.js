import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );

    // Check customer token first, then admin token
    const customerToken = cookies['customer_token'];
    const adminToken = cookies['admin_token'];
    const token = customerToken || adminToken;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    // Check DB
    let dbAvailable = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      // Demo mode
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.id,
          name: decoded.name || 'User',
          email: decoded.email,
          role: decoded.role || decoded.type || 'customer',
        },
        demo: true,
      });
    }

    if (adminToken && (decoded.role === 'admin' || decoded.role === 'owner' || decoded.role === 'support')) {
      const staff = await prisma.staff.findUnique({
        where: { id: decoded.id },
        select: {
          id: true, name: true, email: true, role: true, isActive: true,
          tenant: { select: { id: true, name: true, slug: true, plan: true } },
          ownedTenant: { select: { id: true, name: true, slug: true, plan: true } },
        },
      });

      if (!staff || !staff.isActive) {
        return NextResponse.json({ success: false, user: null }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          tenant: staff.ownedTenant || staff.tenant,
        },
      });
    }

    // Customer
    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, name: true, email: true, language: true,
        isVip: true, totalSpent: true, emailVerified: true,
        wallet: { select: { balance: true, currency: true } },
      },
    });

    if (!customer) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        ...customer,
        role: 'customer',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
