export type ExtendedComment = Comments & {
  votes: CommentVote[];
  author: User;
  replies: ReplyComment[];
};

type ReplyComment = Comments & {
  votes: CommentVote[];
  author: User;
};
