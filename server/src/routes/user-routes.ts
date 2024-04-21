import express from 'express';
import UserController from '@controllers/user-controller';
import { authenticatedToken } from '@/middlewares/authenticated-token';

const router = express.Router();

router.get('/', authenticatedToken, UserController.getUser);

export default router;
