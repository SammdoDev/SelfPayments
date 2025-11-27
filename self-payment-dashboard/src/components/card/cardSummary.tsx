'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface CardItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string; // contoh: 'text-blue-500 bg-blue-100 dark:bg-blue-900/40'
}

interface CardSummaryProps {
  items: CardItem[];
}

const CardSummary = ({ items }: CardSummaryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
          className={clsx(
            'group relative overflow-hidden rounded-3xl border shadow-lg p-6',
            'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/70 dark:to-gray-800/70',
            'backdrop-blur-xl border-gray-200 dark:border-gray-700',
            'transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600'
          )}
        >
          {/* Decorative glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent dark:via-white/5" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                {item.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {item.value}
              </p>
            </div>

            <motion.div
              whileHover={{ rotate: 8, scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className={clsx(
                'w-14 h-14 flex items-center justify-center rounded-2xl shadow-md',
                'bg-opacity-20 backdrop-blur-sm',
                item.color
              )}
            >
              <item.icon size={28} />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CardSummary;
