import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/icons';
import { Menu } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useSession } from '@/providers/SessionProvider';
import { Skeleton } from '@/components/ui/skeleton';

const SearchBar = React.lazy(() => import('@/components/searchbar'));
const UserDropDown = React.lazy(() => import('./user-dropdown'));

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const session = useSession();

  return (
    <header className="fixed inset-x-0 top-0 z-[11] h-fit border-b border-zinc-300 bg-background py-2">
      <nav className="container mx-auto flex h-full max-w-screen-2xl items-center justify-between gap-2 px-4 lg:px-6">
        <div className='flex gap-2 items-center'>
          {/* Mobile sidebar */}
          <Menu
            className="cursor-pointer xl:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          {/* Mobile sidebar */}

          <Link to="/home" className="flex items-center gap-2">
            <Icons.logo className="size-8 sm:w-6" />
            <p className="hidden text-sm font-medium text-zinc-700 md:block">
              Beddit
            </p>
          </Link>
        </div>

        {/* Search bar */}
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-lg" />}>
          <SearchBar />
        </Suspense>
        {/* Search bar */}

        <div className="flex items-center gap-4">
          {/* Actions */}
          {session.user === undefined ? (
            <Skeleton className="size-10 rounded-full" />
          ) : session.user?.id ? (
            <Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
              <UserDropDown user={session.user} />
            </Suspense>
          ) : (
            <Link
              to="/sign-in"
              className={buttonVariants({ className: 'max-md:hidden' })}
            >
              Sign in
            </Link>
          )}

          {/* Actions */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
