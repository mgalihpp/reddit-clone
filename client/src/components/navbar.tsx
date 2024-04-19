import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "./icons";
import { Menu } from "lucide-react";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-10 py-2">
      <nav className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2 px-4 lg:px-6">
        <Link to="/home" className="flex gap-2 items-center">
          <Icons.logo className="size-8 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Beddit
          </p>
        </Link>

        {/* Search bar */}

        {/* Search bar */}

        {/* Actions */}

        {/* Actions */}

        {/* Mobile sidebar */}
        <Menu
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        {/* Mobile sidebar */}
      </nav>
    </header>
  );
};

export default Navbar;
