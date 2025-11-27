import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, items } = body;

    if (!session_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Session ID dan item pesanan wajib diisi." },
        { status: 400 }
      );
    }

    const { data: sessionCheck, error: sessionError } = await supabaseServer
      .schema("restaurant")
      .from("table_session")
      .select("session_id")
      .eq("session_id", session_id)
      .single();

    if (sessionError || !sessionCheck) {
      return NextResponse.json(
        {
          success: false,
          message: "Session ID tidak ditemukan atau tidak valid.",
        },
        { status: 400 }
      );
    }
    const { data: orderData, error: orderError } = await supabaseServer
      .schema("restaurant")
      .from("orders")
      .insert([
        {
          session_id,
          staff_id: null,
          status: "Pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item: any) => ({
      order_id: orderData.order_id,
      menu_id: item.menu_id,
      quantity: item.quantity,
      price: item.price,
      created_at: new Date().toISOString(),
    }));

    const { error: itemError } = await supabaseServer
      .schema("restaurant")
      .from("orders_items")
      .insert(orderItems);

    if (itemError) throw itemError;

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat",
      data: orderData,
    });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { success: false, message: "Gagal membuat pesanan", error: err.message },
      { status: 500 }
    );
  }
}
