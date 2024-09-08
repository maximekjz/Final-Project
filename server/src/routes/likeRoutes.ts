import express from 'express';
import { addLike, removeLike, getLikes } from '../controllers/likeController'; 

const router = express.Router();

router.post('/like/add', addLike)

router.get('/like/:user_id', getLikes);

router.delete('/like/remove', removeLike)

export default router;
