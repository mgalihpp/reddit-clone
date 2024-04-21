import { apiInstance } from '@/lib/axios';
import type { PostResponse } from '@/types/apiResponse';
import token from '@/utils/token';

export const PostService = {
  getPosts: async () => {
    const { data } = await apiInstance.get<PostResponse[]>('/api/posts');

    return data;
  },
  getInfinityPosts: async (limit: number, page: number) => {
    const { data } = await apiInstance.get<PostResponse[]>(
      `/api/posts?limit=${limit}&page=${page}`,
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
};
