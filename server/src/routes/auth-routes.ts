import express from 'express';
import AuthController from '@controllers/auth-controller';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/verify-email', AuthController.verifyEmail); // Optional

export default router;
