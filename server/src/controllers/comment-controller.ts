import commentService from './../services/comment-service';
import type { CommentPayload } from './../types/comment';
import commentValidators from './../validators/comment-validators';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpStatus from 'http-status-codes';

class CommentController {
  async createComment(req: Request, res: Response, next: NextFunction) {
    const payload = req.body as CommentPayload;

    // Validate request body against defined validation rules
    await Promise.all(
      commentValidators.commentPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }

    // If validation passes, proceed with comment logic
    try {
      await commentService.createComment(req, payload);

      return res.status(HttpStatus.CREATED).json();
    } catch (error) {
      next(error);
    }
  }

  async voteComment(req: Request, res: Response, next: NextFunction) {
    const votePayload = req.body;

    // Validate request body against defined validation rules
    await Promise.all(
      commentValidators.commentVotePayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }

    // If validation passes, proceed with comment logic
    try {
      await commentService.voteComment(req, votePayload);

      return res.status(HttpStatus.OK).json();
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    const { commentId } = req.params;

    try {
      await commentService.deleteComment(commentId);

      return res.status(HttpStatus.OK).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
