import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name_customer, table_id, status, is_active } = body;

    // 🧩 Validasi input dasar
    if (!name_customer || !table_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Field "name_customer" dan "table_id" wajib diisi',
        },
        { status: 400 }
      );
    }

    // 🧩 Ambil data meja dari Supabase
    const { data: tableData, error: tableError } = await supabaseServer
      .schema("restaurant")
      .from("table_restaurant")
      .select("table_id, status")
      .eq("table_id", table_id)
      .single();

    if (tableError || !tableData) {
      return NextResponse.json(
        {
          success: false,
          message: "Table ID tidak ditemukan atau tidak valid",
        },
        { status: 400 }
      );
    }

    // 🧩 Status valid + fallback default
    const allowedStatuses = ["Available", "Reserved", "Occupied", "Cleaning"];
    const inputStatus = status || "Available"; // fallback default

    if (!allowedStatuses.includes(inputStatus)) {
      return NextResponse.json(
        { success: false, message: "Status meja tidak valid" },
        { status: 400 }
      );
    }

    // 🧩 Cek apakah meja sedang kosong
    if (tableData.status !== "Available") {
      return NextResponse.json(
        {
          success: false,
          message: `Meja ini sedang ${tableData.status.toLowerCase()} — tidak bisa membuat sesi baru.`,
        },
        { status: 400 }
      );
    }

    // 🧩 Cek apakah sudah ada session aktif
    const { data: existingSession } = await supabaseServer
      .schema("restaurant")
      .from("table_session")
      .select("session_id")
      .eq("table_id", table_id)
      .eq("is_active", true)
      .maybeSingle();

    if (existingSession) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Meja ini sudah memiliki sesi aktif, tidak bisa membuat sesi baru.",
        },
        { status: 400 }
      );
    }

    // 🧩 Buat session baru
    const { data: newSession, error: sessionError } = await supabaseServer
      .schema("restaurant")
      .from("table_session")
      .insert([
        {
          name_customer,
          table_id,
          status: "Active", // status session, bukan status meja
          is_active: is_active ?? true,
        },
      ])
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 🧩 Update status meja jadi Occupied
    const { error: updateError } = await supabaseServer
      .schema("restaurant")
      .from("table_restaurant")
      .update({ status: "Occupied" })
      .eq("table_id", table_id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "Session berhasil dibuat",
      data: newSession,
    });
  } catch (err: any) {
    console.error("Error creating table session:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat session",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Parameter session ID tidak ditemukan." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .schema("restaurant")
      .from("table_session")
      .select("session_id, name_customer, table_id, status, is_active")
      .eq("session_id", sessionId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Session tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("Error fetching session:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data session",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
