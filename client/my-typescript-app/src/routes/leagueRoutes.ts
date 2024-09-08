// src/routes/leagueRoutes.ts

import express, { Request, Response } from 'express';
import knex from 'knex'; // Import your Knex instance

const router = express.Router();

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

router.post('/create', async (req: Request, res: Response) => {
  const { name, maxTeams, numMatchdays, createdBy } = req.body;
  const leagueCode = generateRandomId();

  if (maxTeams > 10) {
    return res.status(400).json({ error: 'Max teams cannot exceed 10.' });
  }
  if (numMatchdays > 20) {
    return res.status(400).json({ error: 'Number of matchdays cannot exceed 20.' });
  }

  try {
    const [leagueId] = await knex('leagues').insert({
      name,
      max_teams: maxTeams,
      league_code: leagueCode,
      created_by: createdBy,
      num_matchdays: numMatchdays,
    }).returning('id');
    await knex('user_leagues').insert({
      user_id: createdBy,
      league_id: leagueCode,
    });

    res.json({ leagueCode }); 
  } catch (error) {
    res.status(500).json({ error: 'Error creating league' });
  }
});

router.post('/join', async (req: Request, res: Response) => {
  const { leagueCode, userId } = req.body;
  
  try {
    const league = await knex('leagues').where({ league_code: leagueCode }).first();

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    await knex('user_leagues').insert({
      user_id: userId,
      league_id: league.id,
    });

    res.json({ message: 'Joined league successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error joining league' });
  }
});

export default router;
