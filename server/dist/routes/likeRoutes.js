"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likeController_1 = require("../controllers/likeController");
const router = express_1.default.Router();
router.post("/", (req, res) => {
    console.log('POST /api/like reached');
    // existing logic
    (0, likeController_1.addLike)(req, res);
});
router.get("/:user_id", likeController_1.getLikes);
router.delete("/", likeController_1.removeLike);
exports.default = router;
