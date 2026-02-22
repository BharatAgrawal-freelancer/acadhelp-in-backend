import express from "express";
import {
    getFolders,
  createFolder,
  deleteFolder,
  renameFolder,
  addQuestionToFolder,
  getFolderQuestions
} from "../controllers/bookMarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Folder Routes */
router.get("/folders", protect, getFolders);
router.post("/folder", protect, createFolder);
router.delete("/folder/:folderId", protect, deleteFolder);
router.put("/folder/:folderId", protect, renameFolder);

/* Question Routes */
router.post("/folder/:folderId/add-question", protect, addQuestionToFolder);
router.get("/folder/:folderId/questions", protect, getFolderQuestions);

export default router;