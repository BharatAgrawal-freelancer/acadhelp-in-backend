import express from "express";
import {
  getPaginatedVideos,
  searchVideos,
  getRandomVideos
} from "../controllers/videoController.js";

const router = express.Router();

// Pagination (30 per page)
router.get("/", getPaginatedVideos);

// Search
router.get("/search", searchVideos);

// Random videos
router.get("/random", getRandomVideos);

export default router;