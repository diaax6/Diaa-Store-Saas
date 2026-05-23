import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    let prisma;
    try {
      prisma = (await import('@/lib/prisma')).default;
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      // Demo mode
      return NextResponse.json({
        success: true,
        data: {
          totalCustomers: 342,
          totalOrders: 1580,
          todayOrders: 28,
          totalProducts: 12,
          activeSubscriptions: 234,
          lowStockProducts: 5,
          totalRevenue: 42500,
          todayRevenue: 1240,
          monthlyRevenue: 18500,
          conversionRate: 68,
          plan: auth.tenant?.plan || 'BUSINESS',
          recentOrders: [
            { orderNumber: 'ORD-001', customer: { name: 'Ahmed Mohamed' }, items: [{ product: { nameEn: 'ChatGPT Plus' } }], total: 12, status: 'COMPLETED', createdAt: new Date().toISOString() },
            { orderNumber: 'ORD-002', customer: { name: 'Sara Ali' }, items: [{ product: { nameEn: 'Adobe CC' } }], total: 25, status: 'PENDING', createdAt: new Date().toISOString() },
            { orderNumber: 'ORD-003', customer: { name: 'Omar Hassan' }, items: [{ product: { nameEn: 'Spotify Premium' } }], total: 8, status: 'COMPLETED', createdAt: new Date(Date.now() - 3600000).toISOString() },
            { orderNumber: 'ORD-004', customer: { name: 'Mona Khaled' }, items: [{ product: { nameEn: 'Netflix Premium' } }], total: 10, status: 'PROCESSING', createdAt: new Date(Date.now() - 7200000).toISOString() },
            { orderNumber: 'ORD-005', customer: { name: 'Youssef Tarek' }, items: [{ product: { nameEn: 'Microsoft 365' } }], total: 13, status: 'COMPLETED', createdAt: new Date(Date.now() - 10800000).toISOString() },
          ],
          topProducts: [
            { nameEn: 'ChatGPT Plus', image: null, orderCount: 156 },
            { nameEn: 'Adobe Creative Cloud', image: null, orderCount: 89 },
            { nameEn: 'Spotify Premium', image: null, orderCount: 67 },
            { nameEn: 'Netflix Premium', image: null, orderCount: 52 },
          ],
        },
        demo: true,
      });
    }

    const tenantId = auth.tenant?.id;
    const tenantWhere = tenantId ? { tenantId } : {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalCustomers, totalOrders, todayOrders, totalProducts, activeSubscriptions] = await Promise.all([
      prisma.customer.count({ where: tenantWhere }),
      prisma.order.count({ where: tenantWhere }),
      prisma.order.count({ where: { ...tenantWhere, createdAt: { gte: today } } }),
      prisma.product.count({ where: { ...tenantWhere, isActive: true } }),
      prisma.subscription.count({ where: { ...tenantWhere, status: 'ACTIVE' } }),
    ]);

    const revenue = await prisma.order.aggregate({
      where: { ...tenantWhere, status: 'COMPLETED' },
      _sum: { total: true },
    });

    const todayRevenue = await prisma.order.aggregate({
      where: { ...tenantWhere, status: 'COMPLETED', createdAt: { gte: today } },
      _sum: { total: true },
    });

    const monthlyRevenue = await prisma.order.aggregate({
      where: { ...tenantWhere, status: 'COMPLETED', createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    });

    // Low stock — products with < 5 available inventory
    const productsWithLowStock = await prisma.product.findMany({
      where: { ...tenantWhere, isActive: true },
      include: {
        _count: { select: { inventory: { where: { status: 'AVAILABLE' } } } },
      },
    });
    const lowStockProducts = productsWithLowStock.filter(p => p._count.inventory < 5).length;

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      where: tenantWhere,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        items: { include: { product: { select: { nameEn: true, nameAr: true, image: true } } } },
      },
    });

    // Conversion rate (completed / total)
    const completedOrders = await prisma.order.count({ where: { ...tenantWhere, status: 'COMPLETED' } });
    const conversionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCustomers,
        totalOrders,
        todayOrders,
        totalProducts,
        activeSubscriptions,
        lowStockProducts,
        totalRevenue: revenue._sum.total || 0,
        todayRevenue: todayRevenue._sum.total || 0,
        monthlyRevenue: monthlyRevenue._sum.total || 0,
        conversionRate,
        plan: auth.tenant?.plan || 'FREE',
        recentOrders,
        topProducts: [],
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
