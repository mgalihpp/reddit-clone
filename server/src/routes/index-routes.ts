import express, { Request, Response } from 'express';

const router = express.Router();

// GET request for the homepage
router.get('/', (req: Request, res: Response) => {
  res.send('hello'); // Renders the index.ejs view
});

export default router;
