import { Request, Response } from 'express';
import likeModel from '../models/likeModel';


export const addLike = async (req: Request, res: Response) => {
  try {
    console.log('Request Body:', req.body); // Ajouter ce log pour afficher les données reçues
    const { user_id, championship_id, player_name, position, playerid } = req.body;
    console.log('Request Body:', req.body); // Vérifier le contenu complet du corps de la requête

    // Vérifier si tous les champs requis sont présents
    if (user_id === undefined || championship_id === undefined || player_name === undefined || position === undefined || playerid === undefined) {
      console.log('Missing fields:', { user_id, championship_id, player_name, position, playerid });
      return res.status(400).json({
        message: 'All fields are required',
        user_id,
        championship_id,
        player_name,
        position,
        playerid
        
      });
    }
    console.log('user_id:', user_id);
    console.log('championship_id:', championship_id);
    console.log('player_name:', player_name);
    console.log('position:', position);
    console.log('playerid:', playerid);
    // Appeler le modèle pour ajouter le like
    const result = await likeModel.addLike(user_id, championship_id, player_name, position, playerid);
    res.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error adding like:', errorMessage);
    res.status(500).json({ message: 'Error adding like', error: errorMessage });
  }
};




export const removeLike = async (req: Request, res: Response) => {
  try {
    const { user_id, championship_id, player_name, position,playerid } = req.body;

    if (!user_id || !championship_id || !player_name || !position || !playerid) {
      return res.status(400).json({ message: 'All fields are required XX', user_id, championship_id, player_name, position, playerid });
    }

    await likeModel.removeLike(user_id, championship_id, player_name, position, playerid);
    res.json({ message: 'Like removed successfully' });
  } catch (error: unknown) {
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
    res.status(500).json({ message: 'Error getting likes'});
  }
};
