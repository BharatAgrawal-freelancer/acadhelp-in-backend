import express from "express";
import { getAllExamBatches ,  getExamBatchById} from "../controllers/getAllBatch.js";
import { protect } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// 🔥 Get All Batches (Protected)
router.get("/", protect, getAllExamBatches);
router.get("/:id",protect ,  getExamBatchById); 
export default router;
