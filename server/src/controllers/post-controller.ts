import { HttpError } from '@/middlewares/error-handlers';
import postService from '@/services/post-service';
import PostValidators from '@/validators/post-validators';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpStatus from 'http-status-codes';

class PostController {
  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await postService.getPosts();

      return res.status(HttpStatus.OK).json(posts);
    } catch (error) {
      next(new HttpError(HttpStatus.BAD_REQUEST, 'Failed to get post'));
    }
  }
  async getPostsByFollowedCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await postService.getPostsByFollowedCommunity(req);

      return res.status(HttpStatus.OK).json(posts);
    } catch (error) {
      next(new HttpError(HttpStatus.FORBIDDEN, 'Failed to get post'));
    }
  }
  async getPostsByCriteria(req: Request, res: Response, next: NextFunction) {
    const postPayload = req.query;

    // Validate request body against defined validation rules
    await Promise.all(
      PostValidators.postPayloadVlidationRules.map((validation) => validation.run(req)),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with post logic
    try {
      const posts = await postService.getPostsByCriteria(req, postPayload);

      return res.status(HttpStatus.OK).json(postPayload);
    } catch (error) {
      next(new HttpError(HttpStatus.BAD_REQUEST, 'Failed to get post'));
    }
  }
}

export default new PostController();
