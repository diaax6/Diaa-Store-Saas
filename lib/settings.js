import prisma from './prisma';

// Cache settings in memory for performance
let settingsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

// Default settings — used for first setup and fallback
export const defaultSettings = {
  // General
  'store_name': { value: 'Diaa Store', type: 'string', group: 'general' },
  'store_description': { value: 'Your Digital Subscriptions, Simplified', type: 'string', group: 'general' },
  'default_language': { value: 'en', type: 'string', group: 'general' },
  'currency': { value: 'USD', type: 'string', group: 'general' },
  'currency_symbol': { value: '$', type: 'string', group: 'general' },
  'timezone': { value: 'Africa/Cairo', type: 'string', group: 'general' },
  'maintenance_mode': { value: 'false', type: 'boolean', group: 'general' },

  // Appearance
  'color_primary': { value: '#8B5CF6', type: 'color', group: 'appearance' },
  'color_primary_light': { value: '#A78BFA', type: 'color', group: 'appearance' },
  'color_primary_dark': { value: '#7C3AED', type: 'color', group: 'appearance' },
  'color_accent': { value: '#22D3EE', type: 'color', group: 'appearance' },
  'color_bg': { value: '#0A0E1A', type: 'color', group: 'appearance' },
  'logo_url': { value: '', type: 'image', group: 'appearance' },
  'favicon_url': { value: '', type: 'image', group: 'appearance' },
  'border_radius': { value: '10', type: 'number', group: 'appearance' },

  // Notice Bar
  'notice_enabled': { value: 'false', type: 'boolean', group: 'notice' },
  'notice_text_en': { value: '🎉 Welcome to our store! Check out our latest deals.', type: 'string', group: 'notice' },
  'notice_text_ar': { value: '🎉 مرحباً بكم في متجرنا! تصفح أحدث العروض.', type: 'string', group: 'notice' },
  'notice_bg_color': { value: '#8B5CF6', type: 'color', group: 'notice' },
  'notice_link': { value: '', type: 'string', group: 'notice' },

  // Hero
  'hero_title_en': { value: 'Your Digital Subscriptions, Simplified', type: 'string', group: 'hero' },
  'hero_title_ar': { value: 'اشتراكاتك الرقمية، بكل بساطة', type: 'string', group: 'hero' },
  'hero_subtitle_en': { value: 'Get premium digital services at the best prices with instant delivery', type: 'string', group: 'hero' },
  'hero_subtitle_ar': { value: 'احصل على خدمات رقمية مميزة بأفضل الأسعار مع توصيل فوري', type: 'string', group: 'hero' },
  'hero_image': { value: '', type: 'image', group: 'hero' },
  'hero_cta_text_en': { value: 'Browse Products', type: 'string', group: 'hero' },
  'hero_cta_text_ar': { value: 'تصفح المنتجات', type: 'string', group: 'hero' },

  // SEO
  'seo_title': { value: 'Diaa Store — Premium Digital Subscriptions', type: 'string', group: 'seo' },
  'seo_description': { value: 'Get premium digital subscriptions at the best prices. ChatGPT Plus, Adobe CC, Spotify, Netflix and more.', type: 'string', group: 'seo' },
  'seo_og_image': { value: '', type: 'image', group: 'seo' },
  'google_analytics_id': { value: '', type: 'string', group: 'seo' },

  // Integrations
  'telegram_bot_token': { value: '', type: 'string', group: 'integrations' },
  'telegram_channel_id': { value: '', type: 'string', group: 'integrations' },
  'telegram_welcome_msg': { value: 'Welcome to {store_name}! 🎉', type: 'string', group: 'integrations' },
  'stripe_public_key': { value: '', type: 'string', group: 'integrations' },
  'stripe_secret_key': { value: '', type: 'string', group: 'integrations' },
  'crypto_wallet_address': { value: '', type: 'string', group: 'integrations' },
  'crypto_network': { value: 'TRC20', type: 'string', group: 'integrations' },
  'vodafone_cash_number': { value: '', type: 'string', group: 'integrations' },
  'bank_account_info': { value: '', type: 'string', group: 'integrations' },
  'manual_payment_instructions_en': { value: '', type: 'string', group: 'integrations' },
  'manual_payment_instructions_ar': { value: '', type: 'string', group: 'integrations' },

  // Stats (displayed on storefront)
  'stats_customers': { value: '1,200+', type: 'string', group: 'stats' },
  'stats_orders': { value: '5,000+', type: 'string', group: 'stats' },
  'stats_products': { value: '50+', type: 'string', group: 'stats' },

  // Footer
  'footer_text': { value: '© 2025 Diaa Store. All rights reserved.', type: 'string', group: 'footer' },
  'social_telegram': { value: '', type: 'string', group: 'footer' },
  'social_instagram': { value: '', type: 'string', group: 'footer' },
  'social_twitter': { value: '', type: 'string', group: 'footer' },
  'social_whatsapp': { value: '', type: 'string', group: 'footer' },
};

/**
 * Load all settings from DB with caching
 */
export async function getSettings() {
  const now = Date.now();
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache;
  }

  try {
    const dbSettings = await prisma.setting.findMany();
    const settings = {};

    // Start with defaults
    for (const [key, config] of Object.entries(defaultSettings)) {
      settings[key] = config.value;
    }

    // Override with DB values
    for (const setting of dbSettings) {
      settings[setting.key] = setting.value;
    }

    settingsCache = settings;
    cacheTimestamp = now;
    return settings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    // Return defaults on error
    const settings = {};
    for (const [key, config] of Object.entries(defaultSettings)) {
      settings[key] = config.value;
    }
    return settings;
  }
}

/**
 * Get a single setting value
 */
export async function getSetting(key) {
  const settings = await getSettings();
  return settings[key] ?? defaultSettings[key]?.value ?? null;
}

/**
 * Update a setting
 */
export async function updateSetting(key, value) {
  const config = defaultSettings[key] || { type: 'string', group: 'general' };

  await prisma.setting.upsert({
    where: { key },
    update: { value: String(value) },
    create: {
      key,
      value: String(value),
      type: config.type,
      group: config.group,
    },
  });

  // Invalidate cache
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Update multiple settings at once
 */
export async function updateSettings(settingsObj) {
  const operations = Object.entries(settingsObj).map(([key, value]) => {
    const config = defaultSettings[key] || { type: 'string', group: 'general' };
    return prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: {
        key,
        value: String(value),
        type: config.type,
        group: config.group,
      },
    });
  });

  await prisma.$transaction(operations);

  // Invalidate cache
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Get settings by group
 */
export async function getSettingsByGroup(group) {
  const allSettings = await getSettings();
  const result = {};

  for (const [key, config] of Object.entries(defaultSettings)) {
    if (config.group === group) {
      result[key] = allSettings[key] ?? config.value;
    }
  }

  return result;
}

/**
 * Seed default settings into DB
 */
export async function seedSettings() {
  const existing = await prisma.setting.findMany();
  const existingKeys = new Set(existing.map(s => s.key));

  const toCreate = [];
  for (const [key, config] of Object.entries(defaultSettings)) {
    if (!existingKeys.has(key)) {
      toCreate.push({
        key,
        value: config.value,
        type: config.type,
        group: config.group,
      });
    }
  }

  if (toCreate.length > 0) {
    await prisma.setting.createMany({ data: toCreate });
  }

  // Invalidate cache
  settingsCache = null;
  cacheTimestamp = 0;
}
