import express from "express";
import { getAllPaidContent } from "../controllers/getAllPaidContentController.js";

const router = express.Router();

// GET → All Paid Content
router.get("/", getAllPaidContent);

export default router;