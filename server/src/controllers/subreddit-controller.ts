import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import subredditValidators from './../validators/subreddit-validators';
import HttpStatus from 'http-status-codes';
import subredditService from './../services/subreddit-service';
import type { subredditPayload } from './../types/subreddit';

class SubredditController {
  async createSubreddit(req: Request, res: Response, next: NextFunction) {
    const subredditPayload = req.body;
    // Validate request body against defined validation rules
    await Promise.all(
      subredditValidators.subredditPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with subreddit logic
    try {
      const subredditName = await subredditService.createSubreddit(req, subredditPayload);

      return res.status(HttpStatus.OK).json(subredditName);
    } catch (error) {
      next(error);
    }
  }

  async updateSubreddit(req: Request, res: Response, next: NextFunction) {
    const subredditPayload = req.body;

    // Validate request body against defined validation rules
    await Promise.all(
      subredditValidators.updateSubredditPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }

    // If validation passes, proceed with subreddit logic

    try {
      const subredditName = await subredditService.updateSubreddit(subredditPayload);

      return res.status(HttpStatus.OK).json(subredditName);
    } catch (error) {
      next(error);
    }
  }

  async getAllSubreddits(req: Request, res: Response, next: NextFunction) {
    try {
      const subreddits = await subredditService.getAllSubreddit();

      return res.status(HttpStatus.OK).json(subreddits);
    } catch (error) {
      next(error);
    }
  }

  async getSlugSubreddit(req: Request, res: Response, next: NextFunction) {
    const slugPayload = req.query;
    const { userId } = req.body;

    const payload: subredditPayload = {
      name: slugPayload.name as string,
      userId,
    };
    // Validate request body against defined validation rules
    await Promise.all(
      subredditValidators.slugSubredditPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with subreddit logic
    try {
      const { subreddit, isSubcribed, memberCount } =
        await subredditService.getSlugSubreddit(payload);

      return res.status(HttpStatus.OK).json({ subreddit, isSubcribed, memberCount });
    } catch (error) {
      next(error);
    }
  }
  async subscribe(req: Request, res: Response, next: NextFunction) {
    const subscriptionPayload = req.body;
    // Validate request body against defined validation rules
    await Promise.all(
      subredditValidators.subscriptionPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with subreddit logic
    try {
      await subredditService.subscribeSubreddit(req, subscriptionPayload);

      return res.status(HttpStatus.OK).json();
    } catch (error) {
      next(error);
    }
  }
  async unsubscribe(req: Request, res: Response, next: NextFunction) {
    const subscriptionPayload = req.body;
    // Validate request body against defined validation rules
    await Promise.all(
      subredditValidators.subscriptionPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with subreddit logic
    try {
      await subredditService.unsubscribeSubreddit(req, subscriptionPayload);

      return res.status(HttpStatus.OK).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new SubredditController();
