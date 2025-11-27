import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; 
    const { staff_name, email, role, password, is_active } = await req.json();

    if (!staff_name || !email || !role) {
      return NextResponse.json(
        { error: "staff_name, email, dan role wajib diisi" },
        { status: 400 }
      );
    }

    const updateData: any = { staff_name, email, role, is_active };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const { data, error } = await supabase
      .schema("restaurant")
      .from("staff_profiles")
      .update(updateData)
      .eq("staff_id", id)
      .select("staff_id, staff_name, email, role, is_active, created_at");

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    console.error("Update staff error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id)
      return NextResponse.json({ error: "Missing staff id" }, { status: 400 });

    const { error } = await supabase
      .schema("restaurant")
      .from("staff_profiles")
      .delete()
      .eq("staff_id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Staff deleted" });
  } catch (err: any) {
    console.error("Delete staff error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; 
    const { is_active } = await req.json();

    const { data, error } = await supabase
      .schema("restaurant")
      .from("staff_profiles")
      .update({ is_active })
      .eq("staff_id", id)
      .select("staff_id, staff_name, is_active");

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    console.error("Patch staff error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
