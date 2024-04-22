import React from "react";
import PostFeed from "@/components/post/post-feed";
import { useQuery } from "@tanstack/react-query";
import { PostService } from "@/services/postServices";

const CustomFeed: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await PostService.getPostsByFollowedCommunity(),
  });

  if (!posts || isLoading) {
    return <div>Loading...</div>;
  }

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
