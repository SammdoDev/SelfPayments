"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import TextFieldGlobal from "../components/textField/text-field-global";

const AppSession = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get("table_id");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setErrorMsg("Nama pelanggan wajib diisi.");
      return;
    }

    if (!tableId) {
      setErrorMsg("QR code tidak valid atau table_id tidak ditemukan.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const { data } = await axios.post(
        "/api/restaurant/session",
        {
          name_customer: name,
          table_id: tableId,
        },
        {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        }
      );

      if (!data.success) throw new Error(data.message);

      setSuccessMsg("Sesi berhasil dibuat! Mengarahkan ke menu...");
      setTimeout(() => {
        router.push(`/menu?session_id=${data.data.session_id}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Terjadi kesalahan saat membuat sesi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-orange-100 to-white p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-orange-700 mb-6">
          Selamat Datang di Restoran Kami
        </h1>

        <form onSubmit={handleCreateSession} className="flex flex-col gap-5">
          <TextFieldGlobal
            label="Nama Pelanggan"
            placeholder="Masukkan nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errorMsg && !successMsg ? errorMsg : undefined}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition ${
              loading
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Membuat Sesi..." : "Mulai Pesan"}
          </button>
        </form>

        {successMsg && (
          <p className="text-green-600 text-center mt-5 font-medium">
            {successMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppSession;
