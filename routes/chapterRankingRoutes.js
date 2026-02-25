import express from "express";
import { getAllChapterRankings } from "../controllers/chapterRankingController.js";

const router = express.Router();

// GET all chapters
router.get("/", getAllChapterRankings);

export default router;