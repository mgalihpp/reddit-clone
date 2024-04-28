import type { Request } from 'express';
import { db } from '@/configs/db';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/configs';
import type {
  CachedPost,
  CreatePostPayload,
  ExtendedPost,
  PostPayload,
  PostPayloadById,
  PostVoteAuthor,
  VotePostPayload,
} from '@/types/post';
import subredditService from '@services/subreddit-service';
import HttpStatus from 'http-status-codes';
import { HttpError } from '@/middlewares/error-handlers';
import { redis } from '@/configs/redis';
import { exclude } from '@/utils';

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

    const postsAuthorWithoutPassword = posts.map((post) => {
      exclude(post.author, ['email', 'password']);

      return post;
    });

    return postsAuthorWithoutPassword;
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

    const postsAuthorWithoutPassword = posts.map((post) => {
      exclude(post.author, ['email', 'password']);

      return post;
    });

    return postsAuthorWithoutPassword;
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

    const postsAuthorWithoutPassword = posts.map((post) => {
      exclude(post.author, ['email', 'password']);

      return post;
    });

    return postsAuthorWithoutPassword;
  }

  async getPostById(payload: PostPayloadById) {
    const cachedPost = (await redis.hgetall(`post:${payload.postId}`)) as CachedPost;

    let post: PostVoteAuthor | null = null;

    if (!cachedPost) {
      post = await db.post.findUnique({
        where: {
          id: payload.postId,
        },
        include: {
          votes: true,
          author: true,
        },
      });
    }

    if (!post && !cachedPost) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Post not found');
    }

    if (post) {
      const AuthorWithoutPassword = exclude(post?.author, [
        'email',
        'password',
      ] as never[]);

      const postAuthourWIthoutPassword = {
        ...post,
        author: AuthorWithoutPassword,
      };
      return { postAuthourWIthoutPassword, cachedPost };
    }

    return { post, cachedPost };
  }

  async createPost(req: Request, payload: CreatePostPayload) {
    const { title, content, subredditId } = payload;

    // verify user is subscribed to passed subreddit id
    const subscription = await subredditService.checkSubscribedSubreddit(
      req,
      subredditId,
    );

    if (!subscription) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        'You must be subscribed to this subreddit to create posts!',
      );
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: req.user?.id as string,
        subredditId,
      },
    });

    return post;
  }

  async votePost(req: Request, payload: VotePostPayload) {
    const CACHE_AFTER_UPVOTES = 1;

    const { postId, voteType } = payload;

    // check if user has already voted on this post
    const existingVote = await db.vote.findFirst({
      where: {
        userId: req.user?.id,
        postId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              userId: req.user?.id as string,
              postId,
            },
          },
        });

        // Recount the votes
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1;
          if (vote.type === 'DOWN') return acc - 1;
          return acc;
        }, 0);

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
          const cachePayload: CachedPost = {
            authorUsername: post.author.username ?? '',
            content: JSON.stringify(post.content),
            id: post.id,
            title: post.title,
            currentVote: null,
            createdAt: post.createdAt,
          };

          await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
        }

        return 'OK';
      }

      // if vote type is different, update the vote
      await db.vote.update({
        where: {
          userId_postId: {
            userId: req.user?.id as string,
            postId,
          },
        },
        data: {
          type: voteType,
        },
      });

      // Recount the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === 'UP') return acc + 1;
        if (vote.type === 'DOWN') return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          authorUsername: post.author.username ?? '',
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
      }

      return 'OK';
    }

    // if no existing vote, create a new vote
    await db.vote.create({
      data: {
        type: voteType,
        userId: req.user?.id as string,
        postId,
      },
    });

    // Recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1;
      if (vote.type === 'DOWN') return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorUsername: post.author.username ?? '',
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      };

      await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
    }

    return 'OK';
  }
}

export default new PostService();
