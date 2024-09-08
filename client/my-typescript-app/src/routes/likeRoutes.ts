import express, { Request, Response } from 'express';
import knex from 'knex'; // Import your Knex instance
import likeModel from '../../../../server/src/models/likeModel'

const router = express.Router();


router.post('/api/like/add', async (req: Request, res: Response) => {

    try {
        console.log('Request Body:', req.body);
    
        const { user_id, championship_id, player_id } = req.body;
    
        if (user_id === undefined || championship_id === undefined || player_id === undefined) {
          return res.status(400).json({
            message: 'All fields are required',
            user_id,
            championship_id,
            player_id
          });
        }
    
        const result = await likeModel.addLike(user_id, championship_id, player_id);
        res.json(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error adding like:', errorMessage);
        res.status(500).json({ message: 'Error adding like', error: errorMessage });
      }

});

router.delete('/api/like/remove', async (req: Request, res: Response) => {
  
    try {
        const { user_id, championship_id, player_id } = req.body;
    
        if (!user_id || !championship_id || !player_id) {
          return res.status(400).json({ message: 'All fields are required', user_id, championship_id, player_id });
        }
    
        await likeModel.removeLike(user_id, championship_id, player_id);
        res.json({ message: 'Like removed successfully' });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error removing like:', errorMessage);
        res.status(500).json({ message: 'Error removing like', error: errorMessage });
      }

});

export default router;
