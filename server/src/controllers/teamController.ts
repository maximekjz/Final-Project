import { Request, Response } from 'express';
import { db } from '../config/db';
import TeamModel from '../models/teamModel';

export const addTeam = async (req: Request, res: Response) => {
    const { name, championship_id, league_id, gk, def, mid, forward1, forward2, user_id } = req.body;
    
    try {
        const [teamId] = await db('my_team').insert({
          name,
          championship_id, 
          league_id,
          gk,
          def,
          mid,
          forward1,
          forward2,
          user_id
        }).returning('id');
    
        console.log('Team created:', { id: teamId, name, championship_id, league_id, gk, def, mid, forward1, forward2, user_id }); 
        res.status(201).json({ message: 'Team created successfully', id: teamId, name });
      } catch (error) {
        console.error('Error creating the team:', error);
        res.status(500).json({ message: 'Error creating the team', error: (error as Error).message });
      }
};

export const removeTeam = async (req: Request, res: Response) => {
    const { user_id, championship_id, league_id, match_day } = req.body;

    if (!user_id || !championship_id || !league_id || !match_day) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await db('my_team')
            .where({ user_id, championship_id, league_id, match_day })
            .del();
        res.json({ message: 'Team removed successfully' });
    } catch (error) {
        console.error('Error removing Team:', error);
        res.status(500).json({ message: 'Error removing Team', error: (error as Error).message });
    }
};

export const getTeams = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const teams = await db('my_team').where({ user_id: parseInt(user_id, 10) });
        res.json(teams);
    } catch (error) {
        console.error('Error getting Teams:', error);
        res.status(500).json({ message: 'Error getting Teams', error: (error as Error).message });
    }
};