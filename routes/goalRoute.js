import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  saveUserGoal,
  getUserGoalSummary
} from "../controllers/goalController.js";

const router = express.Router();

// ✅ Save / Update Goal
router.post("/save", protect, saveUserGoal);

// ✅ Get Goal Summary
router.get("/my", protect, getUserGoalSummary);

export default router;
