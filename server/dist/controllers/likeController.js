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
exports.getLikes = exports.removeLike = exports.addLike = void 0;
const likeModel_1 = __importDefault(require("../models/likeModel"));
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Request Body:', req.body); // Ajouter ce log
        const { user_id, championship_id, player_name, position, player_id } = req.body;
        if (!user_id || !championship_id || !player_name || !position || !player_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const result = yield likeModel_1.default.addLike(user_id, championship_id, player_name, position, player_id);
        res.json(result);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error adding like:', errorMessage);
        res.status(500).json({ message: 'Error adding like', error: errorMessage });
    }
});
exports.addLike = addLike;
const removeLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, championship_id, player_name, position, player_id } = req.body;
        if (!user_id || !championship_id || !player_name || !position || !player_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        yield likeModel_1.default.removeLike(user_id, championship_id, player_name, position, player_id);
        res.json({ message: 'Like removed successfully' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error removing like:', errorMessage);
        res.status(500).json({ message: 'Error removing like', error: errorMessage });
    }
});
exports.removeLike = removeLike;
const getLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const likes = yield likeModel_1.default.getLikes(parseInt(user_id, 10));
        res.json({ message: 'Likes found successfully', likes });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error getting likes:', errorMessage);
        res.status(500).json({ message: 'Error getting likes', error: errorMessage });
    }
});
exports.getLikes = getLikes;
