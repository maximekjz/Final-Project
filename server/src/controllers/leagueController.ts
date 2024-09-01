// controllers/leagueController.ts
import { Request, Response } from 'express';
import { db } from '../config/db';

function generateRandomCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

export const createLeague = async (req: Request, res: Response) => {
  const { name, max_teams, created_by, num_matchdays } = req.body;

  if (![5, 10].includes(max_teams)) {
    return res.status(400).json({ message: 'Invalid number of teams' });
  }
  if (![5, 10, 15, 20].includes(num_matchdays)) {
    return res.status(400).json({ message: 'Invalid number of matchdays' });
  }

  const leagueCode = generateRandomCode();

  try {
    const [leagueId] = await db('leagues').insert({
      name,
      max_teams,
      league_code: leagueCode,
      created_by,
      num_matchdays,
    }).returning('id');

    res.status(201).json({ message: 'League created successfully', leagueId, leagueCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating the league' });
  }
};

export const joinLeague = async (req: Request, res: Response) => {
  const { user_id, league_code } = req.body;

  try {
    const league = await db('leagues').where({ league_code }).first();

    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }

    const existingUserLeague = await db('user_leagues').where({ user_id, league_id: league.id }).first();

    if (existingUserLeague) {
      return res.status(400).json({ message: 'User is already in this league' });
    }

    await db('user_leagues').insert({
      user_id,
      league_id: league.id,
    });

    res.status(200).json({ message: 'Successfully joined the league' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error joining the league' });
  }
};
