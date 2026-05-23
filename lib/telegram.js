/**
 * Telegram Bot Service for Diaa Store
 * Handles sales via Telegram, notifications, and renewal reminders
 */

const TELEGRAM_API = 'https://api.telegram.org/bot';

export class TelegramBot {
  constructor(token) {
    this.token = token;
    this.baseUrl = `${TELEGRAM_API}${token}`;
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      const res = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          ...options,
        }),
      });
      return await res.json();
    } catch (error) {
      console.error('Telegram sendMessage error:', error);
      return null;
    }
  }

  async sendInlineKeyboard(chatId, text, buttons) {
    return this.sendMessage(chatId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  // ── Notification Templates ──

  async sendOrderConfirmation(chatId, order) {
    const text = `
✅ <b>Order Confirmed!</b>

📦 Order: <code>#${order.id}</code>
🛍️ Items: ${order.items.join(', ')}
💰 Total: <b>$${order.total}</b>
💳 Payment: ${order.payment}

${order.deliveryData ? `\n🔑 <b>Your Access:</b>\n<code>${order.deliveryData}</code>` : ''}

Thank you for your purchase! 🎉
    `.trim();

    return this.sendMessage(chatId, text);
  }

  async sendRenewalReminder(chatId, subscription, daysLeft) {
    const urgency = daysLeft <= 1 ? '🚨' : daysLeft <= 3 ? '⚠️' : '📢';
    const text = `
${urgency} <b>Subscription Expiring!</b>

🔑 ${subscription.productName}
⏰ Expires in: <b>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</b>
📅 Date: ${subscription.expiresAt}

Renew now to avoid service interruption!
    `.trim();

    const buttons = [[
      { text: '🔄 Renew Now', callback_data: `renew_${subscription.id}` },
      { text: '❌ Cancel', callback_data: `cancel_${subscription.id}` },
    ]];

    return this.sendInlineKeyboard(chatId, text, buttons);
  }

  async sendNewOrderNotification(channelId, order) {
    const text = `
🛒 <b>New Order!</b>

📦 Order: <code>#${order.id}</code>
👤 Customer: ${order.customerName}
🛍️ ${order.items.join(', ')}
💰 Total: <b>$${order.total}</b>
💳 ${order.payment}
    `.trim();

    return this.sendMessage(channelId, text);
  }

  async sendWelcome(chatId, storeName) {
    const text = `
🎉 <b>Welcome to ${storeName}!</b>

🛍️ Browse our products and get instant delivery!

Commands:
/start - Main menu
/products - Browse products
/orders - My orders
/wallet - Wallet balance
/help - Get help
    `.trim();

    const buttons = [[
      { text: '🛍️ Products', callback_data: 'products' },
      { text: '📦 My Orders', callback_data: 'orders' },
    ], [
      { text: '💰 Wallet', callback_data: 'wallet' },
      { text: '❓ Help', callback_data: 'help' },
    ]];

    return this.sendInlineKeyboard(chatId, text, buttons);
  }

  async sendProductList(chatId, products) {
    let text = '🛍️ <b>Our Products:</b>\n\n';
    products.forEach((p, i) => {
      text += `${i + 1}. ${p.icon || '📦'} <b>${p.name}</b> — $${p.price}/mo\n`;
    });
    text += '\nSelect a product to purchase:';

    const buttons = products.map(p => ([
      { text: `${p.icon || '📦'} ${p.name} — $${p.price}`, callback_data: `buy_${p.id}` },
    ]));

    return this.sendInlineKeyboard(chatId, text, buttons);
  }

  // ── Webhook Processing ──

  async processUpdate(update) {
    if (update.message) {
      return this.handleMessage(update.message);
    }
    if (update.callback_query) {
      return this.handleCallback(update.callback_query);
    }
    return null;
  }

  async handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text || '';

    switch (text) {
      case '/start':
        return { action: 'welcome', chatId };
      case '/products':
        return { action: 'products', chatId };
      case '/orders':
        return { action: 'orders', chatId };
      case '/wallet':
        return { action: 'wallet', chatId };
      case '/help':
        return { action: 'help', chatId };
      default:
        return { action: 'unknown', chatId, text };
    }
  }

  async handleCallback(callback) {
    const chatId = callback.message.chat.id;
    const data = callback.data;

    if (data.startsWith('buy_')) {
      return { action: 'buy', chatId, productId: data.replace('buy_', '') };
    }
    if (data.startsWith('renew_')) {
      return { action: 'renew', chatId, subscriptionId: data.replace('renew_', '') };
    }
    if (data === 'products') return { action: 'products', chatId };
    if (data === 'orders') return { action: 'orders', chatId };
    if (data === 'wallet') return { action: 'wallet', chatId };
    if (data === 'help') return { action: 'help', chatId };

    return { action: 'unknown_callback', chatId, data };
  }

  // ── Test Connection ──
  async testConnection() {
    try {
      const res = await fetch(`${this.baseUrl}/getMe`);
      const data = await res.json();
      return data.ok ? { success: true, bot: data.result } : { success: false, error: data.description };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Get bot instance from settings
 */
export async function getBotInstance(token) {
  if (!token) return null;
  return new TelegramBot(token);
}
