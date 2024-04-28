import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { useSession } from '@/providers/SessionProvider';
import { useDocumentTitle } from '@mantine/hooks';
import { dynamicTitle } from '@/utils/title';
import React, { Suspense } from 'react';
import Loader from '@/components/loader';

const CustomFeed = React.lazy(
  () => import('@/components/homepage/custom-feed'),
);
const GeneralFeed = React.lazy(
  () => import('@/components/homepage/general-feed'),
);

function App() {
  useDocumentTitle(dynamicTitle('Home'));
  const session = useSession();

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>

      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {/* session component */}
        {session ? (
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

        <div className="boder-gray-200 order-first h-fit overflow-hidden rounded-lg border md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="size-5" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Beddit frontpage. Come here to check in with your
                favorite communities.
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
        </div>
      </div>
    </>
  );
}

export default App;
