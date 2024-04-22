import { useEffect } from 'react';
import Loader from '@/components/loader';
import NotFound from '@/not-found';
import { SubredditService } from '@/services/subredditServices';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FeedButton from '@/components/post/feed-btn';
import { format } from 'date-fns';
import { useSession } from '@/providers/SessionProvider';
import { buttonVariants } from '@/components/ui/button';
import SubscribeBtn from '@/components/subscribe-btn';
import MiniCreatePost from '@/components/post/mini-create-post';
import PostFeed from '@/components/post/post-feed';

const CommunitySlugPage = () => {
  const session = useSession();
  const { slug } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if the slug contains encoded spaces ("%20")
    // examaple /r/www%20www it will be /r/wwwwww
    if (pathname && pathname.includes('%20')) {
      const newSlug = pathname.replace(/%20/g, '');
      return navigate(`${newSlug}`);
    }
  }, [pathname, navigate]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['slug-subreddit', slug],
    queryFn: async () => {
      const data = await SubredditService.getSlugSubreddit(slug as string);

      return data;
    },
  });

  return isLoading ? (
    <Loader container />
  ) : !data ? (
    <NotFound />
  ) : (
    <div>
      <FeedButton />

      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        <ul className="col-span-2 flex flex-col space-y-6">
          {/* {children} */}
          <>
            <h1 className="h-14 text-3xl font-bold md:text-4xl">
              r/{data.subreddit.name}
            </h1>
            <MiniCreatePost session={session} />
            {isLoading ? (
              <Loader />
            ) : !data.subreddit.posts ? (
              <NotFound />
            ) : (
              <PostFeed
                initialPosts={data.subreddit.posts}
                subredditName={data.subreddit.name}
              />
            )}
          </>
          {/* {children} */}
        </ul>

        {/* info sidebar */}
        <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
          <div className="px-8 py-4">
            <p className="py-3 font-semibold">About r/{data.subreddit.name}</p>
          </div>
          <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Created</dt>
              <dd className="text-gray-700">
                <time
                  dateTime={new Date(data.subreddit.createdAt).toDateString()}
                >
                  {format(data.subreddit.createdAt, 'MMMM d, yyyy')}
                </time>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Members</dt>
              <dd className="flex items-start gap-x-2">
                <div className="text-gray-900">{data.memberCount}</div>
              </dd>
            </div>
            {data.subreddit.creatorId === session?.id ? (
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">You created this community</dt>
              </div>
            ) : null}

            {data.subreddit.creatorId !== session?.id ? (
              <SubscribeBtn
                isSubscribed={data.isSubcribed}
                subredditId={data.subreddit.id}
                subredditName={data.subreddit.name}
                refetch={refetch}
              />
            ) : null}

            <Link
              to={`/r/${slug}/submit`}
              className={buttonVariants({
                variant: 'outline',
                className: 'mb-6 w-full',
              })}
            >
              Create Post
            </Link>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CommunitySlugPage;
