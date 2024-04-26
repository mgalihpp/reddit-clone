import jwtToken from '@/utils/auth';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { Request } from 'express';
import { updateUserPayload } from '@/types/user';
import { db } from '@/configs/db';
import { redis } from '@/configs/redis';

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

  async updateUser(req: Request, payload: updateUserPayload) {
    const { name, image, username } = payload;

    const user = await db.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        name,
        image,
        username,
      },
    });

    const posts = await db.post.findMany({
      where: {
        authorId: req.user?.id,
      },
    });

    await Promise.all(
      posts.map(async (post) => {
        await redis.hset(`post:${post.id}`, {
          authorUsername: username,
        });
      }),
    );

    // refresh token 
    const accessToken = jwtToken.generateRefreshToken(user);

    return { user, accessToken };
  }
}

export default new UserService();
