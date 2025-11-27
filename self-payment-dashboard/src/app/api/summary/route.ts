import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const paymentsMethod = url.searchParams.get("paymentsMethod");

    const now = dateParam ? new Date(dateParam) : new Date();

    const startOfRange = dateFrom
      ? new Date(`${dateFrom}T00:00:00`)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    const endOfRange = dateTo
      ? new Date(`${dateTo}T23:59:59`)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const startOfRangeUTC = startOfRange.toISOString();
    const endOfRangeUTC = endOfRange.toISOString();

    let { data: orders, error: ordersError } = await supabase
      .schema("restaurant")
      .from("orders")
      .select(
        `
        order_id,
        status,
        created_at,
        subtotal,
        payments:payments(
          amount,
          status,
          created_at,
          payments_method:payments_method(name)
        )
      `
      )
      .gte("created_at", startOfRangeUTC)
      .lte("created_at", endOfRangeUTC);

    if (ordersError) throw ordersError;
    if (!orders) orders = [];

    const filteredOrders = paymentsMethod
      ? orders.filter((o) =>
          o.payments?.some((p) => {
            const pm = Array.isArray(p.payments_method)
              ? p.payments_method[0]
              : p.payments_method;
            return pm?.name?.toLowerCase() === paymentsMethod.toLowerCase();
          })
        )
      : orders;

    const orderIds = filteredOrders.map((o) => o.order_id);

    let items: { menu_id: string; quantity: number }[] = [];
    if (orderIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .schema("restaurant")
        .from("orders_items")
        .select("menu_id, quantity")
        .in("order_id", orderIds);

      if (itemsError) throw itemsError;
      items = itemsData;
    }

    const itemCount: Record<string, number> = {};
    items.forEach((i) => {
      itemCount[i.menu_id] = (itemCount[i.menu_id] || 0) + i.quantity;
    });

    const sortedItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
    const mostOrderedMenuId = sortedItems[0]?.[0] || null;

    let mostOrderedMenuName = null;
    if (mostOrderedMenuId) {
      const { data: menuData, error: menuError } = await supabase
        .schema("restaurant")
        .from("menu_items")
        .select("name")
        .eq("menu_id", mostOrderedMenuId)
        .single();

      if (!menuError && menuData) mostOrderedMenuName = menuData.name;
    }

    const totalOrders = filteredOrders.length;
    const totalServed = filteredOrders.filter(
      (o) => o.status === "Served"
    ).length;
    const totalPending = filteredOrders.filter(
      (o) => o.status === "Pending"
    ).length;
    const totalCanceled = filteredOrders.filter(
      (o) => o.status === "Cancel"
    ).length;
    const totalPaid = filteredOrders.filter((o) =>
      o.payments?.some((p) => p.status === "Paid")
    ).length;
    const totalRevenue = filteredOrders
      .flatMap((o) => o.payments || [])
      .filter((p) => {
        const paymentDate = new Date(p.created_at);
        return (
          p.status === "Paid" &&
          paymentDate >= new Date(startOfRangeUTC) &&
          paymentDate <= new Date(endOfRangeUTC)
        );
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalItemsSold = Object.values(itemCount).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      success: true,
      date: dateParam || null,
      dateRange: { from: dateFrom, to: dateTo },
      filter: { paymentsMethod: paymentsMethod || "All" },
      summary: {
        totalOrders,
        totalPaid,
        totalPending,
        totalCanceled,
        totalServed,
        totalRevenue,
        totalItemsSold,
        mostOrderedMenu: {
          id: mostOrderedMenuId,
          name: mostOrderedMenuName,
        },
      },
    });
  } catch (err: any) {
    console.error("Error fetching summary:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
