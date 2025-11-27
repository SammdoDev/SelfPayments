import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .schema("restaurant")
      .from("payments_method")
      .select("method_id, name")
      .order("name", { ascending: true });

    if (error) throw error;

    const formatted = data.map((d) => ({
      label: d.name,
      value: d.method_id,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching payment methods:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}
