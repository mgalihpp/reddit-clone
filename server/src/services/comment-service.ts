import HttpStatus from 'http-status-codes';
import { HttpError } from './../middlewares/error-handlers';
import { db } from './../configs/db';
import type { CommentPayload, commentVotePayload } from './../types/comment';
import type { PostPayloadById } from './../types/post';
import { exclude } from './../utils';
import type { Request } from 'express';

class CommentService {
  async getCommentsByPostId(payload: PostPayloadById) {
    const comments = await db.comment.findMany({
      where: {
        postId: payload.postId,
        replyToId: null,
      },
      include: {
        author: true,
        votes: true,
        replies: {
          // first level replies
          include: {
            author: true,
            votes: true,
          },
        },
      },
    });

    const commentsAuthorWithoutPassword = comments.map((comment) => {
      exclude(comment.author, ['email', 'password']);

      return comment;
    });

    return commentsAuthorWithoutPassword;
  }

  async createComment(req: Request, payload: CommentPayload) {
    await db.comment.create({
      data: {
        text: payload.text,
        authorId: req.user?.id as string,
        postId: payload.postId,
        replyToId: payload.replyToId,
      },
    });
  }

  async voteComment(req: Request, payload: commentVotePayload) {
    const { commentId, voteType } = payload;
    // check if user has already voted on this post
    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: req.user?.id as string,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              userId: req.user?.id as string,
              commentId,
            },
          },
        });
      } else {
        // if vote type different, update vote
        await db.commentVote.update({
          where: {
            userId_commentId: {
              userId: req.user?.id as string,
              commentId,
            },
          },
          data: {
            type: voteType,
          },
        });

        return 'ok';
      }
    }
    // if no existing vote, create new vote

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: req.user?.id as string,
        commentId,
      },
    });
  }

  async deleteComment(commentId: string) {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw new HttpError(HttpStatus.NOT_FOUND, 'Comment not found');

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}

export default new CommentService();
