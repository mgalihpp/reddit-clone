export type subredditPayload = {
  name: string;
  userId?: string
};

export type subscriptionPayload = {
  subredditId: string;
};

export type updateSubredditPayload = {
  id: string;
  image?: string;
  description?: string;
};
