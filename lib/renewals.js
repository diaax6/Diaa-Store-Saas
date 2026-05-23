/**
 * Renewal Check Service
 * Runs daily to check expiring subscriptions and send reminders
 */
import prisma from './prisma';
import { getBotInstance } from './telegram';

function daysRemaining(date) {
  const now = new Date();
  const then = new Date(date);
  return Math.ceil((then - now) / (1000 * 60 * 60 * 24));
}

const REMINDER_DAYS = [7, 3, 1, 0]; // Days before expiry to send reminders

export async function checkRenewals() {
  try {
    const tokenSetting = await prisma.setting.findUnique({ where: { key: 'telegram_bot_token' } });
    const bot = tokenSetting?.value ? await getBotInstance(tokenSetting.value) : null;

    // Get active subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: { customer: true, product: true },
    });

    const results = { reminded: 0, autoRenewed: 0, expired: 0 };

    for (const sub of subscriptions) {
      const days = daysRemaining(sub.expiresAt);

      // Auto-renew
      if (days <= 0 && sub.autoRenew) {
        // Check wallet balance
        const customer = sub.customer;
        const pricing = await prisma.productPricing.findFirst({
          where: { productId: sub.productId, isActive: true },
          orderBy: { durationMonths: 'asc' },
        });

        if (pricing && Number(customer.walletBalance) >= Number(pricing.price)) {
          // Find available inventory
          const inventoryItem = await prisma.inventoryItem.findFirst({
            where: { productId: sub.productId, status: 'AVAILABLE' },
          });

          if (inventoryItem) {
            // Deduct wallet
            await prisma.customer.update({
              where: { id: customer.id },
              data: { walletBalance: { decrement: pricing.price } },
            });

            // Create wallet transaction
            await prisma.walletTransaction.create({
              data: {
                customerId: customer.id,
                amount: -Number(pricing.price),
                type: 'RENEWAL',
                description: `Auto-renewal: ${sub.product.nameEn}`,
              },
            });

            // Update subscription
            const newExpiry = new Date(sub.expiresAt);
            newExpiry.setMonth(newExpiry.getMonth() + pricing.durationMonths);

            await prisma.subscription.update({
              where: { id: sub.id },
              data: { expiresAt: newExpiry, inventoryItemId: inventoryItem.id },
            });

            // Mark inventory as sold
            await prisma.inventoryItem.update({
              where: { id: inventoryItem.id },
              data: { status: 'SOLD', soldToId: customer.id, soldAt: new Date() },
            });

            // Notify via Telegram
            if (bot && customer.telegramId) {
              await bot.sendMessage(customer.telegramId,
                `✅ <b>Auto-Renewed!</b>\n\n🔑 ${sub.product.nameEn}\n💰 $${pricing.price}\n📅 New expiry: ${newExpiry.toISOString().split('T')[0]}`
              );
            }

            results.autoRenewed++;
            continue;
          }
        }
      }

      // Expire subscription
      if (days <= 0) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'EXPIRED' },
        });

        if (bot && sub.customer.telegramId) {
          await bot.sendMessage(sub.customer.telegramId,
            `❌ <b>Subscription Expired</b>\n\n🔑 ${sub.product.nameEn}\n\nRenew now to restore access!`
          );
        }

        results.expired++;
        continue;
      }

      // Send reminders
      if (REMINDER_DAYS.includes(days) && bot && sub.customer.telegramId) {
        await bot.sendRenewalReminder(sub.customer.telegramId, {
          id: sub.id,
          productName: sub.product.nameEn,
          expiresAt: sub.expiresAt.toISOString().split('T')[0],
        }, days);
        results.reminded++;
      }
    }

    return results;
  } catch (error) {
    console.error('Renewal check error:', error);
    return { error: error.message };
  }
}
