import { NextResponse } from 'next/server';

const DEMO_ADMIN = {
  email: 'admin@diaastore.com',
  password: 'admin123',
  name: 'Admin',
  role: 'admin',
};

const DEMO_CUSTOMER = {
  email: 'demo@gmail.com',
  password: 'demo123',
  name: 'Demo Customer',
};

export async function POST(request) {
  try {
    const { email, password, type } = await request.json();

    // Try database first
    let dbAvailable = false;
    try {
      const prismaModule = await import('@/lib/prisma');
      const prisma = prismaModule.default;
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      dbAvailable = false;
    }

    if (dbAvailable) {
      const prisma = (await import('@/lib/prisma')).default;
      const { verifyPassword, generateToken } = await import('@/lib/auth');

      if (type === 'admin') {
        const staff = await prisma.staff.findUnique({ where: { email } });
        if (!staff || !staff.isActive) {
          return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }
        const valid = await verifyPassword(password, staff.passwordHash);
        if (!valid) {
          return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }
        const token = generateToken({ id: staff.id, email: staff.email, role: staff.role });
        const response = NextResponse.json({ success: true, user: { id: staff.id, name: staff.name, role: staff.role } });
        response.cookies.set('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 });
        return response;
      }

      // Customer login via DB
      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer || !customer.passwordHash) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
      const valid = await verifyPassword(password, customer.passwordHash);
      if (!valid) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
      const token = generateToken({ id: customer.id, email: customer.email, type: 'customer' });
      const response = NextResponse.json({ success: true, user: { id: customer.id, name: customer.name } });
      response.cookies.set('customer_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 });
      return response;
    }

    // ── Fallback: Demo mode (no database) ──
    if (type === 'admin') {
      if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        const response = NextResponse.json({
          success: true,
          user: { id: 'demo-admin', name: DEMO_ADMIN.name, role: DEMO_ADMIN.role },
          demo: true,
        });
        response.cookies.set('admin_token', 'demo-admin-token', { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 });
        return response;
      }
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Customer demo
    if (email === DEMO_CUSTOMER.email && password === DEMO_CUSTOMER.password) {
      const response = NextResponse.json({
        success: true,
        user: { id: 'demo-customer', name: DEMO_CUSTOMER.name },
        demo: true,
      });
      response.cookies.set('customer_token', 'demo-customer-token', { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
