import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import indexRouter from '@routes/index-routes';
import authRouter from '@routes/auth-routes';
import userRouter from '@routes/user-routes';
import postRouter from '@routes/post-routes';
import { errorHandler } from '@middlewares/error-handlers';

// Load environment variables from .env file
dotenv.config();

// Logger middleware function
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  console.log(`${currentDate} - ${req.method} ${req.url}`);
  next();
};

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:4173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }),
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(loggerMiddleware);

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
