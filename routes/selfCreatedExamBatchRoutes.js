import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRandomJeeMainBatch,
  createChapterBasedJeeMainBatch,   // 👈 add this
  getSelfExamBatchById,
  getSelfExamBatchQuestions
} from "../controllers/selfCreatedExamBatchController.js";

const router = express.Router();

/*
  RANDOM FULL MOCK
*/
router.post("/random", protect, createRandomJeeMainBatch);

/*
  CHAPTER BASED MOCK
*/
router.post("/chapter", protect, createChapterBasedJeeMainBatch);  

/*
  FETCH BATCH META
*/
router.get("/:batchId", protect, getSelfExamBatchById);

/*
  FETCH QUESTIONS
*/
router.get("/:batchId/questions", protect, getSelfExamBatchQuestions);

export default router;