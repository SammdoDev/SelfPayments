import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'today';
    const orderId = searchParams.get('order_id');

    const today = new Date();
    let fromDate = new Date(today);
    let toDate = new Date(today);

    if (range === 'today') {
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
    } else if (range === 'yesterday') {
      fromDate.setDate(today.getDate() - 1);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setDate(today.getDate() - 1);
      toDate.setHours(23, 59, 59, 999);
    } else if (range === '7days') {
      fromDate.setDate(today.getDate() - 7);
    }

    let query = supabase
      .schema('restaurant')
      .from('orders_items')
      .select(`
        orders_item_id,
        order_id,
        quantity,
        price,
        subtotal,
        created_at,
        menu_items (
          menu_id,
          menu_name
        )
      `)
      .gte('created_at', fromDate.toISOString())
      .lte('created_at', toDate.toISOString())
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err: any) {
    console.error('Error fetching orders_items:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order items', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, menu_id, quantity, price } = body;

    if (!order_id || !menu_id || !quantity || !price) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .schema('restaurant')
      .from('orders_items')
      .insert([
        {
          order_id,
          menu_id,
          quantity,
          price,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Order item created successfully',
      data: data[0],
    });
  } catch (err: any) {
    console.error('Error creating order item:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create order item', error: err.message },
      { status: 500 }
    );
  }
}
