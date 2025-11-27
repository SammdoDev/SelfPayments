import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/lib/supabaseClient';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ category_id: string }> } 
) {
  const { category_id } = await context.params; 

  if (!category_id) {
    return NextResponse.json(
      { success: false, message: 'Category ID is required' },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .schema('restaurant')
      .from('menu_category')
      .delete()
      .eq('category_id', category_id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Menu category deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete menu category', error: err.message },
      { status: 500 }
    );
  }
}


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { category_id, name, is_active } = body;

    if (!category_id || !name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Fields "category_id" and "name" are required',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .schema("restaurant")
      .from("menu_category")
      .update({ name, is_active })
      .eq("category_id", category_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Menu category updated successfully",
      data,
    });
  } catch (err: any) {
    console.error("Error updating menu_category:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update menu category",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
