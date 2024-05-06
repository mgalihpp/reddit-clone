import React, { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useParams,
} from 'react-router-dom';

const Navbar = React.lazy(() => import('@/components/navbar/navbar'));
const Sidebar = React.lazy(() => import('@/components/sidebar'));

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isMobile = useMediaQuery('(max-width:1279px)');
  const { slug } = useParams();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, pathname]);

  return (
    <div className="light min-h-screen bg-slate-50 pt-12 text-slate-900 antialiased">
      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="light mx-auto flex max-w-screen-2xl bg-slate-50 text-slate-900 antialiased">
        <aside className="relative">
          <Sidebar sidebarOpen={sidebarOpen} pathname={pathname} />
          {isMobile && sidebarOpen && (
            <div
              className="fixed left-0 top-4 z-[9] h-screen w-screen bg-black/50"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
        </aside>
        <div
          className={`container mx-auto h-full pt-12 ${
            sidebarOpen ? 'xl:pl-72' : ''
          }`}
        >
          <Outlet />
        </div>
      </main>

      {/* Scroll Restoration by pathname */}
      <ScrollRestoration
        getKey={(location) => {
          const paths = ['/', '/home', '/popular', '/all', `/r/${slug}`];

          return paths.includes(location.pathname)
            ? location.pathname
            : location.key;
        }}
      />
    </div>
  );
}
