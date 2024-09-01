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
exports.joinLeague = exports.createLeague = void 0;
const db_1 = require("../config/db");
function generateRandomCode(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}
const createLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, max_teams, created_by, num_matchdays } = req.body;
    if (![5, 10].includes(max_teams)) {
        return res.status(400).json({ message: 'Invalid number of teams' });
    }
    if (![5, 10, 15, 20].includes(num_matchdays)) {
        return res.status(400).json({ message: 'Invalid number of matchdays' });
    }
    const leagueCode = generateRandomCode();
    try {
        const [leagueId] = yield (0, db_1.db)('leagues').insert({
            name,
            max_teams,
            league_code: leagueCode,
            created_by,
            num_matchdays,
        }).returning('id');
        res.status(201).json({ message: 'League created successfully', leagueId, leagueCode });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating the league' });
    }
});
exports.createLeague = createLeague;
const joinLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, league_code } = req.body;
    try {
        const league = yield (0, db_1.db)('leagues').where({ league_code }).first();
        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }
        const existingUserLeague = yield (0, db_1.db)('user_leagues').where({ user_id, league_id: league.id }).first();
        if (existingUserLeague) {
            return res.status(400).json({ message: 'User is already in this league' });
        }
        yield (0, db_1.db)('user_leagues').insert({
            user_id,
            league_id: league.id,
        });
        res.status(200).json({ message: 'Successfully joined the league' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error joining the league' });
    }
});
exports.joinLeague = joinLeague;
