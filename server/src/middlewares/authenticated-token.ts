import type { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { HttpError } from './error-handlers';
import userService from '@/services/user-service';

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
