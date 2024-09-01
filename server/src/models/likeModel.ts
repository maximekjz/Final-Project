import { db } from '../config/db';

const likeModel = {
    addLike: async (user_id: number, championship_id: number, player_name: string, position: string) => {
        try {
            const existingLike = await db('fav_players')
                .where({ user_id, championship_id, player_name, position })
                .first();

            if (existingLike) {
                return { message: 'Like already exists' };
            }

            await db('fav_players').insert({ user_id, championship_id, player_name, position });
            return { message: 'Like added successfully' };
        } catch (error) {
            throw error;
        }
    },

    removeLike: async (user_id: number, championship_id: number, player_name: string, position: string) => {
        try {
            await db('fav_players')
                .where({ user_id, championship_id, player_name, position })
                .delete();
        } catch (error) {
            throw error;
        }
    },

    getLikes: async (user_id: number) => {
        try {
            const likes = await db('fav_players')
                .select('player_name', 'position')
                .where({ user_id });
            return likes;
        } catch (error) {
            throw error;
        }
    }
};

export default likeModel;
