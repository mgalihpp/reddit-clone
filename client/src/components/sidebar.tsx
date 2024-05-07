import { SubredditService } from '@/services/subredditServices';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SubredditAvatar } from '@/components/subreddit-avatar';
import {
  mainSideBarLinks,
  policyLinks,
  resourcesLinks,
} from '@/constants/links';
import { Separator } from '@/components/ui/separator';
import { Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectCommunityOpen,
  selectResourcesOpen,
  toggleCommunity,
  toggleResources,
} from '@/reducers/sidebarReducer';

interface SidebarProps {
  sidebarOpen: boolean;
  pathname: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, pathname }) => {
  const resourcesOpen = useAppSelector(selectResourcesOpen);
  const communitysOpen = useAppSelector(selectCommunityOpen);
  const dispatch = useAppDispatch();

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
      className={`styled-scrollbars fixed top-[63px] z-10 flex h-dvh min-w-[272px] transform flex-col justify-between overflow-y-hidden hover:overflow-y-auto bg-white transition-all delay-100 duration-300 ease-in-out ${
        sidebarOpen
          ? 'translate-x-0 fade-in-5'
          : 'w-[-1px] -translate-x-full opacity-0 fade-out-0'
      }`}
    >
      <nav className="h-auto px-4">
        {/* <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Logo
        </span> */}

        <ul className="mb-20 mt-6 space-y-1">
          {mainSideBarLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.path}
                className={cn(
                  'flex flex-grow items-center gap-3 rounded-lg px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-100',
                  {
                    'bg-gray-100': pathname === link.path,
                  },
                )}
              >
                <link.icon className="size-4 sm:size-5" />
                {link.label}
              </Link>
            </li>
          ))}

          <Separator className="my-8" />

          <li>
            <details
              open={resourcesOpen}
              onToggle={(e) => {
                e.preventDefault();
                dispatch(toggleResources(e.currentTarget.open));
              }}
              className="group/resources [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-light">Resources</span>

                <span className="shrink-0 transition duration-300 group-open/resources:-rotate-180">
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

              {resourcesLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={cn(
                      'flex flex-grow items-center gap-3 rounded-lg px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-100',
                      {
                        'bg-gray-100': pathname === link.path,
                      },
                    )}
                  >
                    <link.icon className="size-4 sm:size-5" />
                    {link.label}
                  </Link>
                </li>
              ))}

              <Separator className="my-4" />

              {isLoading ? (
                <Skeleton className="p-5" />
              ) : !subbredits ? (
                <></>
              ) : (
                <li>
                  <details
                    open={communitysOpen}
                    onToggle={(e) => {
                      e.preventDefault();
                      dispatch(toggleCommunity(e.currentTarget.open));
                    }}
                    className="group/communities [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                      <span className="flex items-center gap-2 text-sm font-light">
                        <Users className="size-4 sm:size-5" />
                        Communities
                      </span>

                      <span className="shrink-0 transition duration-300 group-open/communities:-rotate-180">
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
                    <ul className="mt-2 space-y-1">
                      {subbredits.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/r/${sub.name}`}
                            className={cn(
                              'flex flex-grow items-center gap-3 rounded-lg px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-100',
                              {
                                'bg-gray-100': pathname === `/r/${sub.name}`,
                              },
                            )}
                          >
                            <SubredditAvatar
                              subbreddit={sub}
                              className="size-6"
                            />
                            r/{sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              )}

              <Separator className="my-4" />

              {policyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={cn(
                      'flex flex-grow items-center gap-3 rounded-lg px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-100',
                      {
                        'bg-gray-100': pathname === link.path,
                      },
                    )}
                  >
                    <link.icon className="size-4 sm:size-5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </details>
          </li>
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

      {/* <p className='sticky inset-x-0 bottom-16 text-[10px] text-center'>© 2022 Beddit</p> */}

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
