import React, { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';

const Navbar = React.lazy(() => import('@/components/navbar/navbar'));
const Sidebar = React.lazy(() => import('@/components/sidebar'));

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isMobile = useMediaQuery('(max-width:768px)');
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
          <Sidebar sidebarOpen={sidebarOpen} pathname={pathname} />
        </aside>
        <div
          className={`container mx-auto h-full pt-12 ${
            sidebarOpen ? 'pl-56 max-md:pl-8 xl:pl-72' : ''
          }`}
        >
          <Outlet />
        </div>
      </main>

      {/* Scroll Restoration by pathname */}
      <ScrollRestoration
        getKey={(location) => {
          const paths = ['/', '/home'];

          return paths.includes(location.pathname)
            ? location.pathname
            : location.key;
        }}
      />
    </div>
  );
}
