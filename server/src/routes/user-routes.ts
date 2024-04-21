import express from 'express';
import userController from '@controllers/user-controller';
import { authenticatedToken } from '@/middlewares/authenticated-token';

const router = express.Router();

router.get('/', authenticatedToken, userController.getUser);

export default router;
