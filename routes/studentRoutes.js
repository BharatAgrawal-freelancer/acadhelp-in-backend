import express from "express";
import {
  createOrUpdateProfile,
  getStudentProfile,
  isNewStudent
} from "../controllers/studentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { getMyPaidContents } from "../controllers/studentController.js";
const router = express.Router();

router.post("/profile", protect, createOrUpdateProfile);

router.get("/profile", protect, getStudentProfile);

router.get("/is-new", protect, isNewStudent);
router.get("/paid-content", protect, getMyPaidContents);
export default router;
