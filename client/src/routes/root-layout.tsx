import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar';
import { useMediaQuery } from '@/hooks/use-media-query';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isMobile = useMediaQuery('(max-width:640px)');

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen pt-12 bg-slate-50 text-slate-900 antialiased light overflow-hidden">
      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex overflow-y-auto mx-auto max-w-screen-2xl bg-slate-50 text-slate-900 antialiased light">
        <aside className="relative">
          <Sidebar sidebarOpen={sidebarOpen} />
        </aside>
        <div
          className={`container mx-auto h-full pt-12 ${
            sidebarOpen ? 'pl-56 xl:pl-72' : ''
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
