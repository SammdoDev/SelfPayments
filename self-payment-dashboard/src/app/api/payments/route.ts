import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staffFilter = searchParams.get("staff");
    const date = searchParams.get("date");

    // Filter tanggal
    let start: string | undefined;
    let end: string | undefined;
    if (date) {
      const localDate = new Date(date);
      start = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        0,
        0,
        0
      ).toISOString();

      end = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        23,
        59,
        59
      ).toISOString();
    }

    let paymentsQuery = supabase
      .schema("restaurant")
      .from("payments")
      .select(
        `
    payment_id,
    orders_id,
    amount,
    status,
    created_at,
    payments_method!payments_method_id_fkey(name),
    orders!payments_orders_id_fkey(
      order_id,
      staff_id,
      staff_profiles!orders_staff_id_fkey(staff_name)
    )
  `
      )
      .order("created_at", { ascending: false });

    if (start && end) {
      paymentsQuery = paymentsQuery
        .gte("created_at", start)
        .lte("created_at", end);
    }

    const { data: paymentsData, error } = await paymentsQuery;
    if (error) throw error;

    if (!paymentsData) return NextResponse.json({ success: true, data: [] });

    let filteredData = paymentsData;
    if (staffFilter) {
      filteredData = paymentsData.filter((p: any) => {
        return p.orders?.some(
          (o: any) => o.staff_profiles?.staff_name === staffFilter
        );
      });
    }

    return NextResponse.json({ success: true, data: filteredData });
  } catch (err: any) {
    console.error("Fetch payments error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
