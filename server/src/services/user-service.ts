import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

class UserService {
  verifyTokenAndGetUser(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user as User);
        }
      });
    });
  }
}

export default new UserService();
