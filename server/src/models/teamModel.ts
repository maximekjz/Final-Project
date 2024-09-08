import { db } from '../config/db';

const isTeamValid = async (championship_id: number, players: number[]) => {  
    const invalidPlayers = await db('players')
        .whereIn('id', players)  
        .andWhere('championship_id', championship_id);

    return invalidPlayers.length === players.length;
};

const TeamModel = {
    addTeam: async (user_id: number, championship_id: number, league_id: string, match_day: number, gk: number, def: number, mid: number, forward1: number, forward2: number) => {
        const players = [gk, def, mid, forward1, forward2];

        if (!await isTeamValid(championship_id, players)) {
            return { message: 'One or more players do not belong to the selected championship' };
        }

        try {
            const existingTeam = await db('my_team')
                .where({ user_id, championship_id, league_id, match_day })
                .first();

            if (existingTeam) {
                return { message: 'Team already exists for this league and match day' };
            }

            await db('my_team').insert({ user_id, championship_id, league_id, match_day, gk, def, mid, forward1, forward2 });
            return { message: 'Team added successfully' };
        } catch (error) {
            throw error;
        }
    },

    removeTeam: async (user_id: number, championship_id: number, league_id: string, match_day: number) => {
        try {
            await db('my_team')
                .where({ user_id, championship_id, league_id, match_day })
                .delete();
        } catch (error) {
            throw error;
        }
    },

    getTeams: async (user_id: number) => {
        try {
            const teams = await db('my_team')
                .select('*')
                .where({ user_id });
            return teams;
        } catch (error) {
            throw error;
        }
    }
};

export default TeamModel;
