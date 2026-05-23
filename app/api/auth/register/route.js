import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { name, email, password, locale = 'en', tenantId } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: locale === 'ar' ? 'جميع الحقول مطلوبة' : 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: locale === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: locale === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if DB is available
    let dbAvailable = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      dbAvailable = false;
    }

    if (!dbAvailable) {
      // Demo mode — simulate registration
      return NextResponse.json({
        success: true,
        message: locale === 'ar' ? 'تم التسجيل بنجاح! تحقق من بريدك الإلكتروني.' : 'Registration successful! Check your email to verify.',
        demo: true,
      });
    }

    // Resolve tenantId — for now use the first active tenant or create a default
    let resolvedTenantId = tenantId;
    if (!resolvedTenantId) {
      const defaultTenant = await prisma.tenant.findFirst({ where: { isActive: true } });
      if (defaultTenant) {
        resolvedTenantId = defaultTenant.id;
      } else {
        return NextResponse.json(
          { success: false, error: 'No active store found' },
          { status: 400 }
        );
      }
    }

    // Check if email already exists for this tenant
    const existing = await prisma.customer.findUnique({
      where: { tenantId_email: { tenantId: resolvedTenantId, email } },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: locale === 'ar' ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'Email already registered' },
        { status: 409 }
      );
    }

    // Create customer
    const passwordHash = await hashPassword(password);
    const verifyToken = crypto.randomBytes(32).toString('hex');

    const customer = await prisma.customer.create({
      data: {
        tenantId: resolvedTenantId,
        name,
        email,
        passwordHash,
        verifyToken,
        language: locale,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verifyToken, locale);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: locale === 'ar'
        ? 'تم التسجيل بنجاح! تحقق من بريدك الإلكتروني لتأكيد حسابك.'
        : 'Registration successful! Check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
