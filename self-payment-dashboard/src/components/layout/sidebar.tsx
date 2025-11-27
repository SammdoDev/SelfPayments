'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Soup } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  name: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  menuList: MenuItem[];
  open: boolean;
  setOpen: (val: boolean) => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ menuList, open, setOpen, isMobile }) => {
  const pathname = usePathname();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleAccordionToggle = (name: string) =>
    setActiveAccordion((prev) => (prev === name ? null : name));

  return (
    <AnimatePresence>
      {open && (
        <>
          {isMobile && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
          )}

          <motion.aside
            initial={{ x: isMobile ? '-100%' : 0, width: isMobile ? '16rem' : 0 }}
            animate={{ x: 0, width: '16rem' }}
            exit={{ x: isMobile ? '-100%' : 0, width: 0 }}
            transition={{ duration: isMobile ? 0.25 : 0.3, ease: 'easeInOut' }}
            className={`${
              isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative h-full'
            } bg-white dark:bg-gray-900 shadow-md border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden`}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Soup className="text-blue-500" />
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  DishDash
                </span>
              </div>

              {isMobile && (
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <nav className="mt-4 flex flex-col gap-1 overflow-y-auto flex-1">
              {menuList.map((item: MenuItem) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => handleAccordionToggle(item.name)}
                        className={`flex items-center w-full gap-3 px-4 py-2 rounded-md text-left transition-all ${
                          activeAccordion === item.name
                            ? 'bg-blue-100 text-blue-600 font-semibold dark:bg-blue-900/40'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                        }`}
                      >
                        <i className={`${item.icon} text-base w-5 text-center`} />
                        <span className="truncate">{item.name}</span>
                        <i
                          className={`pi ml-auto text-sm transition-transform duration-300 ${
                            activeAccordion === item.name ? 'rotate-180' : ''
                          } pi-chevron-down`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {activeAccordion === item.name && (
                          <motion.div
                            key="accordion"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="ml-10 mt-1 flex flex-col gap-1 overflow-hidden"
                          >
                            {item.children.map((child: MenuItem) => (
                              <Link
                                key={child.path}
                                href={child.path ?? '#'}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-300 ${
                                  pathname === child.path
                                    ? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30'
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                }`}
                              >
                                <span className="truncate">{child.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.path ?? '#'}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                        pathname === item.path
                          ? 'bg-blue-100 text-blue-600 font-semibold dark:bg-blue-900/30'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      <i className={`${item.icon} text-base w-5 text-center`} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
