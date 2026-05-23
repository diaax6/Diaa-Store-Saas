/**
 * Email Templates — Professional HTML templates for all transactional emails
 */

const BRAND_COLOR = '#E67E22';
const BG_COLOR = '#0F0F12';
const CARD_BG = '#1A1A23';
const TEXT_COLOR = '#E5E5E7';
const TEXT_MUTED = '#9CA3AF';

function baseLayout(content, locale = 'en') {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG_COLOR};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${TEXT_COLOR};direction:${dir};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_COLOR};padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <!-- Logo -->
  <tr><td style="padding:0 0 30px;text-align:center;">
    <div style="display:inline-flex;align-items:center;gap:8px;">
      <div style="width:32px;height:32px;background:linear-gradient(135deg,${BRAND_COLOR},#F39C12);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;">
        <span style="color:#fff;font-size:16px;font-weight:bold;">⚡</span>
      </div>
      <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Diaa Store</span>
    </div>
  </td></tr>
  <!-- Content Card -->
  <tr><td style="background:${CARD_BG};border-radius:16px;border:1px solid rgba(255,255,255,0.06);padding:40px;">
    ${content}
  </td></tr>
  <!-- Footer -->
  <tr><td style="padding:30px 0 0;text-align:center;color:${TEXT_MUTED};font-size:12px;">
    <p style="margin:0;">© ${new Date().getFullYear()} Diaa Store. All rights reserved.</p>
    <p style="margin:8px 0 0;">
      <a href="https://diaa.store" style="color:${BRAND_COLOR};text-decoration:none;">diaa.store</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function button(text, href) {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="background:linear-gradient(135deg,${BRAND_COLOR},#F39C12);border-radius:12px;padding:14px 32px;">
  <a href="${href}" style="color:#fff;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">${text}</a>
</td></tr></table>`;
}

const templates = {
  'verify-email': ({ name, link, locale }) => {
    const isAr = locale === 'ar';
    return baseLayout(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">
        ${isAr ? '👋 مرحباً' : '👋 Hey'} ${name || ''}!
      </h1>
      <p style="margin:0 0 24px;color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
        ${isAr
          ? 'شكراً لتسجيلك في Diaa Store. اضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك.'
          : 'Thanks for signing up at Diaa Store. Click the button below to verify your email and activate your account.'}
      </p>
      ${button(isAr ? 'تأكيد البريد الإلكتروني' : 'Verify My Email', link)}
      <p style="margin:24px 0 0;color:${TEXT_MUTED};font-size:12px;">
        ${isAr ? 'الرابط صالح لمدة 24 ساعة. لو ما طلبت التسجيل، تجاهل هذا الإيميل.' : 'This link expires in 24 hours. If you didn\'t sign up, please ignore this email.'}
      </p>
    `, locale);
  },

  'reset-password': ({ name, link, locale }) => {
    const isAr = locale === 'ar';
    return baseLayout(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">
        🔐 ${isAr ? 'إعادة تعيين كلمة المرور' : 'Reset Your Password'}
      </h1>
      <p style="margin:0 0 24px;color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
        ${isAr
          ? `مرحباً ${name || ''}, تلقينا طلب لإعادة تعيين كلمة المرور. اضغط الزر أدناه لإنشاء كلمة مرور جديدة.`
          : `Hi ${name || ''}, we received a password reset request. Click below to create a new password.`}
      </p>
      ${button(isAr ? 'إعادة تعيين كلمة المرور' : 'Reset Password', link)}
      <p style="margin:24px 0 0;color:${TEXT_MUTED};font-size:12px;">
        ${isAr ? 'الرابط صالح لمدة ساعة واحدة. لو ما طلبت ذلك، تجاهل هذا الإيميل.' : 'This link expires in 1 hour. If you didn\'t request this, ignore this email.'}
      </p>
    `, locale);
  },

  'welcome': ({ name, locale, appUrl }) => {
    const isAr = locale === 'ar';
    return baseLayout(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">
        🎉 ${isAr ? 'مرحباً بك في Diaa Store!' : 'Welcome to Diaa Store!'}
      </h1>
      <p style="margin:0 0 24px;color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
        ${isAr
          ? `أهلاً ${name || ''}! تم تأكيد حسابك بنجاح. يمكنك الآن تصفح المنتجات والشراء بسهولة.`
          : `Hello ${name || ''}! Your account has been verified. You can now browse products and shop with ease.`}
      </p>
      <div style="background:rgba(230,126,34,0.08);border:1px solid rgba(230,126,34,0.2);border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="margin:0;font-size:14px;color:${TEXT_COLOR};">
          ⚡ ${isAr ? 'توصيل فوري' : 'Instant Delivery'} &nbsp;|&nbsp;
          🔒 ${isAr ? 'دفع آمن' : 'Secure Payment'} &nbsp;|&nbsp;
          💬 ${isAr ? 'دعم 24/7' : '24/7 Support'}
        </p>
      </div>
      ${button(isAr ? 'تصفح المنتجات' : 'Browse Products', `${appUrl}/${locale}/products`)}
    `, locale);
  },

  'order-confirmation': ({ order, locale, appUrl }) => {
    const isAr = locale === 'ar';
    const itemsHtml = (order.items || []).map(item => `
      <tr>
        <td style="padding:8px 0;color:${TEXT_COLOR};font-size:14px;border-bottom:1px solid rgba(255,255,255,0.05);">
          ${isAr ? (item.product?.nameAr || item.product?.nameEn) : item.product?.nameEn}
          <span style="color:${TEXT_MUTED};font-size:12px;">&nbsp;×${item.quantity || 1}</span>
        </td>
        <td style="padding:8px 0;text-align:right;color:${BRAND_COLOR};font-weight:700;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.05);">
          $${(item.price * (item.quantity || 1)).toFixed(2)}
        </td>
      </tr>
    `).join('');

    return baseLayout(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">
        ✅ ${isAr ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
      </h1>
      <p style="margin:0 0 24px;color:${TEXT_MUTED};font-size:15px;">
        ${isAr ? 'رقم الطلب:' : 'Order number:'} <strong style="color:${BRAND_COLOR};">#${order.orderNumber}</strong>
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        ${itemsHtml}
        <tr>
          <td style="padding:12px 0 0;font-weight:700;color:#fff;font-size:15px;">
            ${isAr ? 'الإجمالي' : 'Total'}
          </td>
          <td style="padding:12px 0 0;text-align:right;font-weight:800;color:${BRAND_COLOR};font-size:18px;">
            $${(order.total || 0).toFixed(2)}
          </td>
        </tr>
      </table>
      ${order.deliveryData ? `
        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px;margin:0 0 24px;">
          <p style="margin:0 0 8px;font-weight:700;color:#10B981;font-size:14px;">
            🔑 ${isAr ? 'بيانات التسليم' : 'Delivery Data'}
          </p>
          <code style="font-size:13px;color:${TEXT_COLOR};word-break:break-all;">${order.deliveryData}</code>
        </div>
      ` : ''}
      ${button(isAr ? 'عرض الطلب' : 'View Order', `${appUrl}/${locale}/account/orders`)}
    `, locale);
  },

  'renewal-reminder': ({ subscription, daysLeft, locale, appUrl }) => {
    const isAr = locale === 'ar';
    const urgencyColor = daysLeft <= 1 ? '#EF4444' : daysLeft <= 3 ? '#F59E0B' : BRAND_COLOR;
    return baseLayout(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">
        ⏰ ${isAr ? 'تذكير بالتجديد' : 'Renewal Reminder'}
      </h1>
      <p style="margin:0 0 24px;color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
        ${isAr
          ? `اشتراكك في <strong>${subscription.product?.nameAr || subscription.product?.nameEn}</strong> ينتهي خلال <strong style="color:${urgencyColor};">${daysLeft}</strong> ${daysLeft === 1 ? 'يوم' : 'أيام'}.`
          : `Your <strong>${subscription.product?.nameEn}</strong> subscription expires in <strong style="color:${urgencyColor};">${daysLeft}</strong> day${daysLeft === 1 ? '' : 's'}.`}
      </p>
      ${button(isAr ? 'تجديد الآن' : 'Renew Now', `${appUrl}/${locale}/products`)}
    `, locale);
  },
};

export function getEmailTemplate(type, data) {
  const templateFn = templates[type];
  if (!templateFn) throw new Error(`Email template "${type}" not found`);
  return templateFn(data);
}
