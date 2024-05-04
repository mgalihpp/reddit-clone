import { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import NotFound from '@/not-found';
import { SubredditService } from '@/services/subredditServices';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FeedButton from '@/components/post/feed-btn';
import { format } from 'date-fns';
import { useSession } from '@/providers/SessionProvider';
import { Button, buttonVariants } from '@/components/ui/button';
import SubscribeBtn from '@/components/subscribe-btn';
import MiniCreatePost from '@/components/post/mini-create-post';
import PostFeed from '@/components/post/post-feed';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubredditAvatar } from '@/components/subreddit-avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { updateSubredditPayload } from '@/types/subreddit';
import { toast } from 'react-toastify';
import { uploadFiles } from '@/utils/uploadthing';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCursorWait } from '@/hooks/use-cursor-wait';
import { useDocumentTitle } from '@mantine/hooks';
import { dynamicTitle } from '@/utils/title';

const CommunitySlugPage = () => {
  const session = useSession();
  const { slug } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
    queryKey: ['slug-subreddit', slug],
    queryFn: async () => {
      const data = await SubredditService.getSlugSubreddit(slug as string);

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
    if (data?.subreddit.description) {
      setDescription(data?.subreddit.description);
    }
  }, [data?.subreddit.description]);

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
      <FeedButton />

      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        <ul className="col-span-2 flex flex-col space-y-6">
          {/* {children} */}
          <>
            <div className="flex items-center gap-4">
              <SubredditAvatar
                subbreddit={data.subreddit}
                className="size-12"
              />
              <h1 className="h-14 text-3xl font-bold leading-normal md:text-4xl md:leading-normal">
                r/{data.subreddit.name}
              </h1>
            </div>
            <MiniCreatePost session={session} />
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
        <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
          <div className="px-8 py-4">
            <p className="py-3 font-semibold">About r/{data.subreddit.name}</p>
            <p className="text-xs">{data.subreddit?.description}</p>
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger
                className={buttonVariants({
                  variant: 'subtle',
                  className: 'mb-2 w-full',
                })}
              >
                Edit subreddit
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit r/{data.subreddit.name}</DialogTitle>
                  <DialogDescription>
                    You can edit your subreddit here
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <SubredditAvatar
                        subbreddit={data.subreddit}
                        className="size-10"
                      />
                      <div className="flex flex-col gap-2">
                        {uploadLoading ? (
                          <p className="text-xs">
                            Uploading... {progress.toFixed(2)}%
                          </p>
                        ) : (
                          <Label
                            className={buttonVariants({
                              variant: 'outline',
                              size: 'xs',
                            })}
                            htmlFor="image"
                          >
                            Change Profile
                          </Label>
                        )}
                        <span className="text-[10px]">* Max file size 5mb</span>
                      </div>
                      <Input
                        type="file"
                        id="image"
                        className="hidden"
                        accept={'.jpg, .jpeg, .png, .webp'}
                        onChange={handleImageChange}
                      />
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-4">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        rows={1}
                        placeholder="(optional)"
                        onChange={(e) => setDescription(e.target.value)}
                      />

                      <Button
                        type="button"
                        onClick={() =>
                          updateSubreddit(
                            {
                              id: data.subreddit.id as string,
                              description,
                            },
                            {
                              onSuccess: () => {
                                setDialogOpen(false);
                              },
                            },
                          )
                        }
                        isLoading={isPending}
                        disabled={isPending}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="mb-4 w-full"
              disabled={!data.isSubcribed}
              onClick={() => {
                navigate(`/r/${slug}/submit`);
              }}
            >
              Create Post
            </Button>
            <div className="flex items-center justify-center gap-1">
              <p className="text-[10px]">
                You must subscribe to be able to create posts
              </p>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CommunitySlugPage;
