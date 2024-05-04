export type subredditPayload = {
  name: string;
};

export type subscriptionPayload = {
  subredditId: string;
};

export type updateSubredditPayload = {
  id: string;
  image?: string;
  description?: string;
};
