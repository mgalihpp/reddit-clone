import express from 'express';
import { authenticatedToken } from '@/middlewares/authenticated-token';
import postController from '@/controllers/post-controller';

const router = express.Router();

router.get('/', postController.getPost);
router.get('/followed', authenticatedToken, postController.getPostsByFollowedCommunity);
router.get('/criteria', postController.getPostsByCriteria);

export default router;
