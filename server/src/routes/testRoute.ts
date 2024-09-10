// testRoute.ts
import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Test route is working' });
});

export default router;




