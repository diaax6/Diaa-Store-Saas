import { NextResponse } from 'next/server';
import { checkRenewals } from '@/lib/renewals';

// This endpoint can be called by a cron job (e.g., Vercel Cron, or external cron)
// Run daily: GET /api/cron/renewals?key=SECRET_CRON_KEY
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Simple security — verify cron key
    if (key !== process.env.CRON_SECRET && key !== 'dev-mode') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await checkRenewals();

    return NextResponse.json({
      success: true,
      message: 'Renewal check complete',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
