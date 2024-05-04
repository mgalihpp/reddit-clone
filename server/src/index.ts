import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import indexRouter from './routes/index-routes';
import authRouter from './routes/auth-routes';
import userRouter from './routes/user-routes';
import postRouter from './routes/post-routes';
import subredditRouter from './routes/subreddit-routes';
import { errorHandler } from './middlewares/error-handlers';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './utils/uploadthing';

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
  console.log(`${currentDate} - ${req.method} ${req.url} - ${res.statusCode}`);
  next();
};

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }),
);

// Uploadthing
app.use(
  '/api/uploadthing',
  createRouteHandler({
    router: uploadRouter,
    config: {
      isDev: true, // this must be false in production
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/subreddit', subredditRouter);

// Error handling middleware
app.use(errorHandler);
app.use(loggerMiddleware);

app.listen(5000, () => console.log('Server started on port http://localhost:5000'));
