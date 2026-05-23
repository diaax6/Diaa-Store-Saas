/**
 * Admin Guard — Protects admin API routes
 * Verifies JWT, checks staff exists, checks tenant ownership
 */
import { verifyToken } from './auth';
import prisma from './prisma';

/**
 * Verify admin request and return staff + tenant info
 * @returns {{ staff, tenant, error, status }}
 */
export async function requireAdmin(request) {
  try {
    // Get token from cookie or Authorization header
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );

    const token = cookies['admin_token']
      || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return { error: 'Authentication required', status: 401 };
    }

    // Verify JWT
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return { error: 'Invalid or expired token', status: 401 };
    }

    // Check staff exists in DB
    let staff;
    try {
      staff = await prisma.staff.findUnique({
        where: { id: decoded.id },
        select: {
          id: true, name: true, email: true, role: true,
          isActive: true, tenantId: true,
          tenant: { select: { id: true, slug: true, name: true, plan: true } },
          ownedTenant: { select: { id: true, slug: true, name: true, plan: true } },
        },
      });
    } catch {
      // DB not available — allow demo mode with decoded token data
      return {
        staff: { id: decoded.id, name: decoded.name || 'Admin', email: decoded.email, role: decoded.role || 'admin' },
        tenant: null,
        demo: true,
      };
    }

    if (!staff || !staff.isActive) {
      return { error: 'Account disabled or not found', status: 403 };
    }

    // Resolve tenant (owned tenant takes priority)
    const tenant = staff.ownedTenant || staff.tenant;

    return { staff, tenant };
  } catch (error) {
    return { error: error.message, status: 500 };
  }
}

/**
 * Verify admin has specific role
 */
export function requireRole(staff, ...roles) {
  if (!roles.includes(staff.role)) {
    return { error: `Requires role: ${roles.join(' or ')}`, status: 403 };
  }
  return null;
}

/**
 * Quick helper — returns NextResponse error if not admin
 */
export async function guardAdmin(request) {
  const { NextResponse } = await import('next/server');
  const result = await requireAdmin(request);
  if (result.error) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.status }
    );
  }
  return null; // No error — admin is valid
}
