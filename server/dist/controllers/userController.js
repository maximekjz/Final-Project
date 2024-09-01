"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const userModel_1 = require("../models/userModel"); // Notez le renommage de l'importation pour éviter les conflits
(0, dotenv_1.config)(); // Charger les variables d'environnement
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, first_name, last_name } = req.body;
    const user = { username, password, email, first_name, last_name };
    try {
        const userInfo = yield (0, userModel_1.createUser)(user);
        res.status(201).json({
            message: "User registered successfully",
            user: userInfo,
        });
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    try {
        const user = yield (0, userModel_1.getUserByEmail)(email, username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
        const accessToken = jsonwebtoken_1.default.sign({ userid: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: "60s" });
        const refreshToken = jsonwebtoken_1.default.sign({ userid: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: "3d" });
        res.cookie("token", accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000, // 1 minute
        });
        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 * 24 * 3, // 3 days
        });
        yield (0, userModel_1.updateRefreshToken)(refreshToken, user.id);
        res.json({
            message: "Login successful",
            user: { userid: user.id, email: user.email },
            token: accessToken,
            refresh: refreshToken,
        });
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userModel_1.getAllUsers)(); // Utilisez le nom importé pour éviter les conflits
        res.json(users);
    }
    catch (error) {
        console.error("Error in getAllUsers:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.getAllUsers = getAllUsers;
