import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-guard';
import { checkLimit } from '@/lib/plan-limits';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const tenantSlug = searchParams.get('tenant') || 'main';

    // Resolve tenant
    let tenantId;
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true },
      });
      tenantId = tenant?.id;
    } catch {
      tenantId = null;
    }

    const where = { isActive: true };
    if (tenantId) where.tenantId = tenantId;
    if (category) where.categoryId = category;
    if (featured === 'true') where.isFeatured = true;

    let products;
    try {
      products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          pricing: { where: { isActive: true }, orderBy: { durationMonths: 'asc' } },
          _count: { select: { inventory: { where: { status: 'AVAILABLE' } } } },
        },
        orderBy: { sortOrder: 'asc' },
      });
    } catch {
      // Demo fallback
      return NextResponse.json({ success: true, data: [], demo: true });
    }

    let result = products;
    if (search) {
      const s = search.toLowerCase();
      result = products.filter(p =>
        p.nameEn.toLowerCase().includes(s) ||
        p.nameAr.includes(s) ||
        p.brand?.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({ success: true, data: result });
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

    // Check plan limits
    const limitCheck = await checkLimit(prisma, tenantId, 'products');
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, error: limitCheck.message, upgrade: true }, { status: 403 });
    }

    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, image, brand, categoryId, isFeatured, pricing } = body;

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

    const product = await prisma.product.create({
      data: {
        tenantId,
        nameEn, nameAr, descriptionEn, descriptionAr, image, brand,
        slug, categoryId, isFeatured: isFeatured || false,
        pricing: {
          create: (pricing || []).map(p => ({
            durationMonths: p.durationMonths,
            durationLabel: p.durationLabel,
            price: p.price,
            comparePrice: p.comparePrice,
          })),
        },
      },
      include: { pricing: true },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
