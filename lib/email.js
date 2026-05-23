/**
 * Email Service — Mailcow SMTP via Nodemailer
 * 
 * Configure in .env:
 *   SMTP_HOST=mail.diaa.store
 *   SMTP_PORT=587
 *   SMTP_USER=noreply@diaa.store
 *   SMTP_PASS=your-password
 *   SMTP_FROM="Diaa Store <noreply@diaa.store>"
 */
import nodemailer from 'nodemailer';
import { getEmailTemplate } from './email-templates';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // Allow self-signed certs in dev
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });

  return transporter;
}

const FROM = process.env.SMTP_FROM || '"Diaa Store" <noreply@diaa.store>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Send a raw email
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const transport = getTransporter();
    const result = await transport.sendMail({
      from: FROM,
      to,
      subject,
      html,
      text: text || subject,
    });
    console.log(`📧 Email sent to ${to}: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(to, name, token, locale = 'en') {
  const link = `${APP_URL}/${locale}/auth/verify-email?token=${token}`;
  const html = getEmailTemplate('verify-email', { name, link, locale });
  return sendEmail({
    to,
    subject: locale === 'ar' ? 'تأكيد بريدك الإلكتروني — Diaa Store' : 'Verify your email — Diaa Store',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to, name, token, locale = 'en') {
  const link = `${APP_URL}/${locale}/auth/reset-password?token=${token}`;
  const html = getEmailTemplate('reset-password', { name, link, locale });
  return sendEmail({
    to,
    subject: locale === 'ar' ? 'إعادة تعيين كلمة المرور — Diaa Store' : 'Reset your password — Diaa Store',
    html,
  });
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(to, name, locale = 'en') {
  const html = getEmailTemplate('welcome', { name, locale, appUrl: APP_URL });
  return sendEmail({
    to,
    subject: locale === 'ar' ? 'مرحباً بك في Diaa Store! 🎉' : 'Welcome to Diaa Store! 🎉',
    html,
  });
}

/**
 * Send order confirmation with delivery data
 */
export async function sendOrderConfirmation(to, order, locale = 'en') {
  const html = getEmailTemplate('order-confirmation', { order, locale, appUrl: APP_URL });
  return sendEmail({
    to,
    subject: locale === 'ar'
      ? `تأكيد الطلب #${order.orderNumber} — Diaa Store`
      : `Order Confirmed #${order.orderNumber} — Diaa Store`,
    html,
  });
}

/**
 * Send subscription renewal reminder
 */
export async function sendRenewalReminder(to, subscription, daysLeft, locale = 'en') {
  const html = getEmailTemplate('renewal-reminder', { subscription, daysLeft, locale, appUrl: APP_URL });
  return sendEmail({
    to,
    subject: locale === 'ar'
      ? `تذكير: اشتراكك ينتهي خلال ${daysLeft} أيام`
      : `Reminder: Your subscription expires in ${daysLeft} days`,
    html,
  });
}

/**
 * Verify SMTP connection (for admin testing)
 */
export async function verifySmtpConnection() {
  try {
    const transport = getTransporter();
    await transport.verify();
    return { success: true, message: 'SMTP connection verified' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
