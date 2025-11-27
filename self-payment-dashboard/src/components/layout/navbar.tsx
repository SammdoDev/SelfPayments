'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Search, Sun, Moon, PanelLeft, LogOut, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationItem {
  id: string;
  message: string;
  date: Date;
  status?: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  user: {
    email: string;
    name: string;
    role: string;
    id?: string;
  };
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, user, onLogout }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifRange, setNotifRange] = useState<'today' | 'yesterday' | '7days'>('today');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const fetchNotifications = async (range: string) => {
    try {
      const res = await fetch(`/api/orders/notifications?range=${range}`);
      const json = await res.json();
      if (json.success) {
        setNotifications(
          json.data.map((item: any) => ({
            id: item.id,
            message: item.message,
            status: item.status,
            date: new Date(item.date),
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications(notifRange);
  }, [notifRange]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/auth/signIn');
    if (onLogout) onLogout();
  };

  // Tutup dropdown/notif saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        notifRef.current && !notifRef.current.contains(target)
      ) {
        setOpenMenu(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const statusColor = (status?: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500';
      case 'Serve':
        return 'text-blue-500';
      case 'Paid':
        return 'text-green-500';
      case 'Cancel':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center relative">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          <PanelLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h1>
      </div>

      <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 w-72">
        <Search size={16} className="text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-2 w-full bg-transparent focus:outline-none text-sm dark:text-white"
        />
      </div>

      <div className="flex items-center gap-3" ref={dropdownRef}>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-gray-700" />
          ) : (
            <Sun size={18} className="text-yellow-400" />
          )}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md relative"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="
                fixed top-20 left-1/2 -translate-x-1/2 z-50 
                md:absolute md:top-10 md:right-0 md:left-auto md:translate-x-0
                "
                onClick={() => setNotifOpen(false)} 
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-around border-b border-gray-200 dark:border-gray-700">
                    {['today', 'yesterday', '7days'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setNotifRange(r as any)}
                        className={`flex-1 py-2 text-sm capitalize ${
                          notifRange === r
                            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                      >
                        {r === 'today'
                          ? 'Hari Ini'
                          : r === 'yesterday'
                          ? 'Kemarin'
                          : '7 Hari'}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-64 overflow-y-auto p-3">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                        >
                          <p className={`text-sm font-medium ${statusColor(n.status)}`}>
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(n.date).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 text-sm py-4">
                        Tidak ada pesanan{' '}
                        {notifRange === 'today'
                          ? 'hari ini'
                          : notifRange === 'yesterday'
                          ? 'kemarin'
                          : '7 hari terakhir'}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black font-bold text-sm cursor-pointer border border-gray-300"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          {userInitial}
        </div>

        <AnimatePresence>
          {openMenu && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-16 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 border border-gray-200 dark:border-gray-700 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
              >
                <LogOut size={16} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
