import { Request, Response } from 'express';
import { db } from '../config/db';

export const addTeam = async (req: Request, res: Response) => {
    const { name, championship_id, league_id, gk, def, mid, forward1, forward2, user_id, match_day } = req.body;
    
    try {
        const [teamId] = await db('my_team').insert({
          name,
          championship_id, 
          league_id,
          match_day,
          gk,
          def,
          mid,
          forward1,
          forward2,
          user_id
        }).returning('id');
    
        const newTeam = await db('my_team').where({ id: teamId }).first();
        console.log('Created new team:', newTeam);
        res.status(201).json({ message: 'Team created successfully', newTeam });
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

    const parsedUserId = parseInt(user_id, 10);

    if (isNaN(parsedUserId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const teams = await db('my_team')
            .where({ user_id: parsedUserId })
            .select('id', 'name', 'league_id', 'championship_id');  

        console.log(`Teams found for user ${parsedUserId}:`, teams);

        if (teams.length === 0) {
            return res.status(404).json({ message: 'No teams found for this user' });
        }

        res.json(teams);
    } catch (error) {
        console.error('Error getting Teams:', error);
        res.status(500).json({ 
            message: 'Error getting Teams', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};

export const getTeamDetails = async (req: Request, res: Response) => {
    const { teamId } = req.params;

    if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required' });
    }

    const parsedTeamId = parseInt(teamId, 10);

    if (isNaN(parsedTeamId)) {
        return res.status(400).json({ message: 'Invalid Team ID' });
    }

    try {
        const team = await db('my_team')
            .where({ id: parsedTeamId })
            .select('id', 'championship_id', 'name', 'gk', 'def', 'mid', 'forward1', 'forward2', 'match_day')
            .first();

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        console.error('Error getting Team details:', error);
        res.status(500).json({ 
            message: 'Error getting Team details', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
  
    console.log('Received update request for team:', id);
    console.log('Update data:', updateData);
  
    try {
      const updatedTeam = await db('my_team')
        .where({ id })
        .update(updateData)
        .returning('*');
  
      console.log('Updated team:', updatedTeam);
  
      if (updatedTeam.length === 0) {
        console.log('Team not found');
        return res.status(404).json({ message: 'Team not found' });
      }
  
      res.json(updatedTeam[0]);
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({ message: 'Error updating team', error: (error as Error).message });
    }
  };