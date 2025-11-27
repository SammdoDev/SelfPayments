import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Menu ID is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .schema('restaurant')
    .from('menu_items')
    .delete()
    .eq('menu_id', id);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'Menu item deleted successfully',
  });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .schema('restaurant')
    .from('menu_items')
    .update(body)
    .eq('menu_id', id)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ success: true, data });
}