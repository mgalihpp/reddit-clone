import HttpStatus from 'http-status-codes';
import jwtToken from './../utils/auth';
import { db } from './../configs/db';
import { redis } from './../configs/redis';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { updateUserPayload } from '../types/user';
import type { Request } from 'express';
import { exclude } from './../utils';
import { HttpError } from './../middlewares/error-handlers';

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

  async getUserByUsername(username: string) {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) throw new HttpError(HttpStatus.NOT_FOUND, 'User not found');

    const userPosts = await db.post.findMany({
      where: {
        authorId: user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        subreddit: true,
        comments: true,
        votes: true,
      },
    });

    const postAuthourWIthoutPassword = userPosts.map((post) => {
      exclude(post.author, ['email', 'password']);

      return post;
    });

    return { user, posts: postAuthourWIthoutPassword };
  }

  async updateUser(req: Request, payload: updateUserPayload) {
    const { name, image, username } = payload;

    const validUsername = username?.replace(/\s+/g, '');

    const user = await db.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        name,
        image,
        username: validUsername,
      },
    });

    const posts = await db.post.findMany({
      where: {
        authorId: req.user?.id,
      },
    });

    if (posts) {
      await Promise.all(
        posts.map(async (post) => {
          const postData = await redis.hgetall(`post:${post.id}`);
          if (postData) {
            postData.authorUsername = username;
            await redis.hmset(`post:${post.id}`, postData);
          }
        }),
      );
    }

    // refresh token
    const accessToken = jwtToken.generateRefreshToken(user);

    return { user, accessToken };
  }
}

export default new UserService();
