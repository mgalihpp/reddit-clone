import { apiInstance } from '@/lib/axios';
import type {
  CreateSubredditResponse,
  SlugSubredditResponse,
} from '@/types/apiResponse';
import token from '@/utils/token';

export const SubredditService = {
  createSubreddit: async (payload: { name: string }) => {
    return await apiInstance.post<CreateSubredditResponse>(
      '/api/subreddit',
      payload,
      token.authorization(),
    );
  },

  updateSubreddit: async (payload: {
    id: string;
    image?: string;
    description?: string;
  }) => {
    return await apiInstance.put<CreateSubredditResponse>(
      '/api/subreddit',
      payload,
      token.authorization(),
    );
  },

  getAllSubreddit: async () => {
    const { data } = await apiInstance.get<Subreddit[]>('/api/subreddit');

    return data;
  },

  getSlugSubreddit: async (name: string, userId?: string) => {
    const { data } = await apiInstance.post<SlugSubredditResponse>(
      `/api/subreddit/slug?name=${name}`,
      {
        userId: userId,
      },
    );

    return data;
  },
  subscribe: async (payload: { subredditId: string }) => {
    const { data } = await apiInstance.post(
      `/api/subreddit/subscribe`,
      payload,
      token.authorization(),
    );

    return data;
  },
  unsubscribe: async (payload: { subredditId: string }) => {
    const { data } = await apiInstance.post(
      `/api/subreddit/unsubscribe`,
      payload,
      token.authorization(),
    );

    return data;
  },
};
