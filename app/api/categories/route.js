import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-guard';
import { checkLimit } from '@/lib/plan-limits';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || 'main';

    let tenantId;
    try {
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug }, select: { id: true } });
      tenantId = tenant?.id;
    } catch {
      tenantId = null;
    }

    const where = tenantId ? { tenantId } : {};

    let categories;
    try {
      categories = await prisma.category.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: 'asc' },
      });
    } catch {
      return NextResponse.json({
        success: true,
        data: [
          { id: 'c1', nameEn: 'AI Tools', nameAr: 'أدوات ذكاء اصطناعي', icon: '🤖', slug: 'ai-tools', _count: { products: 3 } },
          { id: 'c2', nameEn: 'Streaming', nameAr: 'بث مباشر', icon: '📺', slug: 'streaming', _count: { products: 2 } },
          { id: 'c3', nameEn: 'Design', nameAr: 'تصميم', icon: '🎨', slug: 'design', _count: { products: 2 } },
          { id: 'c4', nameEn: 'Music', nameAr: 'موسيقى', icon: '🎵', slug: 'music', _count: { products: 1 } },
          { id: 'c5', nameEn: 'Productivity', nameAr: 'إنتاجية', icon: '⚡', slug: 'productivity', _count: { products: 2 } },
        ],
        demo: true,
      });
    }

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const tenantId = auth.tenant?.id;
    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 400 });
    }

    const limitCheck = await checkLimit(prisma, tenantId, 'categories');
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, error: limitCheck.message, upgrade: true }, { status: 403 });
    }

    const { nameEn, nameAr, icon, slug } = await request.json();
    const category = await prisma.category.create({
      data: {
        tenantId,
        nameEn, nameAr, icon,
        slug: slug || nameEn.toLowerCase().replace(/\s+/g, '-'),
      },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
