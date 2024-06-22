import { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import NotFound from '@/not-found';
import { SubredditService } from '@/services/subredditServices';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import SubscribeBtn from '@/components/subscribe-btn';
import PostFeed from '@/components/post/post-feed';
import { SubredditAvatar } from '@/components/subreddit-avatar';
import { updateSubredditPayload } from '@/types/subreddit';
import { toast } from 'react-toastify';
import { uploadFiles } from '@/utils/uploadthing';
import { useCursorWait } from '@/hooks/use-cursor-wait';
import { useDocumentTitle } from '@mantine/hooks';
import { dynamicTitle } from '@/utils/title';
import { formatReadableCount } from '@/lib/utils';
import { Ellipsis, Plus, SquareArrowOutUpRight } from 'lucide-react';
import EditSubreddit from '@/components/edit-subreddit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { UserService } from '@/services/userServices';

const CommunitySlugPage = () => {
  const session = useSession();
  const user = UserService.useAuth();
  const { slug } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState<string | undefined>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Redirect if the slug contains encoded spaces ("%20")
    // examaple /r/www%20www it will be /r/wwwwww
    if (pathname && pathname.includes('%20')) {
      const newSlug = pathname.replace(/%20/g, '');
      return navigate(`${newSlug}`);
    }
  }, [pathname, navigate]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['slug-subreddit', slug, user],
    queryFn: async () => {
      const data = await SubredditService.getSlugSubreddit(
        slug as string,
        user?.id,
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: updateSubreddit, isPending } = useMutation({
    mutationKey: ['update-subreddit'],
    mutationFn: async ({ id, image, description }: updateSubredditPayload) => {
      const payload = {
        id,
        image,
        description,
      };

      const { data } = await SubredditService.updateSubreddit(payload);

      return data;
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: () => {
      toast.success('Subreddit updated!');
      refetch();
    },
  });

  useEffect(() => {
    if (slug) {
      setDescription(data?.subreddit.description);
    }
  }, [data?.subreddit, slug]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const [res] = await uploadFiles('imageUploader', {
        files: [file],
        onUploadBegin: () => {
          setUploadLoading(true);
        },
        onUploadProgress: (val) => {
          setProgress(val.progress);
        },
      });

      const { url } = res;

      updateSubreddit({
        id: data?.subreddit.id as string,
        image: url,
      });

      toast.success('Image uploaded!');
      setUploadLoading(false);
      setDescription('');
    } catch (err) {
      console.error(err);
      toast.error(
        'Failed to upload image, make sure the extension is .jpg or .png',
      );
      setUploadLoading(false);
    }
  };

  useDocumentTitle(dynamicTitle(`r/${data?.subreddit.name ?? ''}`));
  useCursorWait(isPending || uploadLoading);

  return isLoading ? (
    <Loader container />
  ) : !data ? (
    <NotFound />
  ) : (
    <div>
      {/* <FeedButton /> */}

      <div className="flex items-center justify-between gap-4 pb-4 max-sm:hidden">
        <div className="flex items-center gap-4">
          <SubredditAvatar subbreddit={data.subreddit} className="size-12" />
          <h1 className="h-14 text-3xl font-bold leading-normal md:text-4xl md:leading-normal">
            r/{data.subreddit.name}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="w-full gap-2 rounded-full"
            size="xs"
            disabled={!data.isSubcribed}
            onClick={() => {
              navigate(`/r/${slug}/submit`);
            }}
          >
            <Plus className="size-4" />
            Create Post
          </Button>

          {data.subreddit.creatorId !== session.user?.id ? (
            <SubscribeBtn
              isSubscribed={data.isSubcribed}
              subredditId={data.subreddit.id}
              subredditName={data.subreddit.name}
              refetch={refetch}
            />
          ) : null}

          <EditSubreddit
            isSubcribed={data.isSubcribed}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            uploadLoading={uploadLoading}
            progress={progress}
            subreddit={data.subreddit}
            setDescription={setDescription}
            description={description}
            updateSubreddit={updateSubreddit}
            isPending={isPending}
            handleImageChange={handleImageChange}
          />

          <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full" size="xs">
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2">
              <DropdownMenuGroup className="text-lg">
                <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
                  Mute r/{data.subreddit.name}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-y-4 pb-6 md:gap-x-4 lg:grid-cols-3">
        <ul className="col-span-2 flex flex-col space-y-6">
          {/* {children} */}
          <>
            {/* <MiniCreatePost session={session} /> */}
            {isLoading ? (
              <Loader />
            ) : data.subreddit.posts.length === 0 ? (
              <p className="text-center">No posts</p>
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
        <aside className="top-20 order-first h-fit rounded-lg border max-sm:px-2 sm:hidden lg:sticky lg:order-last lg:block">
          <div className="space-y-2 px-8 py-4 max-sm:px-0">
            <div className="flex items-center gap-2">
              <SubredditAvatar
                subbreddit={data.subreddit}
                className="hidden max-sm:block"
              />
              <div className="flex w-full flex-col space-y-2">
                <p className="font-semibold">About r/{data.subreddit.name}</p>
                <div className="flex w-full items-center gap-2 sm:justify-between">
                  <p className="text-xs sm:text-sm sm:font-semibold">
                    {formatReadableCount(data.memberCount)}{' '}
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
                    {/* <span className="inline-flex size-2 rounded-full bg-emerald-400"></span> */}
                    <span className="text-sm font-semibold">Top 1%</span>
                    <p className="inline-flex items-center gap-2 text-xs">
                      Rank by size <SquareArrowOutUpRight className="size-2" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-2 max-sm:hidden" />

            <p className="text-xs">{data.subreddit?.description}</p>

            <p className="text-xs text-gray-500">
              Created at{' '}
              <time
                dateTime={new Date(data.subreddit.createdAt).toDateString()}
              >
                {format(data.subreddit.createdAt, 'MMMM d, yyyy')}
              </time>
            </p>

            <div className="flex items-center gap-4 md:hidden">
              <Button
                variant="outline"
                className="gap-1 rounded-full text-xs"
                size="xs"
                disabled={!data.isSubcribed}
                onClick={() => {
                  navigate(`/r/${slug}/submit`);
                }}
              >
                <Plus className="size-4" />
                Create Post
              </Button>

              {data.subreddit.creatorId !== session.user?.id ? (
                <SubscribeBtn
                  isSubscribed={data.isSubcribed}
                  subredditId={data.subreddit.id}
                  subredditName={data.subreddit.name}
                  refetch={refetch}
                />
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full text-xs"
                    size="xs"
                  >
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup className="text-lg">
                    <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
                      Add to Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
                      Mute r/{data.subreddit.name}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunitySlugPage;
