"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { Coffee, Utensils, IceCream2, Loader2, XCircle } from "lucide-react";

export default function MenuSection() {
  const [menus, setMenus] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          axios.get("/api/restaurant/menu/items", {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
          }),
          axios.get("/api/restaurant/menu/category", {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
          }),
        ]);
        
        // Tampilkan semua menu (aktif & tidak aktif)
        setMenus(menuRes.data.data);
        
        // Filter kategori yang aktif saja untuk button
        const activeCategories = catRes.data.data.filter(
          (cat: any) => cat.is_active === true
        );
        
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMenus =
    activeCategory === "All"
      ? menus
      : menus.filter((item) => {
          const category = Array.isArray(item.menu_category)
            ? item.menu_category[0]
            : item.menu_category;
          
          return category?.name.toLowerCase() === activeCategory.toLowerCase();
        });

  const getIcon = (name: string) => {
    if (name.toLowerCase() === "food") return <Utensils size={18} />;
    if (name.toLowerCase() === "drink") return <Coffee size={18} />;
    if (name.toLowerCase() === "dessert") return <IceCream2 size={18} />;
    return <Utensils size={18} />;
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-amber-50 to-orange-50 py-32 px-6 md:px-12 text-center overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">
            Our Signature Menu
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Pilih dari berbagai makanan, minuman, dan dessert favorit kami 🍽️
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
              activeCategory === "All"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-700"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat.name
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-700"
              }`}
            >
              {getIcon(cat.name)}
              {cat.name}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-amber-600" size={32} />
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500 text-lg">
              Tidak ada menu tersedia saat ini
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredMenus.map((menu, index) => {
              const category = Array.isArray(menu.menu_category)
                ? menu.menu_category[0]
                : menu.menu_category;
              
              // ✅ Cek apakah menu atau kategorinya tidak aktif
              const isInactive = !menu.is_active || !category?.is_active;

              return (
                <motion.div
                  key={menu.menu_id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group relative ${
                    isInactive ? "opacity-75" : ""
                  }`}
                >
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={menu.image_url}
                      alt={menu.name}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        isInactive 
                          ? "grayscale group-hover:scale-100" 
                          : "group-hover:scale-110"
                      }`}
                    />
                    
                    {/* ✅ Overlay dengan garis slash diagonal */}
                    {isInactive && (
                      <>
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        
                        {/* Garis slash diagonal */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                          <div className="w-full h-1 bg-red-600 transform rotate-[-25deg] shadow-lg" />
                        </div>
                        
                        {/* Badge "Not Available" */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl flex items-center gap-2">
                            <XCircle size={18} />
                            SOLD OUT
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-medium shadow-sm z-30 ${
                      isInactive 
                        ? "bg-gray-400 text-white" 
                        : "bg-white/90 text-amber-700"
                    }`}>
                      {category?.name}
                    </div>
                  </div>

                  <div className="p-5 text-left">
                    <h3 className={`text-lg font-semibold mb-1 ${
                      isInactive ? "text-slate-400" : "text-slate-900"
                    }`}>
                      {menu.name}
                    </h3>
                    <p className={`text-sm mb-3 line-clamp-2 ${
                      isInactive ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {menu.description}
                    </p>
                    <p className={`font-bold text-lg ${
                      isInactive 
                        ? "text-slate-400 line-through" 
                        : "text-amber-700"
                    }`}>
                      Rp {menu.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}