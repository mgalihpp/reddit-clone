import EditorOutput from '@/components/editor/EditorOutput';
import Loader from '@/components/loader';
import CommentSection from '@/components/post/comment-section';
import FeedButton from '@/components/post/feed-btn';
import PostOptions from '@/components/post/post-options';
import PostVote from '@/components/post/post-vote';
import { SubredditAvatar } from '@/components/subreddit-avatar';
import SubscribeBtn from '@/components/subscribe-btn';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatReadableCount, formatTimeToNow } from '@/lib/utils';
import NotFound from '@/not-found';
import { useSession } from '@/providers/SessionProvider';
import { PostService } from '@/services/postServices';
import { dynamicTitle } from '@/utils/title';
import { useDocumentTitle } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  MessageSquare,
  Plus,
  Share,
  SquareArrowOutUpRight,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

const UserHover = React.lazy(() => import('@/components/user-hover'));
const SubredditHover = React.lazy(() => import('@/components/subreddit-hover'));

const SinglePost = () => {
  const session = useSession();

  const { id } = useParams();
  const { slug } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if the slug contains encoded spaces ("%20")
    // example /r/www%20www it will be /r/wwwwww
    if (pathname && pathname.includes('%20')) {
      const newSlug = pathname.replace(/%20/g, '');
      return navigate(`/${newSlug.split('/').slice(1).join('/')}`);
    }
  }, [pathname, id, navigate]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['postId', id],
    queryFn: async () => {
      const data = await PostService.getPostById(id as string);

      return data;
    },
    refetchOnWindowFocus: false,
  });

  const title = (data?.cachedPost?.title ?? data?.post?.title) || '';
  useDocumentTitle(
    dynamicTitle(title, { slug: `r/${data?.subreddit?.name}` }),
  );

  return isLoading ? (
    <Loader container />
  ) : !data?.post &&
    !data?.cachedPost &&
    !data?.comments &&
    !data?.subreddit ? (
    <NotFound />
  ) : (
    <div>
      <div className="grid h-full grid-cols-1 gap-y-4 pb-6 md:gap-x-4 lg:grid-cols-3">
        <div className="col-span-2 w-full rounded-sm bg-white p-4">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-2">
              <FeedButton />
              <div className="flex items-center gap-2">
                <SubredditAvatar
                  subbreddit={data?.subreddit}
                  className="size-8"
                />
                <div className="flex flex-col text-xs">
                  <Link to={`/r/${data?.subreddit.name}`}>
                    <SubredditHover
                      subreddit={data.subreddit}
                      customTrigger
                      className="text-xs no-underline"
                    >
                      <span className="font-semibold">
                        r/{data.subreddit.name}
                      </span>
                    </SubredditHover>
                    <span className="px-1">•</span>
                    {formatTimeToNow(
                      new Date(
                        data.post?.createdAt ?? data.cachedPost?.createdAt,
                      ),
                    )}
                  </Link>
                  <Link
                    to={`/user/${data.post?.author.username ?? data.cachedPost?.authorUsername}`}
                    className="underline"
                  >
                    <UserHover
                      author={data.post?.author ?? data.cachedPost?.author}
                      customTrigger
                      className="text-xs"
                    >
                      <span className="mt-1 flex max-h-40 w-fit items-center gap-1 truncate  text-gray-500">
                        u/
                        {data.post?.author.username ??
                          data.cachedPost?.authorUsername}{' '}
                      </span>
                    </UserHover>
                  </Link>
                </div>
              </div>
            </div>

            <PostOptions
              postId={data.post?.id ?? data.cachedPost?.id}
              authorId={data.post?.authorId ?? data.cachedPost?.authorUsername}
              refetch={refetch}
            />
          </div>
          <h1 className="py-2 text-2xl font-semibold leading-6 text-gray-900 max-md:text-xl">
            {data.post?.title ?? data.cachedPost?.title}
          </h1>

          <EditorOutput
            content={data.post?.content ?? data.cachedPost?.content}
          />

          <div className="z-20 mt-4 flex gap-2 bg-gray-50 py-4 text-sm">
            <PostVote
              postId={data.post?.id ?? data.cachedPost?.id}
              initialVotesAmt={
                data.post?.votes.reduce((acc, vote) => {
                  if (vote.type === 'UP') return acc + 1;
                  if (vote.type === 'DOWN') return acc - 1;
                  return acc;
                }, 0) ??
                data?.votesAmt?.reduce((acc, vote) => {
                  if (vote.type === 'UP') return acc + 1;
                  if (vote.type === 'DOWN') return acc - 1;
                  return acc;
                }, 0)
              }
              initialVote={
                data.post?.votes.find((vote) => vote?.userId === session?.id)
                  ?.type ?? data.cachedPost?.currentVote
              }
            />

            <Link
              to={`/r/${slug}/post/${data?.post?.id ?? data.cachedPost?.id}`}
              className="flex max-h-9 w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 text-center text-xs font-medium text-zinc-900 hover:bg-zinc-200"
            >
              <MessageSquare className="size-4" />{' '}
              {formatReadableCount(data.comments.length)}
            </Link>

            <Button
              variant="subtle"
              className="max-h-9 w-fit items-center gap-2 rounded-full max-sm:text-xs"
            >
              <Share className="size-4" />
              Share
            </Button>
          </div>

          <CommentSection
            postId={data.post?.id ?? data.cachedPost?.id}
            comments={data?.comments}
            refetch={refetch}
          />
        </div>

        <aside className="top-20 order-first h-fit rounded-lg border max-lg:hidden lg:sticky lg:order-last lg:block">
          <div className="space-y-2 px-8 py-4 max-sm:px-0">
            <div className="flex items-center gap-2">
              <SubredditAvatar
                subbreddit={data?.subreddit}
                className="hidden max-sm:block"
              />
              <div className="flex w-full flex-col space-y-2">
                <p className="font-semibold">About r/{data?.subreddit.name}</p>
                <div className="flex w-full items-center gap-2 sm:justify-between">
                  <p className="text-xs sm:text-sm sm:font-semibold">
                    {formatReadableCount(data?.subreddit?.subscribers?.length)}{' '}
                    <br className="max-sm:hidden" />{' '}
                    <span className="sm:font-normal">members</span>
                  </p>
                  <div className="flex max-sm:inline-flex max-sm:items-center sm:flex-col">
                    <span className="font-semibold max-sm:hidden">
                      {formatReadableCount(1000)}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex size-2 rounded-full bg-emerald-400"></span>
                      <span className="max-sm:hidden">Online</span>
                    </div>
                    <p className="ml-1 text-xs sm:hidden">
                      {formatReadableCount(1000)} Online
                    </p>
                  </div>
                  <div className="flex flex-col max-sm:hidden">
                    <span className="text-sm font-semibold">Top 1%</span>
                    <p className="inline-flex items-center gap-2 text-xs">
                      Rank by size <SquareArrowOutUpRight className="size-2" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-2 max-sm:hidden" />

            <p className="text-xs">{data?.subreddit?.description}</p>

            <span className="text-xs text-gray-500">
              Created at{' '}
              <time
                dateTime={new Date(data?.subreddit.createdAt).toDateString()}
              >
                {format(data?.subreddit.createdAt, 'MMMM d, yyyy')}
              </time>
            </span>

            <div className="flex items-center gap-4 md:hidden">
              <Button
                variant="outline"
                className="gap-1 rounded-full text-xs"
                size="xs"
                disabled={
                  !data?.subreddit?.subscribers.find(
                    ({ userId }) => userId === session?.id,
                  )
                }
                onClick={() => {
                  navigate(`/r/${slug}/submit`);
                }}
              >
                <Plus className="size-4" />
                Create Post
              </Button>

              {data?.subreddit?.creatorId !== session?.id ? (
                <SubscribeBtn
                  isSubscribed={data?.subreddit?.subscribers.some(
                    ({ userId }) => userId === session?.id,
                  )}
                  subredditId={data?.subreddit.id}
                  subredditName={data?.subreddit.name}
                  refetch={refetch}
                />
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SinglePost;
