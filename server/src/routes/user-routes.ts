import express from 'express';
import userController from '@controllers/user-controller';
import { authenticatedToken } from '@middlewares/authenticated-token';

const router = express.Router();

router.get('/', authenticatedToken, userController.getUser);
router.put('/', authenticatedToken, userController.updateUser);

export default router;
