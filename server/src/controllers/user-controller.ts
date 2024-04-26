import userService from '@/services/user-service';
import userValidators from '@/validators/user-validators';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpStatus from 'http-status-codes';

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(HttpStatus.OK).json(req.user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const payload = req.body;

    // Validate request body against defined validation rules
    await Promise.all(
      userValidators.updateUserPayloadValidationRules.map((validation) =>
        validation.run(req),
      ),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }

    // If validation passes, proceed with user logic
    try {
      const { user, accessToken } = await userService.updateUser(req, payload);

      delete (user as any)?.password;

      return res.status(HttpStatus.OK).json({ user: user, token: accessToken });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
