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
  getSlugSubreddit: async (name: string) => {
    const { data } = await apiInstance.get<SlugSubredditResponse>(
      `/api/subreddit?name=${name}`,
      token.authorization(),
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
