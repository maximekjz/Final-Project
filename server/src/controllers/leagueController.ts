// controllers/leagueController.ts
import { Request, Response } from 'express';
import { db } from '../config/db';
import knex from 'knex';

function generateRandomCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

export const createLeague = async (req: Request, res: Response) => {
  const { name, championship_id, max_teams, created_by, num_matchdays } = req.body;

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
      championship_id, 
      max_teams,
      league_code: leagueCode,
      created_by,
      num_matchdays,
    }).returning('id');

    const leagueIdNumber = typeof leagueId === 'object' ? leagueId.id : leagueId;

    await db('user_leagues').insert({
      user_id: created_by,
      league_id: leagueIdNumber, 
      championship_id: championship_id
    });

    console.log({ name, championship_id, max_teams, created_by, num_matchdays, leagueIdNumber, leagueCode }); 
    res.status(201).json({ message: 'League created successfully', leagueIdNumber, leagueCode });
  } catch (error) {
    console.error('Error creating the league:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: `Error creating the league: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Unknown error occurred while creating the league' });
    }
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
      championship_id: league.championship_id
    });

    res.status(200).json({ message: 'Successfully joined the league' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error joining the league' });
  }
};


export const showLeagues = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10);
  const championshipId = req.query.championshipId ? parseInt(req.query.championshipId as string, 10) : undefined;

  console.log('Parsed userId:', userId, 'championshipId:', championshipId);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }
  
  try {
    let query = db('leagues')
      .join('user_leagues', 'leagues.id', '=', 'user_leagues.league_id')
      .where('user_leagues.user_id', userId)
      .select('leagues.id', 'leagues.name', 'leagues.championship_id', 'leagues.league_code');

    if (championshipId) {
      query = query.where('user_leagues.championship_id', championshipId);
    }

    console.log('Executing query:', query.toString());
    const leagues = await query;
    
    console.log('Fetched leagues:', leagues);
    res.json(leagues);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getLeaguePlayers = async (req: Request, res: Response) => {
  const { leagueId } = req.params;

  try {
    const players = await db('players')
      .where({ league_id: leagueId })
      .select('*');

    res.json(players);
  } catch (error) {
    console.error('Error fetching league players:', error);
    res.status(500).json({ message: 'Error fetching league players' });
  }
};

export const getUserLeagues = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const userLeagues = await db('leagues')
      .join('user_leagues', 'leagues.id', '=', 'user_leagues.league_id')
      .where('user_leagues.user_id', userId)
      .select('leagues.id', 'leagues.name', 'leagues.championship_id');
    
    res.json(userLeagues);
  } catch (error) {
    console.error('Error fetching user leagues:', error);
    res.status(500).json({ message: 'Error fetching user leagues' });
  }
};