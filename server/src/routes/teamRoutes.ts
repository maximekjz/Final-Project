import express from 'express';
import { addTeam, removeTeam, getTeams, getTeamDetails } from '../controllers/teamController';

const router = express.Router();

router.post("/create", addTeam);
router.delete("/remove", removeTeam);
router.get("/show/:user_id", getTeams);
router.get("/:teamId", getTeamDetails);  


export default router;
