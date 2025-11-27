import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, menu_id, quantity } = body;

    if (!order_id || !menu_id || !quantity) {
      return NextResponse.json(
        {
          success: false,
          message: 'Field "order_id", "menu_id", dan "quantity" wajib diisi',
        },
        { status: 400 }
      );
    }

    const { data: orderCheck, error: orderError } = await supabaseServer
      .schema("restaurant")
      .from("orders")
      .select("order_id")
      .eq("order_id", order_id)
      .single();

    if (orderError || !orderCheck) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID tidak ditemukan atau tidak valid",
        },
        { status: 400 }
      );
    }

    const { data: menuCheck, error: menuError } = await supabaseServer
      .schema("restaurant")
      .from("menu_items")
      .select("menu_id, name, price")
      .eq("menu_id", menu_id)
      .single();

    if (menuError || !menuCheck) {
      return NextResponse.json(
        { success: false, message: "Menu ID tidak ditemukan atau tidak valid" },
        { status: 400 }
      );
    }

    const price = menuCheck.price;
    const subtotal = price * quantity;

    const { data, error } = await supabaseServer
      .schema("restaurant")
      .from("order_items")
      .insert([
        {
          order_id,
          menu_id,
          quantity,
          price,
          subtotal,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Order item berhasil ditambahkan",
      data,
    });
  } catch (err: any) {
    console.error("Error creating order item:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan order item",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
