import express from 'express';
import { createLeague, getLeaguePlayers, joinLeague, showLeagues, getUserLeagues } from '../controllers/leagueController'; 

const router = express.Router();

// Create a league
router.post('/create', createLeague);

// Join a league
router.post('/join', joinLeague);

// Print joined leagues
router.get('/show', showLeagues);

router.get('/:leaguesId/players', getLeaguePlayers);

router.get('/user-leagues/:userId', getUserLeagues);


export default router;
