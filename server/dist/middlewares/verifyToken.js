"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load environment variables
const { ACCESS_TOKEN_SECRET } = process.env;
const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.token || req.headers["x-access-token"];
    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jsonwebtoken_1.default.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden", error: err.message });
        }
        if (decoded) {
            req.userid = decoded.userid;
            req.email = decoded.email;
        }
        next();
    });
};
exports.verifyToken = verifyToken;
