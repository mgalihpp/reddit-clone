export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

export type CachedPost = {
  id: string;
  title: string;
  authorUsername: string;
  author: User;
  content: string;
  currentVote: Vote['type'] | null;
  createdAt: Date;
};
