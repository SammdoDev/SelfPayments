import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || 'today';

  try {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);

    switch (range) {
      case 'yesterday':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setDate(now.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;

      case '7days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;

      default:
        // today
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
    }

    // Query ke Supabase
    const { data, error } = await supabase
      .schema('restaurant')
      .from('orders')
      .select('order_id, status, subtotal, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = data.map((o) => ({
      id: o.order_id,
      message:
        o.status === 'Pending'
          ? 'Pesanan baru masuk'
          : o.status === 'Serve'
          ? 'Pesanan sedang disajikan'
          : o.status === 'Paid'
          ? 'Pesanan telah dibayar'
          : 'Pesanan dibatalkan',
      date: o.created_at,
      status: o.status,
      subtotal: o.subtotal,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
