// import { HomeIcon } from 'lucide-react';
// import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSession } from '@/providers/SessionProvider';
import { useDocumentTitle } from '@mantine/hooks';
import { dynamicTitle } from '@/utils/title';
import React, { Suspense } from 'react';
import Loader from '@/components/loader';
import Sort from '@/components/sort';
import { useQuery } from '@tanstack/react-query';
import { SubredditService } from '@/services/subredditServices';
import { SubredditAvatar } from '@/components/subreddit-avatar';
import { Button } from './components/ui/button';

const CustomFeed = React.lazy(
  () => import('@/components/homepage/custom-feed'),
);
const GeneralFeed = React.lazy(
  () => import('@/components/homepage/general-feed'),
);

function App() {
  useDocumentTitle(dynamicTitle('Home'));
  const session = useSession();

  const [showMore, setShowMore] = React.useState(false);

  const { data } = useQuery({
    queryKey: ['subreddt'],
    queryFn: async () => {
      const data = await SubredditService.getAllSubreddit();

      return data;
    },
  });

  return (
    <>
      {/* <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1> */}

      {/* SORT */}
      <Sort />
      {/* SORT */}

      <div className="grid grid-cols-1 gap-y-4 py-6 lg:grid-cols-3 lg:gap-x-4">
        {/* session component */}
        {session.user ? (
          <Suspense fallback={<Loader />}>
            <CustomFeed />
          </Suspense>
        ) : (
          <Suspense fallback={<Loader />}>
            <GeneralFeed />
          </Suspense>
        )}
        {/* session component */}

        {/* subreddit info */}

        <aside className="styled-scrollbars top-20 order-first h-fit overflow-y-hidden border-none hover:overflow-y-auto max-lg:hidden max-sm:px-2 lg:sticky lg:order-last lg:block">
          {/* <div className="rounded-lg border ">
            <div className="bg-emerald-100 px-6 py-4">
              <p className="flex items-center gap-1.5 py-3 font-semibold">
                <HomeIcon className="size-5" />
                Home
              </p>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Your personal Beddit frontpage. Come here to check in with
                  your favorite communities.
                </p>
              </div>

              <Link
                to="/r/create"
                className={buttonVariants({
                  className: 'mb-6 mt-4 w-full text-center',
                })}
              >
                Create Community
              </Link>
            </dl>
          </div> */}

          <div className="border-0 bg-zinc-100/80 rounded-lg px-6 py-4">
            <p className="flex items-center gap-2 py-3 text-sm font-light uppercase">
              Popular Communities
            </p>

            <div className="mt-4 flex max-h-[calc(100dvh-12rem)] flex-col space-y-4">
              {data &&
                data?.slice(0, 5).map((subreddit) => (
                  <Link
                    key={subreddit.id}
                    to={`/r/${subreddit.name}`}
                    className="flex items-center gap-2 text-xs font-light"
                  >
                    <SubredditAvatar
                      subbreddit={subreddit}
                      className="size-10"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="font-normal">r/{subreddit.name}</p>
                      <span className="text-zinc-500">
                        {subreddit.subscribers.length
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        members
                      </span>
                    </div>
                  </Link>
                ))}

              {data && data?.length > 5 && (
                <div
                  className={`mt-4 flex justify-start ${showMore ? 'hidden' : ''}`}
                >
                  <Button
                    onClick={() => setShowMore(true)}
                    size="xs"
                    className="rounded-full"
                    variant="subtle"
                  >
                    Show More
                  </Button>
                </div>
              )}

              {showMore &&
                data?.slice(5).map((subreddit) => (
                  <Link
                    key={subreddit.id}
                    to={`/r/${subreddit.name}`}
                    className="flex items-center gap-2 text-xs font-light"
                  >
                    <SubredditAvatar
                      subbreddit={subreddit}
                      className="size-10"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="font-normal">r/{subreddit.name}</p>
                      <span className="text-zinc-500">
                        {subreddit.subscribers.length
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        members
                      </span>
                    </div>
                  </Link>
                ))}

              {showMore && (
                <div
                  className={`mt-4 flex justify-start ${!showMore ? 'hidden' : ''}`}
                >
                  <Button
                    onClick={() => setShowMore(false)}
                    size="xs"
                    className="rounded-full"
                    variant="subtle"
                  >
                    See less
                  </Button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default App;
