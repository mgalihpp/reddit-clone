import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isMobile = useMediaQuery("(max-width:640px)");

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
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main
        className={`flex overflow-y-auto h-[2000px] mx-auto max-w-7xl max-sm:px-4 px-4 bg-slate-50 text-slate-900 antialiased light ${
          sidebarOpen ? "pl-56 xl:pl-72" : ""
        }`}
      >
        <div className="container mx-auto h-full pt-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
