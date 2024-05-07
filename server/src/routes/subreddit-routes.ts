import express from 'express';
import { authenticatedToken } from './../middlewares/authenticated-token';
import subredditController from './../controllers/subreddit-controller';
import postController from './../controllers/post-controller';
import commentController from './../controllers/comment-controller';

const router = express.Router();

router.post('/', authenticatedToken, subredditController.createSubreddit);
router.put('/', authenticatedToken, subredditController.updateSubreddit);
router.get('/', subredditController.getAllSubreddits);
router.post('/slug', subredditController.getSlugSubreddit);
router.post('/subscribe', authenticatedToken, subredditController.subscribe);
router.post('/unsubscribe', authenticatedToken, subredditController.unsubscribe);
router.patch('/post/vote', authenticatedToken, postController.votePost);
router.patch('/post/comment/vote', authenticatedToken, commentController.voteComment);

export default router;
