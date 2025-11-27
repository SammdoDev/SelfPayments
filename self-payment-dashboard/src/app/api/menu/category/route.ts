import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .schema("restaurant")
      .from("menu_category")
      .select("category_id, name, is_active, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err: any) {
    console.error("Error fetching menu_category:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch menu categories",
        error: err.message,
      },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, is_active = true } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Field "name" is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .schema('restaurant')
      .from('menu_category')
      .insert([{ name, is_active }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Menu category created successfully',
      data,
    });
  } catch (err: any) {
    console.error('Error creating menu_category:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create menu category', error: err.message },
      { status: 500 }
    );
  }
}
