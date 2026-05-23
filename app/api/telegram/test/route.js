import { NextResponse } from 'next/server';
import { getBotInstance } from '@/lib/telegram';

export async function POST(request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const bot = await getBotInstance(token);
    const result = await bot.testConnection();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
