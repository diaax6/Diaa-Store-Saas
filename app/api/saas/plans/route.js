import { NextResponse } from 'next/server';
import { getAllPlans } from '@/lib/plan-limits';

export async function GET() {
  const plans = getAllPlans();
  return NextResponse.json({ success: true, data: plans });
}
