import express from "express";
import { submitFinalExam } from "../controllers/examSubmitController.js";

const router = express.Router();

/**
 * POST /api/exam/submit
 * Final Exam Submission
 */
router.post("/submit", submitFinalExam);

export default router;
