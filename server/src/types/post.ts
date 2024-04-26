import { $Enums, Comment, Post, Subreddit, User, Vote } from '@prisma/client';

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

export type PostVoteAuthor = Post & {
  votes: Vote[];
  author: User;
};

export type PostPayload = {
  subredditName?: string;
  limit?: string;
  page?: string;
};

export type PostPayloadById = {
  postId: string;
};

export type CreatePostPayload = {
  title: string;
  content: any;
  subredditId: string;
};

export type VotePostPayload = {
  postId: string;
  voteType: $Enums.VoteType;
};

export type CachedPost = {
  id: string;
  title: string;
  authorUsername: string;
  content: string;
  currentVote: Vote['type'] | null;
  createdAt: Date;
};
