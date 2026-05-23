/**
 * SaaS Plan Limits — defines what each plan can do
 */

export const PLANS = {
  FREE: {
    name: 'Free',
    nameAr: 'مجاني',
    price: 0,
    priceYearly: 0,
    limits: {
      products: 10,
      orders: 50,         // per month
      staff: 1,
      categories: 3,
      storage: 500,       // MB
      inventory: 100,
      coupons: 5,
    },
    features: {
      customDomain: false,
      removeBranding: false,
      apiAccess: false,
      advancedAnalytics: false,
      autoDelivery: true,
      emailNotifications: true,
      telegramBot: false,
      prioritySupport: false,
      exportData: false,
      bulkImport: false,
    },
  },
  PRO: {
    name: 'Pro',
    nameAr: 'احترافي',
    price: 29,
    priceYearly: 290,     // 2 months free
    limits: {
      products: 100,
      orders: 1000,
      staff: 5,
      categories: -1,      // unlimited
      storage: 5000,
      inventory: 5000,
      coupons: -1,
    },
    features: {
      customDomain: true,
      removeBranding: false,
      apiAccess: true,
      advancedAnalytics: true,
      autoDelivery: true,
      emailNotifications: true,
      telegramBot: true,
      prioritySupport: true,
      exportData: true,
      bulkImport: true,
    },
  },
  BUSINESS: {
    name: 'Business',
    nameAr: 'بيزنس',
    price: 79,
    priceYearly: 790,
    limits: {
      products: -1,
      orders: -1,
      staff: -1,
      categories: -1,
      storage: 50000,
      inventory: -1,
      coupons: -1,
    },
    features: {
      customDomain: true,
      removeBranding: true,
      apiAccess: true,
      advancedAnalytics: true,
      autoDelivery: true,
      emailNotifications: true,
      telegramBot: true,
      prioritySupport: true,
      exportData: true,
      bulkImport: true,
    },
  },
};

/**
 * Check if tenant can create more of an entity
 * @returns {{ allowed: boolean, current: number, limit: number, message: string }}
 */
export async function checkLimit(prisma, tenantId, entity) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true },
  });

  if (!tenant) return { allowed: false, message: 'Tenant not found' };

  const plan = PLANS[tenant.plan] || PLANS.FREE;
  const limit = plan.limits[entity];

  if (limit === -1) return { allowed: true, current: 0, limit: -1 };

  let current = 0;
  const where = { tenantId };

  switch (entity) {
    case 'products':
      current = await prisma.product.count({ where });
      break;
    case 'categories':
      current = await prisma.category.count({ where });
      break;
    case 'staff':
      current = await prisma.staff.count({ where: { tenantId } });
      break;
    case 'coupons':
      current = await prisma.coupon.count({ where });
      break;
    case 'inventory':
      current = await prisma.inventory.count({ where });
      break;
    case 'orders': {
      // Count orders this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      current = await prisma.order.count({
        where: { tenantId, createdAt: { gte: startOfMonth } },
      });
      break;
    }
    default:
      return { allowed: true, current: 0, limit: -1 };
  }

  if (current >= limit) {
    return {
      allowed: false,
      current,
      limit,
      message: `You've reached the ${entity} limit for the ${plan.name} plan (${limit}). Upgrade to add more.`,
    };
  }

  return { allowed: true, current, limit };
}

/**
 * Check if a feature is enabled for a plan
 */
export function isFeatureEnabled(plan, feature) {
  const planConfig = PLANS[plan] || PLANS.FREE;
  return planConfig.features[feature] || false;
}

/**
 * Get plan details
 */
export function getPlanDetails(plan) {
  return PLANS[plan] || PLANS.FREE;
}

/**
 * Get all plans for pricing page
 */
export function getAllPlans() {
  return Object.entries(PLANS).map(([key, plan]) => ({
    id: key,
    ...plan,
  }));
}
