import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar';
import { useMediaQuery } from '@/hooks/use-media-query';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isMobile = useMediaQuery('(max-width:640px)');
  const { pathname } = useLocation();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, pathname]);

  return (
    <div className="light min-h-screen overflow-hidden bg-slate-50 pt-12 text-slate-900 antialiased">
      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="light mx-auto flex max-w-screen-2xl overflow-y-auto bg-slate-50 text-slate-900 antialiased">
        <aside className="relative">
          <Sidebar sidebarOpen={sidebarOpen} />
        </aside>
        <div
          className={`container mx-auto h-full pt-12 ${
            sidebarOpen ? 'pl-56 max-sm:pl-8 xl:pl-72' : ''
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
