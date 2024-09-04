import express from 'express';
import { addLike, removeLike, getLikes } from '../controllers/likeController'; 


const router = express.Router();

router.post("/", (req, res) => {
    console.log('POST /api/like reached');
    // existing logic
    addLike(req, res);
});

router.get("/:user_id", getLikes);

router.delete("/", removeLike)

export default router;