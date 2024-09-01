"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = express_1.default.Router();
// Register route = register a new user
router.post("/register", userController_1.registerUser);
router.post("/login", userController_1.loginUser);
router.get("/all", verifyToken_1.verifyToken, userController_1.getAllUsers);
exports.default = router;
