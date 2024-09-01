import { Request, Response } from 'express';
import likeModel from '../models/likeModel';

export const addLike = async (req: Request, res: Response) => {
  try {
    const { user_id, championship_id, player_name, position } = req.body;

    if (!user_id || !championship_id || !player_name || !position) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await likeModel.addLike(user_id, championship_id, player_name, position);
    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error adding like:', errorMessage);
    res.status(500).json({ message: 'Error adding like', error: errorMessage });
  }
};

export const removeLike = async (req: Request, res: Response) => {
  try {
    const { user_id, championship_id, player_name, position } = req.body;

    if (!user_id || !championship_id || !player_name || !position) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await likeModel.removeLike(user_id, championship_id, player_name, position);
    res.json({ message: 'Like removed successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error removing like:', errorMessage);
    res.status(500).json({ message: 'Error removing like', error: errorMessage });
  }
};

export const getLikes = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const likes = await likeModel.getLikes(parseInt(user_id, 10));
    res.json({ message: 'Likes found successfully', likes });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error getting likes:', errorMessage);
    res.status(500).json({ message: 'Error getting likes', error: errorMessage });
  }
};
