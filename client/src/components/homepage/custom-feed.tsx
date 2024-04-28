import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/services/postServices';
import Loader from '@/components/loader';

const PostFeed = React.lazy(() => import('@/components/post/post-feed'));

const CustomFeed: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => await PostService.getPostsByFollowedCommunity(),
    refetchOnWindowFocus: false,
  });

  if (!posts || isLoading) {
    return <Loader />;
  }

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
