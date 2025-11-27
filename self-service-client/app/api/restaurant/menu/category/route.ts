import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .schema("restaurant")
      .from("menu_category")
      .select("category_id, name, is_active, created_at")
      .eq("is_active", true)
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
