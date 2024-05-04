import type { NextFunction, Request, Response } from 'express';
import authService from './../services/auth-service';
import authValidators from './../validators/auth-validators';
import { validationResult } from 'express-validator';
import HttpStatus from 'http-status-codes';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    // Handle login logic

    // Validate request body against defined validation rules
    await Promise.all(
      authValidators.loginValidationRules.map((validation) => validation.run(req)),
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with login logic
    try {
      const { email, password } = req.body;

      // Call the login method of AuthService
      const { user, accessToken, sessionToken } = await authService.login(
        email,
        password,
      );

      // Create a new user object without the password field
      delete (user as any)?.password;

      return res.status(HttpStatus.OK).json({
        message: 'Login successfully',
        user,
        token: accessToken,
        sessionToken: sessionToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    // Handle registration logic

    // validate request body against defined validation rules
    await Promise.all(
      authValidators.registerValidationRules.map((validation) => validation.run(req)),
    );
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    // If validation passes, proceed with login logic

    try {
      // Call the register method of AuthService to create a new user
      const { newUser, accessToken, sessionToken } = await authService.register(req.body);

      // Create a new user object without the password field
      delete (newUser as any)?.password;

      // Customize the HTTP response for successful registration
      return res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
        user: newUser,
        token: accessToken,
        sessionToken: sessionToken,
      });
    } catch (error) {
      // Handle database-related errors
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response) {
    // Handle email verification logic (optional)
  }
}

export default new AuthController();
