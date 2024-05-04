import express from 'express';
import authController from './../controllers/auth-controller';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail); // Optional

export default router;
