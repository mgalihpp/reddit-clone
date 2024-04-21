import express from 'express';
import { authenticatedToken } from '@/middlewares/authenticated-token';
import subredditController from '@/controllers/subreddit-controller';

const router = express.Router();

router.post('/', authenticatedToken, subredditController.createSubreddit);
router.get('/', authenticatedToken, subredditController.getSlugSubreddit);
router.post('/subscribe', authenticatedToken, subredditController.subscribe);
router.post('/unsubscribe', authenticatedToken, subredditController.unsubscribe);

export default router;
