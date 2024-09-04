import { Request, Response } from 'express';
import TeamModel from '../models/TeamModel';

export const addTeam = async (req: Request, res: Response) => {
    try {
        const { user_id, championship_id, league_id, match_day, gk, def, mid, forward1, forward2 } = req.body;

        if (!user_id || !championship_id || !league_id || !match_day || !gk || !def || !mid || !forward1 || !forward2) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await TeamModel.addTeam(user_id, championship_id, league_id, match_day, gk, def, mid, forward1, forward2);
        res.json(result);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error adding Team:', errorMessage);
        res.status(500).json({ message: 'Error adding Team', error: errorMessage });
    }
};

export const removeTeam = async (req: Request, res: Response) => {
    try {
        const { user_id, championship_id, league_id, match_day } = req.body;

        if (!user_id || !championship_id || !league_id || !match_day) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await TeamModel.removeTeam(user_id, championship_id, league_id, match_day);
        res.json({ message: 'Team removed successfully' });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error removing Team:', errorMessage);
        res.status(500).json({ message: 'Error removing Team', error: errorMessage });
    }
};

export const getTeams = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const teams = await TeamModel.getTeams(parseInt(user_id, 10));
        res.json({ message: 'Teams found successfully', teams });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error getting Teams:', errorMessage);
        res.status(500).json({ message: 'Error getting Teams', error: errorMessage });
    }
};
