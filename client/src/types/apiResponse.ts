import { ExtendedComment } from './comment';
import type { CachedPost, ExtendedPost } from './post';

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

export interface PostByIdResponse {
  post: Omit<ExtendedPost, 'comments' | 'subreddit'>;
  cachedPost: CachedPost;
  comments: ExtendedComment[];
}

export type CreateSubredditResponse = string;

interface SubredditWithPost extends Subreddit {
  posts: ExtendedPost[];
}

export type SlugSubredditResponse = {
  subreddit: SubredditWithPost;
  isSubcribed: boolean;
  memberCount: number;
};

export type UserWithPostsResponse = {
  user: User;
  posts: ExtendedPost[];
};
