import { ExtendedPost } from './post';

export type LoginResponse = {
  message: string;
  user: User;
  token: string;
  sessionToken: string;
  error?: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
  token: string;
  sessionToken: string;
  error?: string;
};

export interface PostResponse extends ExtendedPost {}

export type CreateSubredditResponse = string;

interface SubredditWithPost extends Subreddit {
  posts: Post[];
}

export type SlugSubredditResponse = {
  subreddit: SubredditWithPost;
  isSubcribed: boolean;
  memberCount: number;
};
