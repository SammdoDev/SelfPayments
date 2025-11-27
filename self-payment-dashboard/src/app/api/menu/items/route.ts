import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

type MenuCategory = {
  category_id: string;
  name: string;
  is_active: boolean;
};

type MenuItemWithCategory = {
  menu_id: number;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  menu_category?: MenuCategory | MenuCategory[];
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category_id');

    let query = supabase
      .schema('restaurant')
      .from('menu_items')
      .select(`
        menu_id,
        category_id,
        name,
        description,
        price,
        is_active,
        image_url,
        created_at,
        menu_category (
          category_id, 
          name, 
          is_active
        )
      `)
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const filteredData = (data as MenuItemWithCategory[]).filter(item => {
      const cat = item.menu_category;
      if (!cat) return false;
      if (Array.isArray(cat)) {
        return cat.some((c: MenuCategory) => c.is_active);
      }
      return cat.is_active === true;
    });

    return NextResponse.json({
      success: true,
      count: filteredData.length,
      data: filteredData,
    });
  } catch (err: any) {
    console.error('Error fetching menu items:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch menu items', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category_id, name, description, price, is_active = true, image_url } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'Fields "name" and "price" are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .schema('restaurant')
      .from('menu_items')
      .insert([
        {
          category_id,
          name,
          description,
          price,
          is_active,
          image_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Menu item created successfully',
      data,
    });
  } catch (err: any) {
    console.error('Error creating menu item:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create menu item', error: err.message },
      { status: 500 }
    );
  }
}
