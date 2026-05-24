const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const adapter = new PrismaPg(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding platform database...')

  // 1. Create Super Admin
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.platformAdmin.upsert({
    where: { email: 'admin@diaastore.com' },
    update: {},
    create: {
      name: 'Diaa',
      email: 'admin@diaastore.com',
      passwordHash: adminPassword,
      role: 'PLATFORM_SUPER_ADMIN',
    },
  })
  console.log('✅ Super Admin created:', admin.email)

  // 2. Create default features
  const features = [
    { key: 'manual_delivery', name: 'Manual Delivery', nameAr: 'تسليم يدوي', category: 'DELIVERY' },
    { key: 'auto_delivery', name: 'Auto Delivery', nameAr: 'تسليم تلقائي', category: 'DELIVERY' },
    { key: 'stock_management', name: 'Stock Management', nameAr: 'إدارة المخزون', category: 'GENERAL' },
    { key: 'stock_templates', name: 'Stock Templates', nameAr: 'قوالب المخزون', category: 'GENERAL' },
    { key: 'redeem_codes', name: 'Redeem Codes', nameAr: 'أكواد الاسترداد', category: 'GENERAL' },
    { key: 'offers', name: 'Offers & Promotions', nameAr: 'العروض والخصومات', category: 'GENERAL' },
    { key: 'telegram_bot', name: 'Telegram Bot', nameAr: 'بوت تليجرام', category: 'COMMUNICATION' },
    { key: 'sms_notifications', name: 'SMS Notifications', nameAr: 'إشعارات SMS', category: 'COMMUNICATION' },
    { key: 'email_notifications', name: 'Email Notifications', nameAr: 'إشعارات بريد', category: 'COMMUNICATION' },
    { key: 'custom_domain', name: 'Custom Domain', nameAr: 'دومين مخصص', category: 'ADVANCED' },
    { key: 'api_access', name: 'API Access', nameAr: 'وصول API', category: 'ADVANCED' },
    { key: 'white_label', name: 'White Label', nameAr: 'بدون براندنج', category: 'ADVANCED' },
    { key: 'priority_support', name: 'Priority Support', nameAr: 'دعم أولوية', category: 'ADVANCED' },
    { key: 'analytics', name: 'Advanced Analytics', nameAr: 'تحليلات متقدمة', category: 'ADVANCED' },
    { key: 'multi_staff', name: 'Multiple Staff', nameAr: 'فريق عمل', category: 'GENERAL' },
    { key: 'customer_accounts', name: 'Customer Accounts', nameAr: 'حسابات العملاء', category: 'GENERAL' },
  ]

  for (const f of features) {
    await prisma.platformFeature.upsert({
      where: { key: f.key },
      update: {},
      create: f,
    })
  }
  console.log('✅ Platform features created:', features.length)

  // 3. Create default plans
  const plans = [
    {
      name: 'Basic',
      nameAr: 'أساسية',
      description: 'للبداية — مناسب للمتاجر الصغيرة',
      price: 99,
      billingCycle: 'MONTHLY',
      maxProducts: 20,
      maxOrders: 100,
      maxStaff: 2,
      maxCategories: 5,
      storageGB: 1,
      features: JSON.stringify(['manual_delivery', 'stock_management', 'customer_accounts']),
      isDefault: true,
      sortOrder: 1,
    },
    {
      name: 'Pro',
      nameAr: 'احترافية',
      description: 'للمتاجر المتوسطة — ميزات أكتر',
      price: 249,
      billingCycle: 'MONTHLY',
      maxProducts: 100,
      maxOrders: 1000,
      maxStaff: 5,
      maxCategories: 20,
      storageGB: 5,
      features: JSON.stringify([
        'manual_delivery', 'auto_delivery', 'stock_management', 'stock_templates',
        'redeem_codes', 'offers', 'telegram_bot', 'multi_staff', 'customer_accounts', 'analytics',
      ]),
      sortOrder: 2,
    },
    {
      name: 'Enterprise',
      nameAr: 'مؤسسات',
      description: 'للمتاجر الكبيرة — كل الميزات',
      price: 499,
      billingCycle: 'MONTHLY',
      maxProducts: -1,
      maxOrders: -1,
      maxStaff: -1,
      maxCategories: -1,
      storageGB: 50,
      features: JSON.stringify([
        'manual_delivery', 'auto_delivery', 'stock_management', 'stock_templates',
        'redeem_codes', 'offers', 'telegram_bot', 'sms_notifications', 'email_notifications',
        'custom_domain', 'api_access', 'white_label', 'priority_support', 'analytics',
        'multi_staff', 'customer_accounts',
      ]),
      sortOrder: 3,
    },
  ]

  for (const p of plans) {
    const existing = await prisma.plan.findFirst({ where: { name: p.name } })
    if (!existing) {
      await prisma.plan.create({ data: p })
    }
  }
  console.log('✅ Default plans created')

  console.log('\n🎉 Seed completed!')
  console.log('📧 Login: admin@diaastore.com')
  console.log('🔑 Password: admin123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
