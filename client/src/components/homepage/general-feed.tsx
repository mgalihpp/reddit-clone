import React from 'react';
import PostFeed from '@/components/post/post-feed';
import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/services/postServices';
import Loader from '@/components/loader';

const GeneralFeed: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => await PostService.getPosts(),
    refetchOnWindowFocus: false,
  });

  if (!posts || isLoading) {
    return <Loader className="col-span-2" />;
  }

  return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
