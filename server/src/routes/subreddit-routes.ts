import express from 'express';
import { authenticatedToken } from '@/middlewares/authenticated-token';
import subredditController from '@/controllers/subreddit-controller';
import postController from '@/controllers/post-controller';

const router = express.Router();

router.post('/', authenticatedToken, subredditController.createSubreddit);
router.get('/', authenticatedToken, subredditController.getSlugSubreddit);
router.post('/subscribe', authenticatedToken, subredditController.subscribe);
router.post('/unsubscribe', authenticatedToken, subredditController.unsubscribe);
router.patch('/post/vote', authenticatedToken, postController.votePost);

export default router;
