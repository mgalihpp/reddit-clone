import type { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(HttpStatus.OK).json(req.user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
