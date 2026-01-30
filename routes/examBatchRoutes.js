import express from "express";
import {
  getBatchesByExam,
  getExamBatchById,
    getExamBatchQuestions
} from "../controllers/examBatchController.js";

const router = express.Router();

/*
  PUBLIC ROUTES
*/

router.get("/exam/:examId", getBatchesByExam);

router.get("/:batchId", getExamBatchById);
router.get(
  "/:batchId/questions",
  getExamBatchQuestions
);
export default router;

