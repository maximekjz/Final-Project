import express from 'express';
import { createLeague, joinLeague } from '../controllers/leagueController'; 

const router = express.Router();

// Create a league
router.post('/create', createLeague);

// Join a league
router.post('/join', joinLeague);

export default router;
