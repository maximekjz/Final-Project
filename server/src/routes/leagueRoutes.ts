import express from 'express';
import { createLeague, joinLeague, showLeagues } from '../controllers/leagueController'; 

const router = express.Router();

// Create a league
router.post('/create', createLeague);

// Join a league
router.post('/join', joinLeague);

// Print joined leagues
router.get('/show', showLeagues);

export default router;
