import { Comment, Post, Subreddit, User, Vote } from '@prisma/client';

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

export type PostPayload = {
  subredditName?: string;
  limit?: string;
  page?: string;
};
