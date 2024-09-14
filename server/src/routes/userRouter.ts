import express from 'express';
import { registerUser, loginUser, getAllUsers, logoutUser } from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

// Register route = register a new user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", verifyToken, getAllUsers);
router.post("/logout", verifyToken, logoutUser);

router.get("/auth", verifyToken, (req, res) => {
    res.sendStatus(201)
})



export default router;
