import express from 'express';
import { authenticatedToken } from './../middlewares/authenticated-token';
import postController from './../controllers/post-controller';
import commentController from './../controllers/comment-controller';

const router = express.Router();

router.get('/', postController.getPost);
router.get('/followed', authenticatedToken, postController.getPostsByFollowedCommunity);
router.get('/criteria', postController.getPostsByCriteria);
router.get('/:postId', postController.getPostById);
router.post('/create', authenticatedToken, postController.createPost);
router.patch('/comment', authenticatedToken, commentController.createComment);
router.delete('/:postId', authenticatedToken, postController.deletePost);
router.delete('/comment/:commentId', authenticatedToken, commentController.deleteComment);

export default router;
