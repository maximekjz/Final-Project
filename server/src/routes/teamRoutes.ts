import express from 'express';
import { addOrUpdateTeam, removeTeam, getTeams, getTeamDetails, updateTeam } from '../controllers/teamController';

const router = express.Router();

router.post("/create", addOrUpdateTeam);
router.delete("/remove", removeTeam);
router.get("/show/:user_id", getTeams);
router.get("/:teamId", getTeamDetails);  
router.put('/:id', updateTeam);



export default router;
