'use client';

import { motion } from "framer-motion";
import { Coffee, QrCode, ShoppingCart, Smile, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <QrCode size={38} />,
    title: "Scan QR Code",
    desc: "Gunakan kamera atau aplikasi kami untuk scan QR di meja kamu.",
  },
  {
    icon: <ShoppingCart size={38} />,
    title: "Choose Menu",
    desc: "Pilih kopi, makanan, atau snack favorit langsung dari gadget kamu.",
  },
  {
    icon: <Coffee size={38} />,
    title: "Barista Prepare",
    desc: "Tim kami langsung menyiapkan pesanan dengan penuh cinta ☕",
  },
  {
    icon: <Smile size={38} />,
    title: "Enjoy Your Order",
    desc: "Pesananmu datang ke meja — santai dan nikmati suasananya!",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-amber-50 via-white to-amber-50 py-28 px-6 overflow-hidden flex flex-col items-center text-center">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Floating Glow */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-10 left-[15%] w-40 h-40 bg-amber-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-10 right-[10%] w-48 h-48 bg-orange-200/20 rounded-full blur-3xl"
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative z-10 mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent mb-4 tracking-tight">
          How It Works
        </h2>
        <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
          Pesan kopi favoritmu dalam empat langkah mudah dan cepat.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative max-w-6xl mx-auto mt-10 grid gap-10 md:grid-cols-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center bg-white rounded-3xl shadow-md p-8 border border-amber-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg mb-5">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">{step.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white px-10 py-4 rounded-full font-semibold text-lg flex items-center gap-3 shadow-md transition-all duration-200"
        >
          <Coffee size={22} />
          Start Ordering
          <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
}
