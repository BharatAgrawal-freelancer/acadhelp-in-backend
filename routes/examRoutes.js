import express from "express";
import {
  getAllExams,
  getExamById
} from "../controllers/examController.js";

const router = express.Router();

/*
  PUBLIC ROUTES
*/

router.get("/", getAllExams);

router.get("/:id", getExamById);

export default router;
