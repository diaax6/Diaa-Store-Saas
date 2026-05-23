import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email, locale = 'en' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Always return success (don't reveal if email exists)
    const successMsg = locale === 'ar'
      ? 'لو البريد مسجل عندنا، هتوصلك رسالة إعادة التعيين.'
      : 'If that email is registered, you\'ll receive a reset link.';

    // Check DB
    let dbAvailable = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      return NextResponse.json({ success: true, message: successMsg });
    }

    // Find customer
    const customer = await prisma.customer.findFirst({
      where: { email },
    });

    if (customer) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.customer.update({
        where: { id: customer.id },
        data: { resetToken, resetExpires },
      });

      try {
        await sendPasswordResetEmail(email, customer.name, resetToken, locale);
      } catch (err) {
        console.error('Reset email failed:', err.message);
      }
    }

    // Also check staff (for admin password reset)
    const staff = await prisma.staff.findUnique({ where: { email } });
    if (staff) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.staff.update({
        where: { id: staff.id },
        data: { resetToken, resetExpires },
      });

      try {
        await sendPasswordResetEmail(email, staff.name, resetToken, locale);
      } catch (err) {
        console.error('Reset email failed:', err.message);
      }
    }

    return NextResponse.json({ success: true, message: successMsg });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
