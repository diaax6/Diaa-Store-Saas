import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'customerId required' }, { status: 400 });
    }

    let prisma;
    try {
      prisma = (await import('@/lib/prisma')).default;
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      // Demo fallback
      return NextResponse.json({
        success: true,
        balance: 45.00,
        transactions: [
          { id: '1', type: 'CREDIT', amount: 50, description: 'Manual Top-up', createdAt: '2025-05-18' },
          { id: '2', type: 'DEBIT', amount: -12, description: 'ChatGPT Plus (1 month)', createdAt: '2025-05-17' },
          { id: '3', type: 'CREDIT', amount: 20, description: 'Referral Bonus', createdAt: '2025-05-15' },
        ],
      });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { customerId },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });

    return NextResponse.json({
      success: true,
      balance: wallet?.balance || 0,
      transactions: wallet?.transactions || [],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const { customerId, amount, type, description } = await request.json();

    if (!customerId || !amount) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    // Ensure wallet exists
    let wallet = await prisma.wallet.findUnique({ where: { customerId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { customerId, balance: 0 } });
    }

    const txAmount = type === 'CREDIT' ? Math.abs(amount) : -Math.abs(amount);

    const [transaction] = await prisma.$transaction([
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: txAmount,
          type: type || 'CREDIT',
          description: description || `${type} by admin`,
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: type === 'CREDIT'
            ? { increment: Math.abs(amount) }
            : { decrement: Math.abs(amount) },
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
