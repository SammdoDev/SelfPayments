export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Webhook payload:", body);

    const statusResponse = body;

    const { order_id, transaction_status, transaction_time, payment_type } =
      statusResponse;

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: "order_id missing" },
        { status: 400 }
      );
    }

    const paymentMap: Record<string, string> = {
      shopeepay: "Shopee Pay",
      gopay: "GoPay",
      qris: "QRIS",
      spaylater: "Spaylater",
      bank_transfer: "Bank Transfer",
      credit_card: "Credit Card",
    };

    const methodName = paymentMap[payment_type] || "Other";

    const { data: method } = await supabaseServer
      .schema("restaurant")
      .from("payments_method")
      .select("method_id")
      .eq("name", methodName)
      .single();

    const { data: paymentData, error: paymentError } = await supabaseServer
      .schema("restaurant")
      .from("payments")
      .update({
        status:
          transaction_status === "settlement" ||
          transaction_status === "capture"
            ? "Paid"
            : transaction_status,
        paid_at: transaction_time,
        method_id: method?.method_id ?? null,
      })
      .eq("order_id", order_id)
      .select("session_id")
      .single();

    if (paymentError) {
      console.error("❌ Error updating payments:", paymentError);
      return NextResponse.json(
        { success: false, message: "Failed to update payments" },
        { status: 500 }
      );
    }

    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      await supabaseServer
        .schema("restaurant")
        .from("orders")
        .update({ status: "Paid" })
        .eq("order_id", order_id);

      const session_id = paymentData?.session_id;

      if (session_id) {
        const { data: session } = await supabaseServer
          .schema("restaurant")
          .from("table_session")
          .select("table_id")
          .eq("session_id", session_id)
          .single();

        if (session?.table_id) {
          await supabaseServer
            .schema("restaurant")
            .from("table_restaurant")
            .update({ status: "Available" })
            .eq("table_id", session.table_id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ MIDTRANS WEBHOOK ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
