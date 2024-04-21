type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  username: string | null;
  image: string | null;
  password: string | null;
};

type newUser = Omit<User, "id" | "username" | "image" | "emailVerified">;

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
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type VoteType = "UP" | "DOWN";

type Vote = {
  userId: string;
  postId: string;
  type: VoteType;
};

type Comment = {
  id: string;
  authorId: string;
  postId: string;
  replyToId: string | null;
  text: string;
  createdAt: Date;
  commentId: string | null;
};
