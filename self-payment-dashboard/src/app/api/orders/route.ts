import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staff = searchParams.get("staff");
    const date = searchParams.get("date"); // "YYYY-MM-DD" dari frontend

    let query = supabase
      .schema("restaurant")
      .from("orders")
      .select(
        `
        order_id,
        session_id,
        status,
        subtotal,
        created_at,
        table_session!inner(name_customer),
        staff_profiles!inner(staff_name),
        orders_items (
          menu_id,
          quantity,
          price,
          menu_items (
            name
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (staff) query = query.eq("staff_profiles.staff_name", staff);
    if (date) {
      const localDate = new Date(date);
      const start = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        0,
        0,
        0
      );
      const end = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        23,
        59,
        59
      );

      query = query
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    const formatted = data.map((order: any) => ({
      orderId: order.order_id,
      staffName: order.staff_profiles?.staff_name || "Unknown",
      sessionName: order.table_session?.name_customer || "Unknown",
      status: order.status,
      isActive: order.status === "Paid",
      items: order.orders_items.map((oi: any) => ({
        itemName: oi.menu_items.name,
        quantity: oi.quantity,
        price: oi.price,
      })),
      subtotal: order.subtotal,
      createdAt: order.created_at,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    console.error("Fetch orders error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, staff_id, status, subtotal } = body;

    if (!session_id || !staff_id || !status || subtotal == null) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .schema("restaurant")
      .from("orders")
      .insert([
        {
          session_id,
          staff_id,
          status,
          subtotal,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Error POST /orders:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
