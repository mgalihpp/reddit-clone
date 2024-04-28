import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import NotFound from '@/not-found';
import { SubredditService } from '@/services/subredditServices';
import { useQuery } from '@tanstack/react-query';
import React, { Suspense, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Editor = React.lazy(() => import('@/components/editor'));

const CreatePost = () => {
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

  const { data, isLoading } = useQuery({
    queryKey: ['slug-subreddit', slug],
    queryFn: async () => {
      const data = await SubredditService.getSlugSubreddit(slug as string);

      return data;
    },
    refetchOnWindowFocus: false,
  });

  return isLoading ? (
    <Loader container />
  ) : !data ? (
    <NotFound />
  ) : (
    <div className="my-2 flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-600">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{slug}
          </p>
        </div>
      </div>

      {/* form */}
      {/* editor */}
      <Suspense fallback={<Loader />}>
        <Editor subredditId={data?.subreddit.id} />
      </Suspense>
      {/* editor */}

      <div className="flex w-full justify-end">
        <Button className="w-full" type="submit" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
