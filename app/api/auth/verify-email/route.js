import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const locale = searchParams.get('locale') || 'en';

    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login?error=invalid-token`, request.url));
    }

    // Check DB
    let dbAvailable = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      // Demo mode — redirect to login with success
      return NextResponse.redirect(new URL(`/${locale}/auth/login?verified=true&demo=true`, request.url));
    }

    // Find customer with this verify token
    const customer = await prisma.customer.findFirst({
      where: { verifyToken: token },
    });

    if (!customer) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login?error=invalid-token`, request.url));
    }

    if (customer.emailVerified) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login?verified=already`, request.url));
    }

    // Verify the email
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(customer.email, customer.name, customer.language || locale);
    } catch {
      // Non-critical
    }

    // Redirect to login with success
    return NextResponse.redirect(new URL(`/${locale}/auth/login?verified=true`, request.url));
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.redirect(new URL(`/en/auth/login?error=server-error`, request.url));
  }
}
