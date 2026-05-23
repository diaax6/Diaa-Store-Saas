import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear all auth cookies
  response.cookies.set('admin_token', '', { path: '/', maxAge: 0, httpOnly: true });
  response.cookies.set('customer_token', '', { path: '/', maxAge: 0, httpOnly: true });
  response.cookies.set('auth_token', '', { path: '/', maxAge: 0, httpOnly: true });
  
  return response;
}
