import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { useSession } from '@/providers/SessionProvider';
import CustomFeed from '@/components/homepage/custom-feed';
import GeneralFeed from '@/components/homepage/general-feed';
import { useDocumentTitle } from '@mantine/hooks';
import { dynamicTitle } from '@/utils/title';

function App() {
  useDocumentTitle(dynamicTitle('Home'));
  const session = useSession();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* session component */}
        {session ? <CustomFeed /> : <GeneralFeed />}
        {/* session component */}

        {/* subreddit info */}

        <div className="overflow-hidden h-fit rounded-lg border boder-gray-200 order-first md:col-end-4">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="size-5" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Breadit frontpage. Come here to check in with your
                favorite communities.
              </p>
            </div>

            <Link
              to="/r/create"
              className={buttonVariants({
                className: 'w-full mt-4 mb-6 text-center',
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
