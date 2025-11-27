import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type RestaurantTable = {
  table_id: string;
  table_number: string;
  status: "Available" | "Occupied" | "Reserved" | string;
  created_at: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabaseServer
      .schema("restaurant")
      .from("table_restaurant")
      .select("table_id, table_number, status, created_at")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    const tables = (data as RestaurantTable[]) || [];

    return NextResponse.json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (err: any) {
    console.error("Error fetching restaurant tables:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch restaurant tables",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
