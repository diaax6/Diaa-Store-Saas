import { NextResponse } from 'next/server';
import { getBotInstance } from '@/lib/telegram';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    // Get bot token from settings
    const tokenSetting = await prisma.setting.findUnique({ where: { key: 'telegram_bot_token' } });
    if (!tokenSetting?.value) {
      return NextResponse.json({ error: 'Bot not configured' }, { status: 400 });
    }

    const bot = await getBotInstance(tokenSetting.value);
    const update = await request.json();
    const result = await bot.processUpdate(update);

    if (!result) return NextResponse.json({ ok: true });

    const storeNameSetting = await prisma.setting.findUnique({ where: { key: 'store_name' } });
    const storeName = storeNameSetting?.value || 'Diaa Store';

    switch (result.action) {
      case 'welcome':
        await bot.sendWelcome(result.chatId, storeName);
        break;

      case 'products': {
        const products = await prisma.product.findMany({
          where: { isActive: true },
          include: { pricing: { where: { isActive: true }, orderBy: { price: 'asc' }, take: 1 } },
          take: 10,
        });
        const productList = products.map(p => ({
          id: p.id, name: p.nameEn, icon: p.image,
          price: p.pricing[0]?.price || 0,
        }));
        await bot.sendProductList(result.chatId, productList);
        break;
      }

      case 'orders': {
        const customer = await prisma.customer.findFirst({
          where: { telegramId: String(result.chatId) },
          include: { orders: { take: 5, orderBy: { createdAt: 'desc' } } },
        });
        if (!customer || customer.orders.length === 0) {
          await bot.sendMessage(result.chatId, '📦 No orders found.\n\nUse /products to browse our catalog!');
        } else {
          let text = '📦 <b>Your Recent Orders:</b>\n\n';
          customer.orders.forEach(o => {
            text += `#${o.orderNumber} — $${o.totalAmount} — ${o.status}\n`;
          });
          await bot.sendMessage(result.chatId, text);
        }
        break;
      }

      case 'wallet': {
        const cust = await prisma.customer.findFirst({ where: { telegramId: String(result.chatId) } });
        const balance = cust?.walletBalance || 0;
        await bot.sendMessage(result.chatId, `💰 <b>Wallet Balance:</b> $${balance.toFixed(2)}`);
        break;
      }

      case 'help':
        await bot.sendMessage(result.chatId, `❓ <b>Need Help?</b>\n\nContact us via the website or send a message here!\n\n🌐 ${storeName}`);
        break;

      default:
        await bot.sendMessage(result.chatId, '🤔 Unknown command. Use /start to see available options.');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
