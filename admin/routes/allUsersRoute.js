import express from "express";
import { protect } from "../middleware/adminAuthMiddleware.js";
import {
  getAllUsers,
  getSingleUser,
} from "../controllers/allUsersController.js";

const router = express.Router();

// 🔐 Protected Routes (Admin Token Required)
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getSingleUser);

export default router;
