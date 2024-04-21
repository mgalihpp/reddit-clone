import type { Request } from 'express';
import { db } from '@/configs/db';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/configs';
import type { ExtendedPost, PostPayload } from '@/types/post';

class PostService {
  async getPosts(): Promise<ExtendedPost[]> {
    // Logic to get all posts

    const posts = await db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true,
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    return posts;
  }

  async getPostsByFollowedCommunity(req: Request): Promise<ExtendedPost[]> {
    // logic to get all posts fromo followed community

    const followedCommunity = await db.subscription.findMany({
      where: {
        userId: req.user?.id, // user must be authenticated
      },
      include: {
        subreddit: true,
      },
    });

    const posts = await db.post.findMany({
      where: {
        subreddit: {
          name: {
            in: followedCommunity.map((sub) => sub.subreddit.name),
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true,
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    return posts;
  }
  async getPostsByCriteria(req: Request, payload: PostPayload): Promise<ExtendedPost[]> {
    let followedCommunitiesIds: string[] = [];
    let whereClause = {};
    const { subredditName, limit, page } = payload;

    // user must be authenticated
    if (req.user) {
      const followedCommunities = await db.subscription.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          subreddit: true,
        },
      });

      followedCommunitiesIds = followedCommunities.map((sub) => sub.subredditId);
    }

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (req.user) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit!),
      skip: (parseInt(page!) - 1) * parseInt(limit!), // skip should start from 0 for page 1
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return posts;
  }
}

export default new PostService();
