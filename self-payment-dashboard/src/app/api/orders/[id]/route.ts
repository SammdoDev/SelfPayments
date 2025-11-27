import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { session_id, staff_id, status, subtotal } = await req.json();

    if (!session_id || !staff_id || !status || subtotal == null) {
      return NextResponse.json(
        { error: "session_id, staff_id, status, dan subtotal wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .schema("restaurant")
      .from("orders")
      .update({ session_id, staff_id, status, subtotal })
      .eq("order_id", id)
      .select("*");

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    console.error("Update order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

    const { error } = await supabase
      .schema("restaurant")
      .from("orders")
      .delete()
      .eq("order_id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (err: any) {
    console.error("Delete order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const updates = await req.json(); 

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .schema("restaurant")
      .from("orders")
      .update(updates)
      .eq("order_id", id)
      .select("*");

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    console.error("Patch order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
