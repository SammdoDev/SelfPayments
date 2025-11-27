"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Loader2, ShoppingCart, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

type MenuItem = {
  menu_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active: boolean;
};

type SessionData = {
  session_id: string;
  name_customer: string;
};

const AppMenu = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, sessionRes] = await Promise.all([
          axios.get("/api/restaurant/menu/items", {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
          }),
          axios.get(`/api/restaurant/session?id=${sessionId}`, {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
          }),
        ]);

        if (menuRes.data.success) setMenu(menuRes.data.data);
        if (sessionRes.data.success) setSessionData(sessionRes.data.data);
      } catch (err) {
        console.error("Failed to fetch menu/session:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchData();
  }, [sessionId]);

  const handleAddQty = (menu_id: number) => {
    setCart((prev) => ({
      ...prev,
      [menu_id]: (prev[menu_id] || 0) + 1,
    }));
  };

  const handleRemoveQty = (menu_id: number) => {
    setCart((prev) => {
      const newQty = (prev[menu_id] || 0) - 1;
      if (newQty <= 0) {
        const { [menu_id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [menu_id]: newQty };
    });
  };

  const handleOrder = async () => {
    if (!sessionId) {
      setMessage("Session tidak ditemukan. Silakan ulangi dari awal.");
      return;
    }

    if (Object.keys(cart).length === 0) {
      setMessage("Pilih minimal 1 menu untuk dipesan.");
      return;
    }

    setMessage("Mengirim pesanan...");
    try {
      const orderItems = menu
        .filter((m) => cart[m.menu_id])
        .map((m) => ({
          menu_id: m.menu_id,
          quantity: cart[m.menu_id],
          price: m.price,
          subtotal: m.price * cart[m.menu_id],
        }));

      const { data } = await axios.post(
        "/api/restaurant/orders",
        {
          session_id: sessionId,
          items: orderItems,
        },
        {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        }
      );

      if (data.success) {
        const orderId = data.data?.order_id;
        setMessage("Pesanan berhasil dikirim! 🍽️");
        setCart({});

        if (orderId) {
          window.location.href = `/invoice?order_id=${orderId}`;
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Gagal membuat pesanan");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-6">
      <h1 className="text-3xl font-bold text-orange-700 mb-2 text-center">
        🍽️ Selamat Datang, {sessionData?.name_customer || "Tamu"}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Silakan pilih menu favorit Anda dan tambahkan ke pesanan.
      </p>

      {/* 🧾 Daftar Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <motion.div
            key={item.menu_id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all"
          >
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={400}
                height={250}
                className="object-cover w-full h-44"
              />
            ) : (
              <div className="bg-gray-100 h-44 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 flex-grow">
                {item.description || "Tidak ada deskripsi menu."}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-orange-600 font-bold text-lg">
                  Rp {item.price.toLocaleString()}
                </span>
                {cart[item.menu_id] ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveQty(item.menu_id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold w-6 text-center text-black">
                      {cart[item.menu_id]}
                    </span>
                    <button
                      onClick={() => handleAddQty(item.menu_id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddQty(item.menu_id)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full transition"
                  >
                    <ShoppingCart size={16} />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🛒 Checkout Section */}
      <div className="mt-10 text-center">
        <button
          onClick={handleOrder}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md"
        >
          Kirim Pesanan ({Object.keys(cart).length})
        </button>

        {message && (
          <p className="mt-4 text-gray-700 font-medium text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppMenu;
