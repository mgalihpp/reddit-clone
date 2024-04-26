import type { Request } from 'express';
import { db } from '@/configs/db';
import type { subredditPayload, subscriptionPayload } from '@/types/subreddit';
import { HttpError } from '@/middlewares/error-handlers';
import HttpStatus from 'http-status-codes';
import { exclude } from '@/utils';

class SubredditService {
  async createSubreddit(req: Request, payload: subredditPayload): Promise<string> {
    const { name } = payload;

    const isSubredditNameExists = await this.checkSubredditName(name);

    if (isSubredditNameExists) {
      throw new HttpError(HttpStatus.CONFLICT, 'Subreddit name is already exits');
    }

    const newSubreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: req.user?.name,
      },
    });

    // make creator to auto subscribe the community
    await db.subscription.create({
      data: {
        userId: req.user?.id as string,
        subredditId: newSubreddit.id,
      },
    });

    return newSubreddit.name;
  }

  async getSlugSubreddit(req: Request, payload: subredditPayload) {
    const { name: slug } = payload;

    const subreddit = await db.subreddit.findFirst({
      where: {
        name: slug,
      },
      include: {
        posts: {
          include: {
            author: true,
            subreddit: true,
            votes: true,
            comments: true,
          },
        },
      },
    });

    const subscription = await db.subscription.findFirst({
      where: {
        subreddit: {
          name: slug,
        },
        user: {
          id: req.user?.id,
        },
      },
    });

    const isSubcribed = !!subscription;

    if (!subreddit) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Subreddit not found');
    }

    const memberCount = await db.subscription.count({
      where: {
        subreddit: {
          name: subreddit.name,
        },
      },
    });

    // map posts without password
    subreddit.posts = subreddit.posts.map((post) => {
      exclude(post.author, ['email', 'password']);

      return post;
    });

    return {
      subreddit,
      isSubcribed,
      memberCount,
    };
  }

  async subscribeSubreddit(req: Request, payload: subscriptionPayload) {
    const { subredditId } = payload;

    const subscriptionExists = this.checkSubscrition(req, subredditId);

    if (!subscriptionExists) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        'You already subscribed to this subreddit',
      );
    }

    // create subreddit and associate it with the user
    await db.subscription.create({
      data: {
        subredditId,
        userId: req.user?.id as string,
      },
    });

    return subredditId;
  }

  async unsubscribeSubreddit(req: Request, payload: subscriptionPayload) {
    const { subredditId } = payload;

    const subscriptionExists = this.checkSubscrition(req, subredditId);

    if (!subscriptionExists) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        'You not been subscribed to this subreddit, yet.',
      );
    }

    // create subreddit and associate it with the user
    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: req.user?.id as string,
        },
      },
    });

    return subredditId;
  }

  async checkSubscrition(req: Request, subredditId: string) {
    // check if user has already subscribed or not
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: req.user?.id,
      },
    });

    return subscriptionExists;
  }

  async checkSubredditName(name: string) {
    let isSubredditNameExists: boolean;

    const subreddit = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subreddit) {
      isSubredditNameExists = true;
    } else {
      isSubredditNameExists = false;
    }

    return isSubredditNameExists;
  }

  async checkSubscribedSubreddit(req: Request, subredditId: string) {
    // check if user has already subscribed or not
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: req.user?.id,
      },
    });

    return subscriptionExists;
  }
}

export default new SubredditService();
