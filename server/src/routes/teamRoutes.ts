import express from 'express';
import { addTeam, removeTeam, getTeams } from '../controllers/teamController';
import { db } from '../config/db';

const router = express.Router();

router.post("/", addTeam);

router.delete("/", removeTeam);

router.get("/:user_id", getTeams);

router.post('/addPlayer', async (req, res) => {
    const { teamId, playerId } = req.body;
  
    try {
      await db('my_team')
        .where('id', teamId)
        .update({ players: db.raw('array_append(players, ?)', [playerId]) });
      
      res.json({ message: 'Player added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding player', error });
    }
  })

  router.delete('/removePlayer', async (req, res) => {
    const { teamId, playerId } = req.body;
  
    try {
      await db('my_team')
        .where('id', teamId)
        .update({ players: db.raw('array_remove(players, ?)', [playerId]) });
      
      res.json({ message: 'Player removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing player', error });
    }
  });

  router.get('/teams/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await db('my_team')
            .where('id', teamId)
            .first();

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.json({
            id: teamId,
            players: [
                { id: team.gk, position: 'Goalkeeper' },
                { id: team.def, position: 'Defender' },
                { id: team.mid, position: 'Midfielder' },
                { id: team.forward1, position: 'Forward' },
                { id: team.forward2, position: 'Forward' },
            ],
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving team details', error });
    }
});
  
  export default router;
