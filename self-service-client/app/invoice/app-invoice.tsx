"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

type OrderData = {
  order_id: string;
  total_amount: number;
  customer_name: string;
};

const AppInvoice = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `/api/restaurant/payment?order_id=${orderId}`,
          {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
          }
        );

        if (res.data.success) setOrder(res.data.data);
        else alert(res.data.message);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data invoice");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order) return;

    try {
      const res = await axios.post(
        "/api/restaurant/payment",
        {
          order_id: order.order_id,
          amount: order.total_amount,
          customer_name: order.customer_name,
        },
        {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        }
      );

      const { token } = res.data;

      if (!token) return alert("Gagal mendapatkan token pembayaran");

      window.snap.pay(token, {
        onSuccess: () => {
          alert("Pembayaran berhasil!");
        },
        onPending: () => {
          alert("Menunggu pembayaran...");
        },
        onError: () => {
          alert("Pembayaran gagal");
        },
        onClose: () => {
          alert("Popup ditutup tanpa pembayaran");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Gagal membuat transaksi");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_URL ||
      "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // ✔ benar
    };
  }, []);

  if (loading) return <p className="text-center mt-10">Loading invoice...</p>;

  if (!order)
    return (
      <p className="text-center mt-10 text-red-600">Order tidak ditemukan</p>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
      <h2 className="text-2xl font-bold mb-2 text-orange-700">
        Invoice #{order.order_id}
      </h2>
      <p className="text-gray-600 mb-6">Atas nama: {order.customer_name}</p>
      <p className="text-xl font-semibold text-gray-800 mb-8">
        Total Pembayaran: Rp {order.total_amount.toLocaleString()}
      </p>

      <button
        onClick={handlePayment}
        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md"
      >
        Bayar Sekarang
      </button>
    </div>
  );
};

export default AppInvoice;
