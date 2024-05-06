export type updateSubredditPayload = {
  id: string;
  image?: string;
  description?: string;
};

export interface SubredditWithSubscription extends Subreddit {
  subscribers: {
    userId: string;
    subredditId: string;
  }[];
}
