import { ExtendedPost } from '@/types/post';
import React, { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useSession } from '@/providers/SessionProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import Post from './post';
import { Loader2 } from 'lucide-react';
import { PostService } from '@/services/postServices';

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

// 2 to demonstrate infinite scroll, should be higher in production
const INFINITE_SCROLL_PAGINATION_RESULTS = 10;

const PostFeed: React.FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const session = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['infinite-query', subredditName],
    queryFn: async ({ pageParam }) => {
      const data = await PostService.getInfinityPosts(
        INFINITE_SCROLL_PAGINATION_RESULTS,
        pageParam,
        subredditName,
      );

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: { pages: [initialPosts], pageParams: [1] },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 flex flex-col space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1;
          if (vote.type === 'DOWN') return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.id,
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              commentAmt={post.comments.length}
              subredditName={post.subreddit.name}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          );
        }
      })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="size-6 animate-spin text-zinc-500" />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
