import EditorOutput from '@/components/editor/EditorOutput';
import Loader from '@/components/loader';
import CommentSection from '@/components/post/comment-section';
import { formatTimeToNow } from '@/lib/utils';
import NotFound from '@/not-found';
import { PostService } from '@/services/postServices';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const SinglePost = () => {
  const { id } = useParams();
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
  });

  return isLoading ? (
    <Loader container />
  ) : (
    <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
      {/* POST VOTE */}
      {/* POST VOTE */}

      {!data?.cachedPost && !data?.post ? (
        <NotFound />
      ) : (
        <div className="w-full flex-1 rounded-sm bg-white p-4 sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs text-gray-500">
            Posted by u/
            {data.post?.author.username ?? data.cachedPost?.authorUsername}{" "}
            {formatTimeToNow(
              new Date(data.post?.createdAt ?? data.cachedPost?.createdAt),
            )}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-gray-900">
            {data.post?.title ?? data.cachedPost?.title}
          </h1>

          <EditorOutput
            content={data.post?.content ?? data.cachedPost?.content}
          />

          <CommentSection
            postId={data.post?.id ?? data.cachedPost?.id}
            comments={data.comments}
            refetch={refetch}
          />
        </div>
      )}
    </div>
  );
};

export default SinglePost;
