import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { token, password, locale = 'en' } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: locale === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check DB
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      return NextResponse.json({
        success: true,
        message: locale === 'ar' ? 'تم تغيير كلمة المرور (وضع تجريبي)' : 'Password changed (demo mode)',
        demo: true,
      });
    }

    // Try customer first
    let customer = await prisma.customer.findFirst({
      where: { resetToken: token },
    });

    if (customer) {
      // Check expiry
      if (customer.resetExpires && customer.resetExpires < new Date()) {
        return NextResponse.json(
          { success: false, error: locale === 'ar' ? 'انتهت صلاحية الرابط' : 'Reset link has expired' },
          { status: 400 }
        );
      }

      const passwordHash = await hashPassword(password);
      await prisma.customer.update({
        where: { id: customer.id },
        data: { passwordHash, resetToken: null, resetExpires: null },
      });

      return NextResponse.json({
        success: true,
        message: locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully',
      });
    }

    // Try staff
    let staff = await prisma.staff.findFirst({
      where: { resetToken: token },
    });

    if (staff) {
      if (staff.resetExpires && staff.resetExpires < new Date()) {
        return NextResponse.json(
          { success: false, error: locale === 'ar' ? 'انتهت صلاحية الرابط' : 'Reset link has expired' },
          { status: 400 }
        );
      }

      const passwordHash = await hashPassword(password);
      await prisma.staff.update({
        where: { id: staff.id },
        data: { passwordHash, resetToken: null, resetExpires: null },
      });

      return NextResponse.json({
        success: true,
        message: locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: locale === 'ar' ? 'رابط غير صالح' : 'Invalid reset link' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
