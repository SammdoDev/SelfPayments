import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Menu API root is working',
    endpoints: ['/api/menu/category', '/api/menu/items'],
  });
}
