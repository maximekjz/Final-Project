import express from 'express';
import { addLike, removeLike, getLikes } from '../controllers/likeController'; 


const router = express.Router();

router.post("/like", addLike);

router.get("/like/:user_id", getLikes);

router.delete("/like", removeLike)

export default router;
