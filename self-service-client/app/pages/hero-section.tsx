'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight } from 'lucide-react';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section className="relative w-full h-full p-2 md:h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-20 left-1/3 w-96 h-96 bg-amber-300/30 blur-[120px] rounded-full"
      ></motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/40 blur-[120px] rounded-full"
      ></motion.div>

      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl w-full px-6 md:px-16 gap-12">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
            Savor Every Sip <br className="hidden md:block" /> in Our Café
          </h1>

          <p className="text-lg md:text-2xl text-slate-700 max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed">
            Nikmati aroma kopi segar dan suasana hangat yang membawa kamu pada pengalaman yang tak terlupakan.
          </p>

          <div className="flex justify-center md:justify-start gap-5 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-3.5 rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Coffee size={20} />
              Explore Menu
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              className="border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white px-8 py-3.5 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2"
            >
              Order Now
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full max-w-md md:max-w-xl h-80 md:h-[480px]"
        >
          <Player
            autoplay
            loop
            src="/Cafe.json"
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>
      </div>

      {/* Bottom Subtle Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
    </section>
  );
}
