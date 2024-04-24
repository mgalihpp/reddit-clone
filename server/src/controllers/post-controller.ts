import type { NextFunction, Request, Response } from 'express';
import postService from '@/services/post-service';
import postValidators from '@/validators/post-validators';
import { validationResult } from 'express-validator';
import { HttpError } from '@/middlewares/error-handlers';
import HttpStatus from 'http-status-codes';
import type { PostPayloadById } from '@/types/post';

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
      postValidators.postPayloadValidationRules.map((validation) => validation.run(req)),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with post logic
    try {
      const posts = await postService.getPostsByCriteria(req, postPayload);

      return res.status(HttpStatus.OK).json(posts);
    } catch (error) {
      next(new HttpError(HttpStatus.BAD_REQUEST, 'Failed to get post'));
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    const params = req.params as PostPayloadById;

    // Validate request body against defined validation rules
    await Promise.all(
      postValidators.postIdValidationRules.map((validation) => validation.run(req)),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with post logic
    try {
      const { post, cachedPost } = await postService.getPostById(params);

      return res.status(HttpStatus.OK).json({ post, cachedPost });
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    const postPayload = req.body;

    // Validate request body against defined validation rules
    await Promise.all(
      postValidators.createPostPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with post logic
    try {
      const post = await postService.createPost(req, postPayload);

      return res.status(HttpStatus.OK).json(post);
    } catch (error) {
      next(error);
    }
  }

  async votePost(req: Request, res: Response, next: NextFunction) {
    const votePayload = req.body;

    // Validate request body against defined validation rules
    await Promise.all(
      postValidators.votePostPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with post logic
    try {
      await postService.votePost(req, votePayload);

      return res.status(HttpStatus.OK).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
