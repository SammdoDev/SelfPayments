import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get("order_id");

  if (!order_id)
    return NextResponse.json({ success: false, message: "Missing order_id" });

  const { data: order } = await supabaseServer
    .schema("restaurant")
    .from("orders")
    .select("order_id, session_id")
    .eq("order_id", order_id)
    .single();

  if (!order)
    return NextResponse.json({
      success: false,
      message: "Order tidak ditemukan",
    });

  const { data: session } = await supabaseServer
    .schema("restaurant")
    .from("table_session")
    .select("name_customer")
    .eq("session_id", order.session_id)
    .single();

  const { data: items } = await supabaseServer
    .schema("restaurant")
    .from("orders_items")
    .select("quantity, price")
    .eq("order_id", order_id);

  const total_amount =
    items?.reduce((a, b) => a + b.quantity * b.price, 0) || 0;

  return NextResponse.json({
    success: true,
    data: {
      order_id,
      customer_name: session?.name_customer || "Guest",
      total_amount,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { order_id, amount, customer_name } = await req.json();

    if (!order_id || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing params" },
        { status: 400 }
      );
    }

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount: Number(amount),
      },
      item_details: [
        {
          id: order_id,
          price: Number(amount),
          quantity: 1,
          name: "Restaurant Payment",
        },
      ],
      customer_details: {
        first_name: customer_name,
      },
      enabled_payments: [
        "qris",
        "gopay",
        "shopeepay",
        "spaylater",
        "bank_transfer",
        "credit_card",
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/success?order_id=${order_id}`,
      },
      metadata: { order_id },
    };

    const transaction = await snap.createTransaction(parameter);

    const { data: order } = await supabaseServer
      .schema("restaurant")
      .from("orders")
      .select("session_id")
      .eq("order_id", order_id)
      .single();

    await supabaseServer
      .schema("restaurant")
      .from("payments")
      .upsert(
        {
          session_id: order?.session_id || null,
          order_id,
          amount,
          method_id: null,
          status: "pending",
          created_at: new Date().toISOString(),
        },
        { onConflict: "order_id" }
      );

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
