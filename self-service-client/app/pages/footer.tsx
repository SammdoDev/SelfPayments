"use client";

import { motion } from "framer-motion";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Heart
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div {...fadeInUp}>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
              DishDash
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Menyajikan hidangan berkualitas dengan pelayanan terbaik untuk pengalaman kuliner yang tak terlupakan.
            </p>
            
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-500 rounded-full flex items-center justify-center transition-all"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-500 rounded-full flex items-center justify-center transition-all"
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-500 rounded-full flex items-center justify-center transition-all"
              >
                <Twitter size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "How It Works", "Menu", "Order"].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-amber-500 group-hover:w-4 transition-all"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin size={20} className="text-amber-500 mt-1 flex-shrink-0" />
                <span>Jl. Slamet Riyadi No. 123<br />Surakarta, Jawa Tengah</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone size={20} className="text-amber-500 flex-shrink-0" />
                <a href="tel:+62271123456" className="hover:text-amber-500 transition-colors">
                  +62 271 123 456
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail size={20} className="text-amber-500 flex-shrink-0" />
                <a href="mailto:info@dishdash.com" className="hover:text-amber-500 transition-colors">
                  info@dishdashcom
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <h4 className="text-lg font-semibold mb-6">Opening Hours</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-amber-500 mt-1 flex-shrink-0" />
                <div className="text-slate-400">
                  <p className="font-medium text-white mb-2">Monday - Friday</p>
                  <p>11:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-amber-500 mt-1 flex-shrink-0" />
                <div className="text-slate-400">
                  <p className="font-medium text-white mb-2">Saturday - Sunday</p>
                  <p>10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p 
              {...fadeInUp}
              className="text-slate-400 text-sm text-center md:text-left"
            >
              © {currentYear} DishDash. All rights reserved.
            </motion.p>
            
          </div>
        </div>
      </div>
    </footer>
  );
}