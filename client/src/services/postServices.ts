import { apiInstance } from '@/lib/axios';
import type { CommentRequest } from '@/lib/validators/comment';
import { CommentVoteRequest } from '@/lib/validators/vote';
import type { PostByIdResponse, PostResponse } from '@/types/apiResponse';
import token from '@/utils/token';

export const PostService = {
  getPosts: async () => {
    const { data } = await apiInstance.get<PostResponse[]>('/api/posts');

    return data;
  },
  getInfinityPosts: async (
    limit: number,
    page: number,
    subredditName?: string,
  ) => {
    const { data } = await apiInstance.get<PostResponse[]>(
      `/api/posts/criteria?limit=${limit}&page=${page}` +
        (subredditName ? `&subredditName=${subredditName}` : ''),
    );

    return data;
  },

  getPostsByFollowedCommunity: async () => {
    const { data } = await apiInstance.get<PostResponse[]>(
      '/api/posts/followed',
      token.authorization(),
    );

    return data;
  },

  getPostById: async (postId: string) => {
    const { data } = await apiInstance.get<PostByIdResponse>(
      `/api/posts/${postId}`,
    );

    return data;
  },

  createPost: async (payload: {
    title: string;
    content?: unknown;
    subredditId: string;
  }) => {
    const { data } = await apiInstance.post<Post>(
      '/api/posts/create',
      payload,
      token.authorization(),
    );

    return data;
  },

  createComment: async (payload: CommentRequest) => {
    const { data } = await apiInstance.patch(
      '/api/posts/comment',
      payload,
      token.authorization(),
    );

    return data;
  },

  votePost: async (payload: { postId: string; voteType: VoteType }) => {
    return await apiInstance.patch(
      '/api/subreddit/post/vote',
      payload,
      token.authorization(),
    );
  },

  voteComment: async (payload: CommentVoteRequest) => {
    return await apiInstance.patch(
      '/api/subreddit/post/comment/vote',
      payload,
      token.authorization(),
    );
  },
};
