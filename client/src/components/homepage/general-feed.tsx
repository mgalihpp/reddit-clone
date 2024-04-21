import React from "react";
import PostFeed from "@/components/post/post-feed";
import { useQuery } from "@tanstack/react-query";
import { PostService } from "@/services/postServices";

const GeneralFeed: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await PostService.getPosts(),
  });

  if (!posts || isLoading) {
    return <div>Loading...</div>;
  }

  return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
