import type { CommentVote, User, Comment, $Enums } from '@prisma/client';

export type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
  replies: ReplyComment[];
};

type ReplyComment = Comment & {
  votes: CommentVote[];
  author: User;
};

export type CommentPayload = {
  postId: string;
  text: string;
  replyToId: string;
};

export type commentVotePayload = {
  commentId: string;
  voteType: $Enums.VoteType;
};
