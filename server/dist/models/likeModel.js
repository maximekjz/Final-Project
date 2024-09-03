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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const likeModel = {
    addLike: (user_id, championship_id, player_name, position, player_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingLike = yield (0, db_1.db)('fav_players')
                .where({ user_id, championship_id, player_name, position, player_id })
                .first();
            if (existingLike) {
                return { message: 'Like already exists' };
            }
            yield (0, db_1.db)('fav_players').insert({ user_id, championship_id, player_name, position, player_id });
            return { message: 'Like added successfully' };
        }
        catch (error) {
            throw error;
        }
    }),
    removeLike: (user_id, championship_id, player_name, position, player_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, db_1.db)('fav_players')
                .where({ user_id, championship_id, player_name, position, player_id })
                .delete();
        }
        catch (error) {
            throw error;
        }
    }),
    getLikes: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const likes = yield (0, db_1.db)('fav_players')
                .select('player_name', 'position')
                .where({ user_id });
            return likes;
        }
        catch (error) {
            throw error;
        }
    })
};
exports.default = likeModel;
