/**
 * Auto-Delivery Engine
 * Handles automatic delivery of digital products after payment confirmation.
 * 
 * Flow:
 * 1. Customer completes payment → order status = PAID
 * 2. Engine checks if product has autoDeliver = true
 * 3. Pulls next available item from inventory
 * 4. Delivers to customer (email/order page)
 * 5. Updates inventory stock count
 * 6. Logs activity
 * 
 * For SaaS deployment, this would be triggered by a webhook
 * from the payment provider (Stripe, PayPal, etc.)
 */

// Simulated inventory pool (in production, this comes from DB)
const inventoryPool = {};

/**
 * Process auto-delivery for a completed order
 * @param {Object} order - The order to process
 * @param {Array} inventory - Available inventory items
 * @returns {Object} - Delivery result
 */
export async function processAutoDelivery(order, inventory) {
  const result = {
    success: false,
    deliveryData: null,
    error: null,
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. Find available item in inventory for this product
    const availableItem = inventory.find(item => 
      item.productId === order.productId && 
      item.status === 'available'
    );

    if (!availableItem) {
      result.error = 'NO_STOCK';
      result.message = `No available inventory for product "${order.productName}"`;
      
      // Trigger stock alert
      await triggerStockAlert(order.productId, order.productName, 0);
      
      return result;
    }

    // 2. Mark item as sold
    availableItem.status = 'sold';
    availableItem.orderId = order.id;
    availableItem.soldAt = new Date().toISOString();

    // 3. Prepare delivery data
    result.deliveryData = {
      type: availableItem.type, // 'account' or 'cdk'
      data: availableItem.type === 'account' 
        ? { email: availableItem.email, password: availableItem.password }
        : { key: availableItem.key },
      expiresAt: availableItem.expiresAt,
      deliveredAt: new Date().toISOString(),
    };

    // 4. Check remaining stock for alerts
    const remainingStock = inventory.filter(item => 
      item.productId === order.productId && 
      item.status === 'available'
    ).length;

    if (remainingStock <= 3) {
      await triggerStockAlert(order.productId, order.productName, remainingStock);
    }

    result.success = true;
    result.remainingStock = remainingStock;

    // 5. Log activity
    logDeliveryActivity({
      type: 'AUTO_DELIVERY',
      orderId: order.id,
      productName: order.productName,
      customerEmail: order.customerEmail,
      status: 'SUCCESS',
      timestamp: result.timestamp,
    });

  } catch (error) {
    result.error = 'DELIVERY_FAILED';
    result.message = error.message;
    
    logDeliveryActivity({
      type: 'AUTO_DELIVERY',
      orderId: order.id,
      productName: order.productName,
      status: 'FAILED',
      error: error.message,
      timestamp: result.timestamp,
    });
  }

  return result;
}

/**
 * Trigger stock alert via configured channels (Telegram, Email, etc.)
 */
export async function triggerStockAlert(productId, productName, remainingStock) {
  const alert = {
    type: 'STOCK_ALERT',
    productId,
    productName,
    remainingStock,
    severity: remainingStock === 0 ? 'CRITICAL' : remainingStock <= 3 ? 'WARNING' : 'INFO',
    message: remainingStock === 0 
      ? `🚨 CRITICAL: "${productName}" is OUT OF STOCK! Restock immediately.`
      : `⚠️ WARNING: "${productName}" has only ${remainingStock} items remaining.`,
    timestamp: new Date().toISOString(),
  };

  // Store alert for the admin notification bell
  const storedAlerts = JSON.parse(localStorage.getItem('admin_stock_alerts') || '[]');
  storedAlerts.unshift(alert);
  localStorage.setItem('admin_stock_alerts', JSON.stringify(storedAlerts.slice(0, 50)));

  // In production: Send to Telegram, Email, Slack, etc.
  // await sendTelegramAlert(alert);
  // await sendEmailAlert(alert);

  console.log(`[Stock Alert] ${alert.message}`);
  return alert;
}

/**
 * Log delivery activity for audit trail
 */
function logDeliveryActivity(activity) {
  const logs = JSON.parse(localStorage.getItem('delivery_logs') || '[]');
  logs.unshift(activity);
  localStorage.setItem('delivery_logs', JSON.stringify(logs.slice(0, 200)));
}

/**
 * Get delivery logs for display in admin panel
 */
export function getDeliveryLogs() {
  return JSON.parse(localStorage.getItem('delivery_logs') || '[]');
}

/**
 * Get pending stock alerts
 */
export function getStockAlerts() {
  return JSON.parse(localStorage.getItem('admin_stock_alerts') || '[]');
}

/**
 * Batch check all products for low stock
 * Run this on admin dashboard load
 */
export function checkAllStockLevels(products, threshold = 3) {
  const alerts = [];
  
  products.forEach(product => {
    if (product.stock <= threshold) {
      alerts.push({
        productId: product.id,
        productName: product.nameEn,
        currentStock: product.stock,
        severity: product.stock === 0 ? 'CRITICAL' : 'WARNING',
        message: product.stock === 0
          ? `${product.nameEn} is OUT OF STOCK`
          : `${product.nameEn} has only ${product.stock} items left`,
      });
    }
  });

  return alerts;
}
