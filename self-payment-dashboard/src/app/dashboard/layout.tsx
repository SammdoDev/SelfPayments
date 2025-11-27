'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';

const menuList = [
  { name: 'Dashboard', path: '/dashboard', icon: 'pi pi-home' },
  {
    name: 'Orders',
    icon: 'pi pi-shopping-cart',
    children: [
      { name: 'All Orders', path: '/dashboard/orders' },
      { name: 'Pending Orders', path: '/dashboard/orders/pending' },
    ],
  },
   {
    name: 'Menu',
    icon: 'pi pi-list',
    children: [
      { name: 'Menu List', path: '/dashboard/menu/menu-list' },
      { name: 'Menu Category', path: '/dashboard/menu/menu-category' },
    ],
  },
   {
    name: 'Payments',
    icon: 'pi pi-credit-card',
    children: [
      { name: 'Payments', path: '/dashboard/payments' },
      { name: 'Payments Method', path: '/dashboard/payments/payments-method' },
    ],
  },
  { name: 'Staff', path: '/dashboard/staff', icon: 'pi pi-users' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    role: '',
    id: '',
  });

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('userName') || '';
    const role = localStorage.getItem('userRole') || '';
    const id = localStorage.getItem('userId') || '';
    setUserData({ email, name, role, id });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      <Sidebar
        menuList={menuList}
        open={sidebarOpen}
        isMobile={isMobile}
        setOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1 h-full overflow-y-auto md:overflow-hidden ">
        <Navbar user={userData} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-1 md:p-6 md:overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
