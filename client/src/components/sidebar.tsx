import { SubredditService } from '@/services/subredditServices';
import { useQuery } from '@tanstack/react-query';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SubredditAvatar } from '@/components/subreddit-avatar';

interface SidebarProps {
  sidebarOpen: boolean;
  pathname: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, pathname }) => {
  const { data: subbredits, isLoading } = useQuery({
    queryKey: ['subreddits'],
    queryFn: async () => {
      const data = await SubredditService.getAllSubreddit();

      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div
      className={`fixed top-16 z-10 flex h-screen max-w-52 transform flex-col justify-between border-e bg-white transition-all delay-100 duration-300 ease-in-out max-md:min-w-[300px] xl:min-w-[270px] ${
        sidebarOpen
          ? 'translate-x-0 fade-in-5'
          : 'w-[-1px] -translate-x-full opacity-0 fade-out-0'
      }`}
    >
      <nav className="px-4 py-6">
        {/* <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Logo
        </span> */}

        <ul className="mt-6 space-y-1">
          <li>
            <Link
              to="/home"
              className={cn(
                'flex flex-grow items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100',
                {
                  'bg-gray-100': pathname === '/home',
                },
              )}
            >
              <Home className="size-4 sm:size-6 " />
              Home
            </Link>
          </li>

          {isLoading ? (
            <Skeleton className="p-5" />
          ) : !subbredits ? (
            <></>
          ) : (
            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-sm font-medium">Communities</span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>
                <ul className="mt-2 space-y-1 px-4">
                  {subbredits.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/r/${sub.name}`}
                        className={cn(
                          'inline-flex w-full gap-4 items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                          {
                            'bg-gray-100': pathname === `/r/${sub.name}`,
                          },
                        )}
                      >
                        <SubredditAvatar subbreddit={sub} className='size-6' />
                        r/{sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          )}
        </ul>
      </nav>

      {/* Sidebar footer */}

      <Link
        to="/sign-in"
        className={buttonVariants({
          className:
            'sticky inset-x-0 bottom-5 mx-4 hidden text-center max-md:block',
        })}
      >
        Sign in
      </Link>

      {/* <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <Link
          to="#"
          className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
        >
          <img
            alt=""
            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            className="size-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium">Eric Frusciante</strong>

              <span> eric@frusciante.com </span>
            </p>
          </div>
        </Link>
      </div> */}
    </div>
  );
};

export default Sidebar;
