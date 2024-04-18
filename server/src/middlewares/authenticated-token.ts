import type { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import { HttpError } from "./error-handlers";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

export const authenticatedToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(
      new HttpError(HttpStatus.UNAUTHORIZED, "Authentication token is missing")
    );
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return next(
        new HttpError(HttpStatus.FORBIDDEN, "Invalid or expired token")
      );
    }
    req.user = user as User;
    next();
  });
};
