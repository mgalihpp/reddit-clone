type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  username: string | null;
  image: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type newUser = Omit<User, 'id' | 'username' | 'image' | 'emailVerified'>;

type Session = {
  token: string;
  loading: boolean;
  user: User;
  error: string | null;
} | null;

type Post = {
  id: string;
  authorId: string;
  subredditId: string;
  title: string;
  content: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

type Subreddit = {
  id: string;
  creatorId: string | null;
  image?: string;
  description?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type VoteType = 'UP' | 'DOWN';

type Vote = {
  userId: string;
  postId: string;
  type: VoteType;
};

type Comments = {
  id: string;
  authorId: string;
  postId: string;
  replyToId: string | null;
  text: string;
  createdAt: Date;
  commentId: string | null;
};

type CommentVote = {
  userId: string;
  commentId: string;
  type: VoteType;
};

declare module '@editorjs/embed';
declare module '@editorjs/table';
declare module '@editorjs/list';
declare module '@editorjs/code';
declare module '@editorjs/link';
declare module '@editorjs/inline-code';
declare module '@editorjs/image';
declare module '@weekwood/editorjs-video';
