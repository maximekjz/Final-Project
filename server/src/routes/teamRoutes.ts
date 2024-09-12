import express from 'express';
import { addTeam, removeTeam, getTeams } from '../controllers/teamController';

const router = express.Router();

router.post("/create", addTeam);

router.delete("/remove", removeTeam);

router.get("/show", getTeams);

export default router;
