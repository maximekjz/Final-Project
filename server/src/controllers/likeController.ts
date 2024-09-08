import { Request, Response } from 'express';
import likeModel from '../models/likeModel';

export const addLike = async (req: Request, res: Response) => {
  try {
    console.log('Request Body:', req.body);

    const { user_id, championship_id, player_id } = req.body;

    if (user_id === undefined || championship_id === undefined || player_id === undefined) {
      console.log('Missing fields:', { user_id, championship_id, player_id });
      return res.status(400).json({
        message: 'All fields are required',
        user_id,
        championship_id,
        player_id
      });
    }

    const result = await likeModel.addLike(user_id, championship_id, player_id);
    console.log('Like added successfully:', result);
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error adding like:', errorMessage);
    res.status(500).json({ message: 'Error adding like', error: errorMessage });
  }
};

export const removeLike = async (req: Request, res: Response) => {
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
};

export const getLikes = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const likes = await likeModel.getLikes(userId);
    res.status(200).json(likes);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error getting likes:', errorMessage);
    res.status(500).json({ message: 'Error getting likes', error: errorMessage });
  }
};