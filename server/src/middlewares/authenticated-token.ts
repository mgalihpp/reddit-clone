import type { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { HttpError } from './error-handlers';
import userService from '@services/user-service';

/**
 * Middleware function to authenticate a token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {Promise<void>} - Returns a promise that resolves to void.
 */
export const authenticatedToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new HttpError(HttpStatus.UNAUTHORIZED, 'Authentication token is missing'));
  }

  try {
    const user = await userService.verifyTokenAndGetUser(token);
    req.user = user;
    next();
  } catch (error) {
    return next(new HttpError(HttpStatus.FORBIDDEN, 'Invalid or expired token'));
  }
};
