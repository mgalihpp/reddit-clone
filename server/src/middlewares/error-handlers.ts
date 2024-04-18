import { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error); // Log the error for debugging

  // Determine the status code and error message
  const status = error instanceof HttpError ? error.status : 500;
  const message = error.message || "Internal Server Error";

  // Send the error response as JSON
  res.status(status).json({ error: message });
};
