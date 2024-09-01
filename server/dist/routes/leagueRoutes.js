"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leagueController_1 = require("../controllers/leagueController");
const router = express_1.default.Router();
// Create a league
router.post('/create', leagueController_1.createLeague);
// Join a league
router.post('/join', leagueController_1.joinLeague);
exports.default = router;
