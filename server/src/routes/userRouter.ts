import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

// Register route = register a new user
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/all", verifyToken, getAllUsers);

export default router;
