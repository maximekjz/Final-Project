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
    const result = await db.transaction(async trx => {
      // Créer la ligue
      const [leagueIdObj] = await trx('leagues').insert({
        name,
        championship_id, 
        max_teams,
        league_code: leagueCode,
        created_by,
        num_matchdays,
      }).returning('id');
    
      const leagueId = leagueIdObj.id;
    
      // Créer une équipe pour l'utilisateur qui crée la ligue
      const [teamIdObj] = await trx('my_team').insert({
        name: `${name} - Team ${created_by}`,
        user_id: created_by,
        league_id: leagueId,
        championship_id: championship_id,
        match_day: 1,
        gk: 0,
        def: 0,
        mid: 0,
        forward1: 0,
        forward2: 0,
      }).returning('id');
    
      const teamId = teamIdObj.id;

      await trx('user_leagues').insert({
        user_id: created_by,
        league_id: leagueId, 
        championship_id: championship_id
      });
    
      // Initialiser le classement général
      await trx('league_overall_rankings').insert({
        league_id: leagueId,
        team_id: teamId,
        rank: 1,
        points: 0,
        total_score: 0
      });
    
      // Initialiser le classement pour chaque journée
      for (let i = 1; i <= num_matchdays; i++) {
        await trx('league_matchday_rankings').insert({
          league_id: leagueId,
          team_id: teamId,
          match_day: i,
          rank: 1,
          points: 0,
          score: 0
        });
      }
    
      return { leagueId, leagueCode };
    });
    
    console.log({ name, championship_id, max_teams, created_by, num_matchdays, leagueId: result.leagueId, leagueCode: result.leagueCode }); 
    res.status(201).json({ message: 'League created successfully', leagueId: result.leagueId, leagueCode: result.leagueCode });
  } catch (error) {
    console.error('Error creating the league:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: `Error creating the league: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Unknown error occurred while creating the league' });
    }
  }
}

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

export const addRank = async (req: Request, res: Response) => {
  const { leagueId, scores } = req.body;
  
  try {
    await db.transaction(async trx => {
      for (let score of scores) {
        // Insérer ou mettre à jour le score pour la journée
        await trx.raw(`
          INSERT INTO league_matchday_rankings (league_id, team_id, match_day, score, points)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT (league_id, team_id, match_day)
          DO UPDATE SET 
            score = league_matchday_rankings.score + EXCLUDED.score,
            points = league_matchday_rankings.points + EXCLUDED.points
        `, [leagueId, score.team_id, score.match_day, score.score, Math.round(score.score)]);

        // Mettre à jour le classement général
        await trx.raw(`
          INSERT INTO league_overall_rankings (league_id, team_id, total_score, points)
          VALUES (?, ?, ?, ?)
          ON CONFLICT (league_id, team_id)
          DO UPDATE SET 
            total_score = league_overall_rankings.total_score + EXCLUDED.total_score,
            points = league_overall_rankings.points + EXCLUDED.points
        `, [leagueId, score.team_id, score.score, Math.round(score.score)]);
      }

      // Mettre à jour les rangs pour le classement de la journée
      await trx.raw(`
        UPDATE league_matchday_rankings
        SET rank = subquery.rank
        FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY league_id, match_day 
            ORDER BY points DESC, score DESC
          ) as rank
          FROM league_matchday_rankings
          WHERE league_id = ?
        ) AS subquery
        WHERE league_matchday_rankings.id = subquery.id
      `, [leagueId]);

      // Mettre à jour les rangs pour le classement général
      await trx.raw(`
        UPDATE league_overall_rankings
        SET rank = subquery.rank
        FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY league_id
            ORDER BY points DESC, total_score DESC
          ) as rank
          FROM league_overall_rankings
          WHERE league_id = ?
        ) AS subquery
        WHERE league_overall_rankings.id = subquery.id
      `, [leagueId]);
    });

    res.json({ message: 'Scores saved and rankings updated successfully' });
  } catch (error) {
    console.error('Error saving scores and updating rankings:', error);
    res.status(500).json({ error: 'Failed to save scores and update rankings' });
  }
};

export const getLeague = async (req: Request, res: Response) => {
  const { leagueId } = req.params;
  console.log(leagueId);
  
  if (!leagueId || leagueId === 'undefined') {
    return res.status(400).json({ error: 'Valid League ID is required' });
  }
  
  try {
    const league = await db.select('*').from('leagues').where({ id: leagueId }).first();
    if (league) {
      res.json(league);
    } else {
      res.status(404).json({ error: 'League not found' });
    }
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}