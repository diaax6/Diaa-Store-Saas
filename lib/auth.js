import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'subflow-secret-change-in-production';
const TOKEN_EXPIRY = '7d';

/**
 * Hash a password
 */
export async function hashPassword(password) {
  return bcryptjs.hash(password, 12);
}

/**
 * Verify a password
 */
export async function verifyPassword(password, hash) {
  return bcryptjs.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Get current admin from cookies
 */
export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !['admin', 'support', 'owner'].includes(decoded.role)) return null;

    const staff = await prisma.staff.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, name: true, email: true, role: true, isActive: true,
        tenantId: true,
        tenant: { select: { id: true, name: true, slug: true, plan: true } },
        ownedTenant: { select: { id: true, name: true, slug: true, plan: true } },
      },
    });

    if (!staff || !staff.isActive) return null;
    return { ...staff, tenant: staff.ownedTenant || staff.tenant };
  } catch {
    return null;
  }
}

/**
 * Get current customer from cookies
 */
export async function getCurrentCustomer() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== 'customer') return null;

    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, name: true, email: true, telegramUsername: true,
        language: true, isVip: true, totalSpent: true,
      },
    });

    return customer;
  } catch {
    return null;
  }
}

/**
 * Create the initial admin account if none exists
 */
export async function ensureAdminExists() {
  const adminCount = await prisma.staff.count();
  if (adminCount === 0) {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await hashPassword(defaultPassword);
    await prisma.staff.create({
      data: {
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@diaastore.com',
        passwordHash: hash,
        role: 'owner',
      },
    });
    console.log('✅ Default admin account created');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@diaastore.com'}`);
    console.log(`   Password: ${defaultPassword}`);
  }
}
