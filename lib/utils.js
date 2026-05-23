/**
 * Generate a unique order number
 */
export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Generate a slug from text
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'USD', symbol = '$') {
  return `${symbol}${Number(amount).toFixed(2)}`;
}

/**
 * Calculate days remaining
 */
export function daysRemaining(expiresAt) {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Paginate query results
 */
export function getPagination(page = 1, limit = 20) {
  const skip = (Math.max(1, page) - 1) * limit;
  return { skip, take: limit };
}
